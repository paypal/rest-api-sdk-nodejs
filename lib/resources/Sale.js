import generate from '../generate';

/**
 * Completed payments are referred to as sale transactions
 * @return {Object} sale functions
 */
function sale() {
    const baseURL = '/v1/payments/sale/';
    const operations = ['get', 'refund'];

    let ret = {
        baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default sale;
