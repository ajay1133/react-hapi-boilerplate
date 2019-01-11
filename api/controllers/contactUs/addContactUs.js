const joi = require('joi');
const boom = require('boom');
const contactService = require('../../services/contactService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'contactUs'],
  
  description: 'Create contact',
  
  notes: 'Create contact',
  
  validate: {
    payload: {
      name: joi.string()
               .description('name')
               .required(),
  
      email: joi.string()
                .email()
                .required()
                .description('Email'),
  
      message: joi.string()
                  .optional()
                  .allow(['', null])
                  .description('message'),
  
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
    
    try {
      let data = await contactService.createContactUs(payload);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
