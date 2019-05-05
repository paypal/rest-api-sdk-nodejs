'use strict';

const querystring = require('querystring'); // eslint-disable-line no-unused-vars
/**
 Creates a billing agreement. In the JSON request body, include an `agreement` object with the name, description, start date, ID of the plan on which to base the agreement, and customer and shipping address information.
 **/

class SubscriptionCreateRequest {
  constructor() {
    this.path = '/v1/payments/billing/subscriptions/?';
    this.verb = 'POST';
    this.body = null;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  requestBody(subscription) {
    this.body = subscription;
    return this;
  }
}

module.exports = {SubscriptionCreateRequest: SubscriptionCreateRequest};
