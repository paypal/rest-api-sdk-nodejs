/* Copyright 2015-2016 PayPal, Inc. */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Promise = global.Promise || require('es6-promise');

/**
 * @class Queue
 * @classdesc A queue implementation with promise support
 * @extends EventEmitter
 * @constructor
 */
function Queue() {
    EventEmitter.call(this);
    this.setMaxListeners(0);
    this._queue = [];
}

util.inherits(Queue, EventEmitter);

/**
 * Add an item to the end of the queue
 * @param {Object} config The item to store
 * @return {Promise} A promise that resolves with the item (or rejects with an error) when the item is removed from the queue
 * @fires Queue#enqueue
 */
Queue.prototype.enqueue = function enqueue(config) {
    var self = this;

    var promise = new Promise(function (resolve, reject) {
        var handler = function _handler(cnf, err) {
            if (config === cnf) {
                if (err) {
                    reject(err);
                } else {
                    resolve(config);
                }
                self.removeListener('dequeue', _handler);
            }
        };
        self.on('dequeue', handler);
    });

    self._queue.push(config);
    self.emit('enqueue', config);
    return promise;
};

/**
 * Removes the first item from the queue
 * @return {Object} The stored item
 * @fires Queue#dequeue
 */
Queue.prototype.dequeue = function dequeue() {
    var config = this._queue.shift();
    if (config) {
        this.emit('dequeue', config);
    }
    return config;
};

/**
 * Gets the first item from the queue without removing it
 * @return {Object} The stored item
 */
Queue.prototype.peek = function peek() {
    return this._queue[0];
};

/**
 * The size of the queue
 * @return {Number} The number of items in the queue
 */
Queue.prototype.size = function size() {
    return this._queue.length;
};

/**
 * Synchronously removes all items in the queue
 * @param {Error} [err] If the error is provided all items rejects instead of resolving
 * @private
 * @fires Queue#dequeue
 * @fires Queue#flush
 * @fires Queue#halt
 */
Queue.prototype._clear = function _clear(err) {
    // Clearing the queue synchronously is required to avoid new items to be added while it clears
    var length = this.size();
    var config;
    // Although is possible to call dequeue once for every item doing so is slower
    // than emitting the event and clearing the queue afterwards
    for (var i = 0; i < length; i++) {
        config = this._queue[i];
        if (err) {
            this.emit('dequeue', config, err);
        } else {
            this.emit('dequeue', config);
        }
    }
    this._queue = [];
    this.emit(err ? 'halt' : 'flush');
};

/**
 * Clears the queue resolving all promises with their items
 * @fires Queue#dequeue
 * @fires Queue#flush
 */
Queue.prototype.flush = function flush() {
    this._clear();
};

/**
 * Clears the queue rejecting all promises with an error
 * @fires Queue#dequeue
 * @fires Queue#halt
 */
Queue.prototype.halt = function halt(err) {
    this._clear(err);
};

module.exports = exports = Queue;