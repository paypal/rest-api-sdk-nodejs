import generate from '../generate';

/**
 * Refunds on direct and captured payments
 * @return {Object} refund functions
 */
function refund() {
    const baseURL = '/v1/payments/refund/';
    const operations = ['get'];

    let ret = {
        baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default refund;
