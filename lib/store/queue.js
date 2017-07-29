/* Copyright 2015-2016 PayPal, Inc. */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Promise = global.Promise || require('es6-promise');

function Queue() {
    EventEmitter.call(this);
    this.setMaxListeners(0);
    this._queue = [];
}

util.inherits(Queue, EventEmitter);

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

Queue.prototype.dequeue = function dequeue() {
    var config = this._queue.shift();
    if (config) {
        this.emit('dequeue', config);
    }
    return config;
};

Queue.prototype.peek = function peek() {
    return this._queue[0];
};

Queue.prototype.size = function size() {
    return this._queue.length;
};

Queue.prototype._clear = function _clear(err) {
    var length = this.size();
    var config;
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

Queue.prototype.flush = function flush() {
    this._clear();
};

Queue.prototype.halt = function halt(err) {
    this._clear(err);
};

module.exports = exports = Queue;