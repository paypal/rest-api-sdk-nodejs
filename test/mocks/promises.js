var nock = require('nock');

nock('https://api.sandbox.paypal.com')
  .post('/v1/oauth2/token', "grant_type=client_credentials")
  .reply(200, {"scope":"https://uri.paypal.com/services/subscriptions https://api.paypal.com/v1/payments/.* email https://api.paypal.com/v1/vault/credit-card https://uri.paypal.com/services/applications/webhooks openid https://uri.paypal.com/services/invoicing https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.*","access_token":"A015Jik4tFmTbfRYQdy.rsF.VpEHB.prkpuS8R4EUgWfIHc","token_type":"Bearer","app_id":"APP-80W284485P519543T","expires_in":10}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3001.slc.paypal.com;threadId=2694',
  'paypal-debug-id': '4c4c6a50334b8',
  server_info: 'identitysecuretokenserv:v1.oauth2.token&CalThreadId=769&TopLevelTxnStartTime=14a4e864b2b&Host=slcsbidensectoken501.slc.paypal.com&pid=3787',
  date: 'Mon, 15 Dec 2014 15:17:11 GMT',
  'content-type': 'application/json',
  'content-length': '474' });

nock('https://api.sandbox.paypal.com')
  .post('/v1/payments/payouts/?sync_mode=false', {"sender_batch_header":{"sender_batch_id":"t1000","email_subject":"You have a payment"},"items":[{"recipient_type":"EMAIL","amount":{"value":0.99,"currency":"USD"},"receiver":"shirt-supplier-one@mail.com","note":"Thank you.","sender_item_id":"item_1"},{"recipient_type":"EMAIL","amount":{"value":0.9,"currency":"USD"},"receiver":"shirt-supplier-two@mail.com","note":"Thank you.","sender_item_id":"item_2"},{"recipient_type":"EMAIL","amount":{"value":0.15,"currency":"USD"},"receiver":"shirt-supplier-three@mail.com","note":"Thank you.","sender_item_id":"item_3"}]})
  .reply(201, {"batch_header":{"payout_batch_id":"AJHKPW9KYBTWA","batch_status":"PENDING","sender_batch_header":{"email_subject":"You have a payment","sender_batch_id":"t1000"}},"links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/AJHKPW9KYBTWA","rel":"self","method":"GET"}]}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=1216',
  'paypal-debug-id': '47c84eee3c7f0',
  'content-language': '*',
  date: 'Mon, 15 Dec 2014 15:17:14 GMT',
  'content-type': 'application/json',
  'content-length': '278' });

nock('https://api.sandbox.paypal.com')
  .post('/v1/oauth2/token', "grant_type=client_credentials")
  .reply(200, {"scope":"https://uri.paypal.com/services/subscriptions https://api.paypal.com/v1/payments/.* email https://api.paypal.com/v1/vault/credit-card https://uri.paypal.com/services/applications/webhooks openid https://uri.paypal.com/services/invoicing https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.*","access_token":"A015.ryo3JGimSC5n-AJBlIsivcVMnbba9NMH4fkAWBhgYs","token_type":"Bearer","app_id":"APP-80W284485P519543T","expires_in":28800}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=1048',
  'paypal-debug-id': '90721dc2e051d',
  server_info: 'identitysecuretokenserv:v1.oauth2.token&CalThreadId=73179&TopLevelTxnStartTime=14a5168375e&Host=slcsbidensectoken501.slc.paypal.com&pid=3787',
  date: 'Tue, 16 Dec 2014 04:43:12 GMT',
  'content-type': 'application/json',
  'content-length': '474' });

nock('https://api.sandbox.paypal.com')
  .get('/v1/payments/payouts-item/VXURV6Y48P898')
  .reply(200, {"payout_item_id":"VXURV6Y48P898","transaction_id":"5FU55828X3939910A","transaction_status":"UNCLAIMED","payout_item_fee":{"currency":"USD","value":"0.0"},"payout_batch_id":"7LHNN5KX7WVDC","sender_batch_id":"t400","payout_item":{"amount":{"currency":"USD","value":"0.15"},"note":"Thank you.","receiver":"shirt-supplier-three@mail.com","recipient_type":"EMAIL","sender_item_id":"item_3"},"time_processed":"2014-40-16T10:40:53Z","errors":{"name":"RECEIVER_UNREGISTERED","message":"Receiver is unregistered"},"links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/VXURV6Y48P898","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/7LHNN5KX7WVDC","rel":"batch","method":"GET"}]}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=1213',
  'paypal-debug-id': 'a1aa941bd8ed1',
  'content-language': '*',
  date: 'Wed, 17 Dec 2014 15:07:48 GMT',
  'content-type': 'application/json',
  'content-length': '730' });

nock('https://api.sandbox.paypal.com')
  .get('/v1/payments/payouts-item/5UD3FSLKEZ63C')
  .reply(200, {"payout_item_id":"5UD3FSLKEZ63C","transaction_id":"5KT85791B7724820A","transaction_status":"RETURNED","payout_item_fee":{"currency":"USD","value":"0.0"},"payout_batch_id":"W46J7D4CQQTMY","sender_batch_id":"payout94","payout_item":{"amount":{"currency":"USD","value":"0.15"},"note":"Thank you.","receiver":"shirt-supplier-three@mail.com","recipient_type":"EMAIL","sender_item_id":"item_3"},"time_processed":"2015-01-29T16:22:19Z","errors":{"name":"RECEIVER_UNREGISTERED","message":"Receiver is unregistered","information_link":"https://developer.paypal.com/webapps/developer/docs/api/#RECEIVER_UNREGISTERED"},"links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/5UD3FSLKEZ63C","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/W46J7D4CQQTMY","rel":"batch","method":"GET"}]}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=415703',
  'paypal-debug-id': '8e2061f56ed13',
  'content-language': '*',
  date: 'Thu, 29 Jan 2015 16:22:22 GMT',
  'content-type': 'application/json',
  'content-length': '833' });

nock('https://api.sandbox.paypal.com')
  .post('/v1/oauth2/token', "grant_type=client_credentials")
  .reply(200, {"scope":"https://uri.paypal.com/services/subscriptions https://api.paypal.com/v1/payments/.* email https://api.paypal.com/v1/vault/credit-card https://uri.paypal.com/services/applications/webhooks openid https://uri.paypal.com/services/invoicing https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.*","access_token":"A015B4Rf1PvrSkSSgMpkfyvXJ-snbBHZEXudS9-8a6mn02A","token_type":"Bearer","app_id":"APP-80W284485P519543T","expires_in":28800}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3001.slc.paypal.com;threadId=374233',
  'paypal-debug-id': '3469156b10656',
  server_info: 'identitysecuretokenserv:v1.oauth2.token&CalThreadId=388858&TopLevelTxnStartTime=14b3687f900&Host=slcsbidensectoken501.slc.paypal.com&pid=8642',
  date: 'Thu, 29 Jan 2015 16:30:56 GMT',
  'content-type': 'application/json',
  'content-length': '474' });

nock('https://api.sandbox.paypal.com')
  .get('/v1/payments/payouts-item/5UD3FSLKEZ63')
  .reply(200, {"payout_item_id":"5UD3FSLKEZ63C", "transaction_id":"5KT85791B7724820A","transaction_status":"RETURNED","payout_item_fee":{"currency":"USD","value":"0.0"},"payout_batch_id":"W46J7D4CQQTMY","sender_batch_id":"payout94","payout_item":{"amount":{"currency":"USD","value":"0.15"},"note":"Thank you.","receiver":"shirt-supplier-three@mail.com","recipient_type":"EMAIL","sender_item_id":"item_3"},"time_processed":"2015-01-29T16:22:19Z","errors":{"name":"RECEIVER_UNREGISTERED","message":"Receiver is unregistered","information_link":"https://developer.paypal.com/webapps/developer/docs/api/#RECEIVER_UNREGISTERED"},"links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/5UD3FSLKEZ63C","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/W46J7D4CQQTMY","rel":"batch","method":"GET"}]}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=415789',
  'paypal-debug-id': '11f89e1310fa4',
  'content-language': '*',
  date: 'Thu, 29 Jan 2015 16:30:56 GMT',
  connection: 'close, close',
  'content-type': 'application/json',
  'content-length': '183' });

nock('https://api.sandbox.paypal.com')
  .post('/v1/oauth2/token', "grant_type=client_credentials")
  .reply(200, {"scope":"https://uri.paypal.com/services/subscriptions https://api.paypal.com/v1/payments/.* email https://api.paypal.com/v1/vault/credit-card https://uri.paypal.com/services/applications/webhooks openid https://uri.paypal.com/services/invoicing https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.*","access_token":"A015XK-QysP6bkUW0xMRhVPOZ054u.o1IKW444WrMi5WMjw","token_type":"Bearer","app_id":"APP-80W284485P519543T","expires_in":28800}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3002.slc.paypal.com;threadId=371029',
  'paypal-debug-id': '9644a9b91e08b',
  server_info: 'identitysecuretokenserv:v1.oauth2.token&CalThreadId=132&TopLevelTxnStartTime=14b369718ae&Host=slcsbidensectoken501.slc.paypal.com&pid=8642',
  date: 'Thu, 29 Jan 2015 16:47:27 GMT',
  'content-type': 'application/json',
  'content-length': '474' });

nock('https://api.sandbox.paypal.com')
  .get('/v1/payments/payouts-item/UK6HNZEQX8M8S')
  .reply(401);

nock('https://api.sandbox.paypal.com')
  .get('/v1/payments/payouts-item/UK6HNZEQX8M8S')
  .reply(200, {"payout_item_id":"UK6HNZEQX8M8S", "transaction_id":"5KT85791B7724820A","transaction_status":"RETURNED","payout_item_fee":{"currency":"USD","value":"0.0"},"payout_batch_id":"W46J7D4CQQTMY","sender_batch_id":"payout94","payout_item":{"amount":{"currency":"USD","value":"0.15"},"note":"Thank you.","receiver":"shirt-supplier-three@mail.com","recipient_type":"EMAIL","sender_item_id":"item_3"},"time_processed":"2015-01-29T16:22:19Z","errors":{"name":"RECEIVER_UNREGISTERED","message":"Receiver is unregistered","information_link":"https://developer.paypal.com/webapps/developer/docs/api/#RECEIVER_UNREGISTERED"},"links":[{"href":"https://api.sandbox.paypal.com/v1/payments/payouts-item/5UD3FSLKEZ63C","rel":"self","method":"GET"},{"href":"https://api.sandbox.paypal.com/v1/payments/payouts/W46J7D4CQQTMY","rel":"batch","method":"GET"}]}, { server: 'Apache-Coyote/1.1',
  proxy_server_info: 'host=slcsbplatformapiserv3001.slc.paypal.com;threadId=424690',
  'paypal-debug-id': '26c87e8102326',
  'content-language': '*',
  date: 'Thu, 29 Jan 2015 16:47:27 GMT',
  connection: 'close, close',
  'content-type': 'application/json',
  'content-length': '193' });
