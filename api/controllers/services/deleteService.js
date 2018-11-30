const joi = require('joi');
const boom = require('boom');
const userService = require('../../services/userService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'services'],
  
  description: 'Delete services',
  
  notes: 'Delete services',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of Services')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      let data = await userService.deleteService(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
