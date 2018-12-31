const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default',
//    scope: ['admin']
  },
  tags: ['api', 'account'],
  description: 'Contact Form: Send Email',
  notes: 'Contact Form: Send Email',
  validate: {
    payload: {
      name: joi.string()
               .max(100)
               .required()
               .description('Name'),
      
      email: joi.string()
                .email()
                .required()
                .description('Email'),
      
      message: joi.string()
                  .allow(['', null])
                  .description('Message')
    },
    options: { abortEarly: false },
  },
  
  handler: (request, h) => {
    const { payload } = request;
    
    const onError = (err) => {
      request.server.log(['error'], err);
      return boom.badRequest(err);
    };
    
    return accountService.contactUs(payload)
      .then((data) => h.response(data))
      .catch(onError);
  }
};
