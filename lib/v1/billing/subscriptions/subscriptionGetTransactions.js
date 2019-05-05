'use strict';

const querystring = require('querystring'); // eslint-disable-line no-unused-vars
/**
 Shows details for a billing agreement, by ID.
 **/

class SubscriptionGetTransactionsRequest {
  constructor(subscription_id) {
    this.path = '/v1/billing/subscriptions/{subscription_id}/transactions?';
    this.path = this.path.replace(
      '{subscription_id}',
      querystring.escape(subscription_id)
    );
    this.verb = 'GET';
    this.body = null;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }
}

module.exports = {SubscriptionGetTransactionsRequest: SubscriptionGetTransactionsRequest};
