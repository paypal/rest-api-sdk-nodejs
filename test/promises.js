/* Copyright 2015-2016 PayPal, Inc. */
"use strict";

var chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    Promise = global.Promise || require('es6-promise');

var paypal = require('../');
require('./configure');


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

    it('uses promise style request', function () {
        return paypal.payout.create(create_batch_payout_json).then(function (payout) {
            expect(payout.batch_header.payout_batch_id).to.not.equal(null);
            expect(payout.batch_header.sender_batch_header.sender_batch_id).to.equal(sender_batch_id);
            expect(payout.links).to.not.be.empty;
        });
    });

    it('joins requests with different clientIds and refreshing tokens without failing', function () {
        return Promise.all([
            paypal.payoutItem.get(payout_item_id1),
            paypal.payoutItem.get(payout_item_id2, {
                'client_id': 'client_id',
                'client_secret': 'client_secret'
            }),
            paypal.payoutItem.get(payout_item_id3)
        ]).then(function (payoutItems) {
            expect(payoutItems).not.to.be.empty;
        });
    });

});
