import generate from '../generate';

/**
 * Look up and refund captured payments
 * @return {Object} capture functions
 */
function capture() {
    const baseURL = '/v1/payments/capture/';
    const operations = ['get', 'refund'];

    let ret = {
        baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default capture;
