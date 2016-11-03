import generate from '../generate';
import api from '../api';

/**
 * An individual Payout item
 * @return {Object} payout object functions
 */
function payoutItem() {
    const baseURL = '/v1/payments/payouts-item/';
    const operations = ['get'];

    let ret = {
        baseURL,
        /**
         * Cancel an existing payout/transaction in UNCLAIMED state
         * Explicitly define `cancel` method here to avoid having to pass in an empty `data` parameter
         * as required by the generated generic `cancel` operation.
         * 
         * @param  {String}   id     Payout item id
         * @param  {Object|Function}   config     Configuration parameters e.g. client_id, client_secret override or callback
         * @param  {Function} cb
         * @return {Object}          Payout item details object with transaction status of RETURNED
         */
        cancel: function cancel(id, config, cb) {
            api.executeHttp('POST', `${this.baseURL}${id}/cancel`, {}, config, cb);
        }
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default payoutItem;
