/* Copyright 2015-2016 PayPal, Inc. */
'use strict';

// The status constants are exported as a static property of the store
// because the NOT_FOUND status is required as a default value for clients
// otherwise the constants could be moved closer to its usage
var TOKEN_STATUS = {
    NOT_FOUND: 0,
    VALID: 1,
    REFRESHING: 2
};

var Queue = require('./queue');

/**
 * @class Store
 * @classdesc A data store that holds for each client token, token status and a call queue
 * @constructor
 */
function Store() {
    this.store = {};
}

/**
 * Initializes the store for a client with default values if is not already initialized
 * @param {String} clientId The client id to initialize
 * @private
 */
Store.prototype._init = function _init(clientId) {
    if (!this.store[clientId]) {
        this.store[clientId] = {
            token: null,
            status: TOKEN_STATUS.NOT_FOUND,
            queue: new Queue()
        };
    }
};

/**
 * Sets a value in a property of the store for a client initializing the key first if necessary
 * @param {String} clientId The client id to store the value
 * @param {String} prop The property to set
 * @param {*} data The value to set
 * @private
 */
Store.prototype._set = function (clientId, prop, data) {
    this._init(clientId);
    var item = this.store[clientId];
    item[prop] = data;
};

/**
 * Retrieves a property of the store for a client initializing the key first if necessary
 * @param {String} clientId The client id to store the value
 * @param {String} prop The property to retrieve
 * @return {*} The value stored in the property
 * @private
 */
Store.prototype._get = function (clientId, prop) {
    this._init(clientId);
    return this.store[clientId][prop];
};

/**
 * Returns the token of a given client
 * @param {String} clientId The client id to retrieve the token
 * @return {Object} The token
 */
Store.prototype.getToken = function getToken(clientId) {
    return this._get(clientId, 'token');
};

/**
 * Sets the token of a client
 * @param {String} clientId The client id to set the token
 * @param {Object} token The token to store
 */
Store.prototype.setToken = function setToken(clientId, token) {
    this._set(clientId, 'token', token);
};

/**
 * Returns the token status of a client
 * @param {String} clientId The client id to retrieve the token
 * @return {Number} The token status code
 */
Store.prototype.getStatus = function getStatus(clientId) {
    return this._get(clientId, 'status');
};

/**
 * Sets the token status of a client
 * @param {String} clientId The client id to set the status
 * @param {Number} status The token status code
 */
Store.prototype.setStatus = function setStatus(clientId, status) {
    this._set(clientId, 'status', status);
};

/**
 * Returns the call queue of a client
 * @param {String} clientId The client id to retrieve the queue
 * @return {Queue} The call queue
 */
Store.prototype.getQueue = function getQueue(clientId) {
    return this._get(clientId, 'queue');
};

/**
 * Token status constants
 * @static
 * @type {{NOT_FOUND: number, VALID: number, REFRESHING: number}}
 */
Store.TOKEN_STATUS = TOKEN_STATUS;

module.exports = exports = Store;