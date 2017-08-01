"use strict";

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var sinon = require('sinon');

chai.use(require('sinon-chai'));

var EventEmitter = require('events').EventEmitter;

var Store = require('../lib/store');
var Queue = require('../lib/store/queue');

describe('Client store', function () {

    describe('Store functionality', function () {
        var store = new Store();

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
        var queue, queueSpy;

        it('should return a new queue per client without explicit initialization', function () {
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
            var item = {foo: 'bar'};
            queue = store.getQueue('clientId2');
            queueSpy = sinon.spy();
            queue.once('enqueue', queueSpy);

            var result = queue.enqueue(item);
            // .to.be.a('promise') does not work in this version of chai
            expect(result).to.respondTo('then');
            expect(queueSpy).to.be.calledOnce;
            expect(queueSpy).to.be.calledWithExactly(item);
        });

        it('should keep track of the number of items in the queue', function () {
            queue = store.getQueue('clientId3');
            queue.enqueue({foo: 'bar'});
            expect(queue.size()).to.equal(1);
        });

        it('should allow to peek the first item in the queue without removing it', function () {
            queue = store.getQueue('clientId4');
            queueSpy = sinon.spy();
            queue.once('dequeue', queueSpy);

            queue.enqueue({foo: 'bar'});
            queue.enqueue({bar: 'baz'});
            // Call twice to check is the same value
            var value1 = queue.peek();
            var value2 = queue.peek();
            expect(value1).to.have.property('foo', 'bar');
            expect(value2).to.have.property('foo', 'bar');
            expect(queue.size()).to.equal(2);
            expect(queueSpy).not.to.be.called;
        });

        it('should allow to remove an item from the queue', function (done) {
            queue = store.getQueue('clientId5');
            queueSpy = sinon.spy();
            var resolveSpy = sinon.spy();
            var rejectSpy = sinon.spy();
            queue.once('dequeue', queueSpy);

            var item1 = {foo: 'bar'};
            var item2 = {bar: 'baz'};
            var promise = queue.enqueue(item1);
            queue.enqueue(item2);
            promise.then(resolveSpy, rejectSpy);

            var value = queue.dequeue();
            expect(value).to.equal(item1);
            expect(queue.peek()).to.equal(item2);
            expect(queue.size()).to.equal(1);
            expect(queueSpy).to.be.calledOnce;
            expect(queueSpy).to.be.calledWithExactly(value);

            setTimeout(function () {
                expect(resolveSpy).to.be.calledWithExactly(value);
                expect(rejectSpy).not.to.be.called;
                done();
            });

        });

        it('should allow to clear the queue', function () {
            queue = store.getQueue('clientId6');
            queueSpy = sinon.spy();
            var flushSpy = sinon.spy();
            var haltSpy = sinon.spy();
            queue.once('dequeue', queueSpy);
            queue.once('flush', flushSpy);
            queue.once('halt', haltSpy);

            queue.enqueue({foo: 'bar'});
            queue.enqueue({bar: 'baz'});
            queue.flush();
            expect(queue.peek()).to.be.undefined;
            expect(queue.size()).to.equal(0);
            expect(queueSpy).to.be.calledOnce;
            expect(flushSpy).to.be.calledOnce;
            expect(flushSpy).to.be.calledWithExactly(/*no arguments*/);
            expect(haltSpy).not.to.be.called;
            expect(haltSpy).not.to.be.called;
        });

    });
});
