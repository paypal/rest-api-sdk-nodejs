/* Copyright 2015-2016 PayPal, Inc. */
'use strict';

var TOKEN_STATUS = {
    NOT_FOUND: 0,
    VALID: 1,
    REFRESHING: 2
};

var Queue = require('./queue');

function Store() {
    this.store = {};
}

Store.prototype._init = function _init(clientId) {
    if (!this.store[clientId]) {
        this.store[clientId] = {
            token: null,
            status: TOKEN_STATUS.NOT_FOUND,
            queue: new Queue()
        };
    }
};

Store.prototype._set = function (clientId, prop, data) {
    this._init(clientId);
    var item = this.store[clientId];
    item[prop] = data;
};
Store.prototype._get = function (clientId, prop) {
    this._init(clientId);
    return this.store[clientId][prop];
};

Store.prototype.getToken = function getToken(clientId) {
    return this._get(clientId, 'token');
};

Store.prototype.setToken = function setToken(clientId, token) {
    this._set(clientId, 'token', token);
};

Store.prototype.getStatus = function getToken(clientId) {
    return this._get(clientId, 'status');
};


Store.prototype.setStatus = function setStatus(clientId, status) {
    this._set(clientId, 'status', status);
};

Store.prototype.getQueue = function getQueue(clientId) {
    return this._get(clientId, 'queue');
};


Store.TOKEN_STATUS = TOKEN_STATUS;

module.exports = exports = Store;