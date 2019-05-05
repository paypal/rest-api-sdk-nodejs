"use strict";

const querystring = require("querystring"); // eslint-disable-line no-unused-vars
/**
 Re-activates a suspended billing agreement, by ID. In the JSON request body, include an `agreement_state_descriptor` object with with a note that describes the reason for the re-activation and the agreement amount and currency.
 **/

class SubscriptionSuspendRequest {
  constructor(subscription_id) {
    this.path = "/v1/billing/subscriptions/{subscription_id}/suspend?";
    this.path = this.path.replace(
      "{subscription_id}",
      querystring.escape(subscription_id)
    );
    this.verb = "POST";
    this.body = null;
    this.headers = {
      "Content-Type": "application/json"
    };
  }

  requestBody(suspendReason) {
    this.body = suspendReason;
    return this;
  }
}

module.exports = { SubscriptionSuspendRequest: SubscriptionSuspendRequest };
