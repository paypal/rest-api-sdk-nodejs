import generate from '../generate';
import api from '../api';

/**
 * Retrieving, capturing, voiding, and reauthorizing previously created authorizations
 * @return {Object} authorization functions
 */
function authorization() {
    const baseURL = '/v1/payments/authorization/';
    const operations = ['get', 'capture'];

    let ret = {
        baseURL,
        /**
         * Void a previously authorized payment
         * @param  {String}   id     authorization identifier
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb        
         * @return {Object}          Authorization object
         */
        void: function voidAuthorization(id, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/void`, {}, config, cb);
        },
        /**
         * Reauthorize a PayPal account payment
         * @param  {String}   id     authorization identifier
         * @param  {object}   data   amount object with total e.g. 7.00 and currency e.g. USD
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {}          
         */
        reauthorize: function reauthorize(id, data, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/reauthorize`, data, config, cb);
        },
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default authorization;
