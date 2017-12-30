'use strict';

const querystring = require('querystring');
/**
 Creates a checkout order.
 **/

class CheckoutOrderCreateRequest {

  constructor() {
    this.path = '/v1/checkout/orders';
    this.verb = 'POST';
    this.body = null;
    this.headers = {
        'Content-Type': 'application/json'
        };
  }
  requestBody(body) {
    this.body = body;
    return this;
  }

// this call requires a PayPal-Request-Id and PayPal-Partner-Attribution-Id

  requestHeaders(hdrs) {
    this.headers.push(hdrs);
    return this;
  }
}

module.exports = {CheckoutOrderCreateRequest: CheckoutOrderCreateRequest};