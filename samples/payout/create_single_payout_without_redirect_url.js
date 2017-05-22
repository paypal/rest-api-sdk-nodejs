/*

Example to demonstrate creating a single synchronous payout, meaning the payment
will be executed immediately and response returned in the batch_status entry in the 
returned JSON object without any redirect_url for authentication.

*/

"use strict";
var paypal = require('../../');
require('../configure');

var auth = {
    "grant_type": "authorization_code"
};

var access_token;

paypal.generateToken(auth, function(error, at) {
    console.log("Access Token :" + at);
    access_token = at;
});

var sender_batch_id = Math.random().toString(36).substring(9);

var create_payout_json = {
    "sender_batch_header": {
        "sender_batch_id": sender_batch_id,
        "email_subject": "You have a payment"
    },
    "items": [{
        "recipient_type": "EMAIL",
        "amount": {
            "value": 0.90,
            "currency": "USD"
        },
        "receiver": "shirt-supplier-three@mail.com",
        "note": "Thank you.",
        "sender_item_id": "item_1"
    }]
};

var auth_key = {
    "Authorization": access_token
}


paypal.payout.create(create_payout_json, 'true', auth_key, function(error, payout) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log("Create Payout Response");
        console.log(JSON.stringify(payout));
    }
});

