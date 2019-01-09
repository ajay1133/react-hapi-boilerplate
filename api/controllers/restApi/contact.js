const joi = require('joi');
const boom = require('boom');
const restApiService = require('../../services/restApiService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'restApi'],
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
  
  handler: async (request, h) => {
    const { payload } = request;
    
    const onError = (err) => {
      request.server.log(['error'], err);
      return boom.badRequest(err);
    };
  
    try {
      const messageId = await restApiService.sendContactUs(payload);
      return h.response({ data: { messageId } });
    } catch (e) {
      return onError(e);
    }
  }
};
