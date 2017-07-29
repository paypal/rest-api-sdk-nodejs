"use strict";

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var EventEmitter = require('events').EventEmitter;

var Store = require('../lib/store');
var Queue = require('../lib/store/queue');

describe('Client store', function () {

    describe('Store functionality', function () {
        var store = new Store();

        // TODO: Add sinon to test emitters
        it('should have methods to manipulate tokens, tokens status and call queues', function () {
            expect(store).to.respondTo('getToken');
            expect(store).to.respondTo('setToken');
            expect(store).to.respondTo('getStatus');
            expect(store).to.respondTo('setStatus');
            expect(store).to.respondTo('getQueue');
        });

        it('should expose token status constants', function () {
            expect(Store).to.have.property('TOKEN_STATUS');
            expect(Store.TOKEN_STATUS).to.have.keys('NOT_FOUND', 'REFRESHING', 'VALID');
        });

        it('should set a token for a client id without explicit initialization of the client', function () {
            function setToken() {
                store.setToken('clientId1', {token: 'abc'});
            }
            expect(setToken).not.to.throw();
        });

        it('should initialize a null value for a client token on access', function () {
            var token = store.getToken('clientId2');
            expect(token).to.be.null;
        });

        it('should initialize a default token status of NOT_FOUND', function () {
            var status = store.getStatus('clientId3');
            expect(status).to.equal(Store.TOKEN_STATUS.NOT_FOUND);
        });

        it('should set a token status without explicit initialization', function () {
            function setStatus() {
                store.setStatus('clientId4', Store.TOKEN_STATUS.REFRESHING);
            }
            expect(setStatus).not.to.throw();
        });
    });

    describe('Call queues', function () {
        var store = new Store();

        it('should return a new queue per client without explicit initialization', function () {
            var queue;
            function getQueue() {
                queue = store.getQueue('clientId1');
            }

            expect(getQueue).not.to.throw();
            expect(queue).to.be.an.instanceOf(EventEmitter);
            expect(queue).to.be.an.instanceOf(Queue);
            expect(queue).to.respondTo('enqueue');
            expect(queue).to.respondTo('dequeue');
            expect(queue).to.respondTo('peek');
            expect(queue).to.respondTo('size');
            expect(queue).to.respondTo('flush');
            expect(queue).to.respondTo('halt');
        });

        it('should return a promise when a new item is enqueued', function () {
            var queue = store.getQueue('clientId2');
            // .to.be.a('promise') does not work in this version of chai
            expect(queue.enqueue({foo: 'bar'})).to.respondTo('then');
        });

        it('should keep track of the number of items in the queue', function () {
            var queue = store.getQueue('clientId3');
            queue.enqueue({foo: 'bar'});
            expect(queue.size()).to.equal(1);
        });

        it('should allow to peek the first item in the queue without removing it', function () {
            var queue = store.getQueue('clientId4');
            queue.enqueue({foo: 'bar'});
            queue.enqueue({bar: 'baz'});
            // Call twice to check is the same value
            var value1 = queue.peek();
            var value2 = queue.peek();
            expect(value1).to.have.property('foo', 'bar');
            expect(value2).to.have.property('foo', 'bar');
            expect(queue.size()).to.equal(2);
        });

        it('should allow to remove an item from the queue', function () {
            var queue = store.getQueue('clientId5');
            queue.enqueue({foo: 'bar'});
            queue.enqueue({bar: 'baz'});
            var value = queue.dequeue();
            expect(value).to.have.property('foo', 'bar');
            expect(queue.peek()).to.have.property('bar', 'baz');
            expect(queue.size()).to.equal(1);
        });

        it('should allow to clear the queue', function () {
            var queue = store.getQueue('clientId6');
            queue.enqueue({foo: 'bar'});
            queue.enqueue({bar: 'baz'});
            queue.flush();
            expect(queue.peek()).to.be.undefined;
            expect(queue.size()).to.equal(0);
        });

    });
});
