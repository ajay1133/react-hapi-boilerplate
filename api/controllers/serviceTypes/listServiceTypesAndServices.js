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
  
  tags: ['api', 'serviceTypes'],
  
  description: 'Service Types and Services',
  
  notes: 'Service Types and Services',
  
  validate: {
    query: {
      id: joi.number()
                 .allow('')
                 .description('PK of ServiceTypes'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await userService.getServiceTypeAndServices(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
