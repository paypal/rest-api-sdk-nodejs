/* Copyright 2015-2016 PayPal, Inc. */
"use strict";

var client = require('./client');
var utils = require('./utils');
var configuration = require('./configure');
var Promise = global.Promise || require('es6-promise');
var Store = require('./store');
var TOKEN_STATUS = Store.TOKEN_STATUS;

var MISSING_CLIENT_MESSAGE = 'Invalid client_id and secret. Did you forget to set those?';

// Replace token_persist object with a client store to manage tokens, statuses and call queues
var store = new Store();

/**
 * Set up configuration globally such as client_id and client_secret,
 * by merging user provided configurations otherwise use default settings
 * @param  {Object} options Configuration parameters passed as object
 * @return {undefined}
 */
var configure = exports.configure = function configure(options) {
    if (options !== undefined && typeof options === 'object') {
        configuration.default_options = utils.merge(configuration.default_options, options);
    }

    if (configuration.default_options.mode !== 'sandbox' && configuration.default_options.mode !== 'live') {
        throw new Error('Mode must be "sandbox" or "live"');
    }
};

/**
 * Generate new access token by making a POST request to /oauth2/token by
 * exchanging base64 encoded client id/secret pair or valid refresh token.
 *
 * Otherwise authorization code from a mobile device can be exchanged for a long
 * living refresh token used to charge user who has consented to future payments.
 * @param  {Object|Function}   config Configuration parameters such as authorization code or refresh token
 * @param  {Function} cb     Callback function
 * @return {String}          Access token or Refresh token
 */
var generateToken = exports.generateToken = function generateToken(config, cb) {
    var result;

    if (typeof config === "function") {
        cb = config;
        config = configuration.default_options;
    } else if (!config) {
        config = configuration.default_options;
    } else {
        config = utils.merge(config, configuration.default_options, true);
    }

    var payload = 'grant_type=client_credentials';
    if (config.authorization_code) {
        payload = 'grant_type=authorization_code&response_type=token&redirect_uri=urn:ietf:wg:oauth:2.0:oob&code=' + config.authorization_code;
    } else if (config.refresh_token) {
        payload = 'grant_type=refresh_token&refresh_token=' + config.refresh_token;
    }

    var basicAuthString = 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64');

    var http_options = {
        schema: config.schema || configuration.default_options.schema,
        host: config.host || utils.getDefaultApiEndpoint(config.mode) || configuration.default_options.host,
        port: config.port || configuration.default_options.port,
        headers: utils.merge({
            'Authorization': basicAuthString,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }, configuration.default_options.headers, true)
    };

    var clientId = config.client_id;
    if (!clientId) {
        throw new Error(MISSING_CLIENT_MESSAGE);
    }
    result = client.invoke('POST', '/v1/oauth2/token', payload, http_options)
        .then(function (res) {
            var token = null;
            if (res) {
                if (!config.authorization_code && !config.refresh_token) {
                    var seconds = new Date().getTime() / 1000;
                    res.created_at = seconds;
                    store.setToken(clientId, res);
                    store.setStatus(clientId, TOKEN_STATUS.VALID);
                }

                if (!config.authorization_code) {
                    token = res.token_type + ' ' + res.access_token;
                }
                else {
                    token = res.refresh_token;
                }
            }

            // Pass the token using promises or callbacks
            if (!cb) {
                return token;
            }
            cb(null, token);
        })
        .catch(function (err) {
            // Clear the token for the client
            store.setToken(clientId, null);
            store.setStatus(clientId, TOKEN_STATUS.NOT_FOUND);
            // If no callback is provided propagate the error in the promise chain
            if (!cb) {
                return Promise.reject(err);
            }
            // Otherwise use the callback to signal the error
            cb(err, null);
        });

    // If a callback was provided don't return the promise so users have to use one way or the other but not both
    if (cb) {
        result = undefined;
    }
    // Otherwise return the promise to be handled by user code
    return result;
};

/* Update authorization header with new token obtained by calling generateToken */
/**
 * Updates http Authorization header to newly created access token
 * @param  {Object}   http_options   Configuration parameters such as authorization code or refresh token
 * @param  {Function}   error_callback
 * @param  {Function} callback
 * @deprecated
 */
function updateToken(http_options, error_callback, callback) {
    var clientId = http_options.client_id;
    var status = store.getStatus(clientId);

    function onResolve() {
        setAuthorizationHeader(http_options, clientId);
        callback();
    }

    function onReject(err) {
        error_callback(err, null);
    }

    // If the token for this client is not refreshing already, refresh the token
    if (status !== TOKEN_STATUS.REFRESHING) {
        store.setStatus(clientId, TOKEN_STATUS.REFRESHING);
        generateToken(http_options).then(onResolve, onReject);
    } else {
        // If the method is invoked more than once (eg. inside an async.parallel call) just queue a new item and wait
        // for the call in progress to finish to set the token
        store
            .getQueue(clientId)
            .enqueue({http_options: http_options}) // Do not use the http_options object directly
            .then(onResolve, onReject);
    }
}

function setAuthorizationHeader(http_options, clientId) {
    var tokenInfo = store.getToken(clientId);
    http_options.headers.Authorization = tokenInfo.token_type + ' ' + tokenInfo.access_token;
}

/**
 * Makes a PayPal REST API call. Reuses valid access tokens to reduce
 * round trips, handles 401 error and token expiration.
 * @param  {String}   http_method           A HTTP Verb e.g. GET or POST
 * @param  {String}   path                  Url endpoint for API request
 * @param  {Data}   data                    Payload associated with API request
 * @param  {Object|Function}   http_options Configurations for settings and Auth
 * @param  {Function} cb                    Callback function
 */
var executeHttp = exports.executeHttp = function executeHttp(http_method, path, data, http_options, cb) {
    if (typeof http_options === "function") {
        cb = http_options;
        http_options = null;
    }
    if (!http_options) {
        http_options = configuration.default_options;
    } else {
        http_options = utils.merge(http_options, configuration.default_options, true);
    }

    //Get host endpoint using mode
    http_options.host = http_options.host || utils.getDefaultApiEndpoint(http_options.mode);

    // correlation-id is deprecated in favor of client-metadata-id
    if (http_options.client_metadata_id) {
        http_options.headers['Paypal-Client-Metadata-Id'] = http_options.client_metadata_id;
    }
    else if (http_options.correlation_id) {
        http_options.headers['Paypal-Client-Metadata-Id'] = http_options.correlation_id;
    }

    // Retry call function for callback mode
    function retryInvoke() {
        client.invoke(http_method, path, data, http_options, cb);
    }

    // Checks if the call requires authorization
    function reauthorize(error) {
        return error && error.httpStatusCode === 401 && http_options.client_id && http_options.headers.Authorization;
    }

    // Refresh the token and flush or halt the call queue
    function refresh(clientId) {
        var queue = store.getQueue(clientId);
        return generateToken(http_options)
            .then(function () {
                queue.flush();
            })
            .catch(function (err) {
                queue.halt(err);
                return Promise.reject(err);
            });
    }

    // Retry the call but after the token has been refreshed and the call queue is flushing
    function queueCall(clientId) {
        return store.getQueue(clientId).enqueue({
            http_method: http_method,
            path: path,
            data: data,
            http_options: http_options
        }).then(function (config) {
            setAuthorizationHeader(http_options, clientId);
            return client.invoke(config.http_method, config.path, config.data, config.http_options);
        });
    }

    var clientId = http_options.client_id;
    // Promises
    if (!cb) {
        if (!clientId) {
            return Promise.reject(new Error(MISSING_CLIENT_MESSAGE));
        }

        switch (store.getStatus(clientId)) {
        case TOKEN_STATUS.REFRESHING:
            // If the token for this clientId is refreshing just add the call to the queue
            return queueCall(clientId);
        case TOKEN_STATUS.VALID:
            // If the token is valid check for expiration before making the call
            if (!utils.checkExpiredToken(store.getToken(clientId))) {
                return client
                    .invoke(http_method, path, data, http_options)
                    .catch(function (err) {
                        var promise;
                        if (reauthorize(err)) {
                            // If the call fails and:
                            //   the token can be refreshed add this call to the queue and refresh the token
                            //   the token is already refreshing(concurrent requests) just queue the call
                            promise = queueCall(clientId);
                            if (store.getStatus(clientId) === TOKEN_STATUS.REFRESHING) {
                                return promise;
                            }
                            store.setStatus(clientId, TOKEN_STATUS.REFRESHING);
                            refresh(clientId);
                            return promise;
                        }

                        return Promise.reject(err);
                    });
            } else {
                // If the token is expired refresh it before continuing
                store.setStatus(clientId, TOKEN_STATUS.REFRESHING);
                refresh(clientId);
                return queueCall(clientId);
            }

        case TOKEN_STATUS.NOT_FOUND:
            // If no token is stored for this clientId get one first
            store.setStatus(clientId, TOKEN_STATUS.REFRESHING);
            refresh(clientId);
            return queueCall(clientId);
            break;
        }
    } else {
        // Callbacks
        if (!clientId) {
            cb(new Error(MISSING_CLIENT_MESSAGE));
        }
        // If client_id exists with an unexpired token and a refresh token is not provided, reuse cached token
        if (store.getStatus(clientId) === TOKEN_STATUS.VALID && !utils.checkExpiredToken(store.getToken(clientId)) && !http_options.refresh_token) {
            setAuthorizationHeader(http_options, clientId);
            client.invoke(http_method, path, data, http_options, function (error, response) {
                // Don't reprompt already authenticated user for login by updating Authorization header
                // if token expires
                if (reauthorize(error)) {
                    http_options.headers.Authorization = null;
                    updateToken(http_options, cb, retryInvoke);
                } else {
                    cb(error, response);
                }
            });
        } else {
            updateToken(http_options, cb, retryInvoke);
        }
    }
};
