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
  
  description: 'Delete contact',
  
  notes: 'Delete contact',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of contact us')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      const data = await contactService.deleteContactUs(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
