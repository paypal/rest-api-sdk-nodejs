import generate from '../generate';
import api from '../api';

/**
 * Take action on a payment with the intent of order
 * @return {Object} order functions
 */
function order() {
    const baseURL = '/v1/payments/orders/';
    const operations = ['get', 'capture'];

    let ret = {
        baseURL,
        /**
         * Void an existing order
         * @param  {String}   id     Order identifier
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb        
         * @return {Object}          Order object, with state set to voided
         */
        void: function voidOrder(id, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/do-void`, {}, config, cb);
        },
        /**
         * Authorize an order
         * @param  {String}   id     Order identifier
         * @param  {Object}   data   Amount object with total and currency
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb 
         * @return {Object}          Authorization object
         */
        authorize: function authorize(id, data, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/authorize`, data, config, cb);
        },
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default order;
