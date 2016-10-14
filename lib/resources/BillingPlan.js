import generate from '../generate';
import api from '../api';

/**
 * Create planned sets of future recurring payments at periodic intervals (sometimes known as “subscriptions”).
 * @return {Object} billing plan functions
 */
function billingPlan() {
    const baseURL = '/v1/payments/billing-plans/';
    const operations = ['create', 'get', 'list', 'update'];

    let ret = {
        baseURL,
        /**
         * Activate a billing plan so that it can be used to form
         * billing agreements with users
         * @param  {String}   id     Billing plan identifier
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb     
         * @return {}          Returns the HTTP status of 200 if the call is successful
         */
        activate: function activate(id, config, cb) {
            const activate_attributes = [
                {
                    "op": "replace",
                    "path": "/",
                    "value": {
                        "state": "ACTIVE"
                    }
                }
            ];
            api.executeHttp('PATCH', this.baseURL + id, activate_attributes, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default billingPlan;
