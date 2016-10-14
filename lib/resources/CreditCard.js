import generate from '../generate';

/**
 * Store credit cards information securely in vault
 * @return {Object} Credit Card functions
 */
function creditCard() {
    const baseURL = '/v1/vault/credit-card/';
    const operations = ['create', 'get', 'update', 'del', 'delete', 'list'];

    let ret = {
        baseURL
    };
    ret = generate.mixin(ret, operations);
    return ret;
}

export default creditCard;
