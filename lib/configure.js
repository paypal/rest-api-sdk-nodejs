const sdkVersion = exports.sdkVersion = require('../package').version;
const userAgent = exports.userAgent = `PayPalSDK/PayPal-node-SDK ${sdkVersion} (node ${process.version}-${process.arch}-${process.platform}; OpenSSL ${process.versions.openssl})`;

const default_options = exports.default_options = {
    'mode': 'sandbox',
    'schema': 'https',
    'host': 'api.sandbox.paypal.com',
    'port': '',
    'openid_connect_schema': 'https',
    'openid_connect_host': 'api.sandbox.paypal.com',
    'openid_connect_port': '',
    'authorize_url': 'https://www.sandbox.paypal.com/signin/authorize',
    'logout_url': 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1/endsession',
    'headers': {}
};
