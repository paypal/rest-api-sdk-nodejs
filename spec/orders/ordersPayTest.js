'use strict';

const chai = require('chai');
const client = require('../test_harness').client();
const OrdersPayRequest = require('../../lib/paypalrestsdk').OrdersPayRequest;

describe('OrdersPayRequest', function () {
  xit('pays an order', function () {
    let orderId = "73C032779K264335A";
    let request = new OrdersPayRequest(orderId);
    request.requestBody({
      "disbursement_mode": "INSTANT"
    });

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);

      chai.assert.equal(orderId, r.result.order_id);
      chai.assert.equal("APPROVED", r.result.status);
    });
  });
});
