'use strict';
/* eslint-disable comma-dangle*/

module.exports = {
  SubscriptionActivateRequest: require('./subscriptionActivateRequest').SubscriptionActivateRequest,
  SubscriptionCancelRequest: require('./subscriptionCancelRequest').SubscriptionCancelRequest,
  SubscriptionCapturePayment: require('./subscriptionCapturePayment').SubscriptionCapturePayment,
  SubscriptionCreateRequest: require('./subscriptionCreateRequest').SubscriptionCreateRequest,
  SubscriptionGetRequest: require('./subscriptionGetRequest').SubscriptionGetRequest,
  SubscriptionGetTransactionsRequest: require('./subscriptionGetTransactions').SubscriptionGetTransactionsRequest,
  SubscriptionSuspendRequest: require('./subscriptionSuspendRequest').SubscriptionSuspendRequest,
  SubscriptionUpdateQuantity: require('./subscriptionUpdateQuantity').SubscriptionUpdateQuantity,
  SubscriptionUpdateRequest: require('./subscriptionUpdateRequest').SubscriptionUpdateRequest,
};
