const paypal = require('paypal-rest-sdk');
exports.register = (server, options, next) => {
  paypal.configure({
    'mode': options.mode,
    'client_id': options.client_id,
    'client_secret': options.client_secret
  });
  server.expose('paypal', paypal);
  next();
};

exports.register.attributes = {
  name: 'paypal-sdk',
};

exports.name = 'paypal-sdk';
