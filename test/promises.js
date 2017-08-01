/* Copyright 2015-2016 PayPal, Inc. */
"use strict";

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    Promise = global.Promise || require('es6-promise');

var paypal = require('../');

// Changing the client id is required so tokens from other tests are not reused
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'clientId1',
    'client_secret': 'clientSecret'
});


describe('Promises', function () {
    var payout_item_id1 = 'VXURV6Y48P898';
    var payout_item_id2 = '5UD3FSLKEZ63C';
    var payout_item_id3 = 'UK6HNZEQX8M8S';
    var sender_batch_id = "t1000";


    var create_batch_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": 0.99,
                    "currency": "USD"
                },
                "receiver": "shirt-supplier-one@mail.com",
                "note": "Thank you.",
                "sender_item_id": "item_1"
            },
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": 0.90,
                    "currency": "USD"
                },
                "receiver": "shirt-supplier-two@mail.com",
                "note": "Thank you.",
                "sender_item_id": "item_2"
            },
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": 0.15,
                    "currency": "USD"
                },
                "receiver": "shirt-supplier-three@mail.com",
                "note": "Thank you.",
                "sender_item_id": "item_3"
            }
        ]
    };

    if (process.env.NOCK_OFF !== 'true') {
        require('./mocks/promises');
    }

    it('joins requests with different clientIds and refreshing tokens without failing', function () {
        return paypal.payout.create(create_batch_payout_json) // no token for client, 1s expiration, 1.1s request delay
            .then(function (payout) {
                expect(payout).to.have.property('batch_header');
                return Promise.all([
                    paypal.payoutItem.get(payout_item_id1), // token expired
                    paypal.payoutItem.get(payout_item_id2, { // different client, no token
                        'client_id': 'clientId2',
                        'client_secret': 'clientSecret2'
                    }),
                    paypal.payoutItem.get(payout_item_id3) // refreshing
                ]);
            })
            .then(function (payoutItems) {
                expect(payoutItems).to.have.length(3);
                payoutItems.forEach(function (item) {
                    expect(item).to.have.property('payout_item_id');
                });
            });
    });

    it('should refresh the token when concurrent calls receive a 401 response', function () {
        return Promise.all([
            paypal.payout.create(create_batch_payout_json), // valid token, receive 401, not refreshing
            paypal.payoutItem.get(payout_item_id1) // valid token, receive 401, refreshing
        ]).then(function (response) {
            expect(response).to.have.length(2);
            expect(response[0]).to.have.property('batch_header');
            expect(response[1]).to.have.property('payout_item_id');
        });
    });

    it('should queue the call when a response receives a 401 response', function () {
        var delayedPromise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                paypal.payoutItem.get(payout_item_id1).then(resolve, reject);
            }, 100);
        });
        return Promise.all([
            paypal.payout.create(create_batch_payout_json), // valid token, receive 401, not refreshing
            delayedPromise // refreshing
        ]).then(function (response) {
            expect(response).to.have.length(2);
            expect(response[0]).to.have.property('batch_header');
            expect(response[1]).to.have.property('payout_item_id');
        });
    });

});
