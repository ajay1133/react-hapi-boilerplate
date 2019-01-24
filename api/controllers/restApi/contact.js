const joi = require('joi');
const boom = require('boom');
const contactService = require('../../services/contactService');
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
                  .description('Message'),
      
      status: joi.number()
                 .valid([0, 1])
                 .allow(null)
                 .default(1)
                 .description('0=Inactive, 1=Active'),
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
      // Saving in DB
      const res = await contactService.createContactUs(payload);
      
      // Sending Email
      const messageId = await restApiService.sendContactUs(payload);
      if (res && messageId) {
        return h.response({ data: true });
      }
    } catch (e) {
      return onError(e);
    }
  }
};
