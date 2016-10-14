import generate from '../generate';
import api from '../api';

/**
 * Create or get details of payments
 * @return {Object} Payment functions
 */
function payment() {
    const baseURL = '/v1/payments/payment/';
    const operations = ['create', 'update', 'get', 'list'];

    let ret = {
        baseURL,
        /**
         * Execute(complete) a PayPal or payment that has been approved by the payer
         * @param  {String}   id     Payment identifier
         * @param  {Object}   data   Transaction details if updating a payment
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {Object}          Payment object for completed PayPal payment
         */
        execute: function execute(id, data, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/execute`, data, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default payment;
