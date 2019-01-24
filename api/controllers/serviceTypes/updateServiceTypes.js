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
  
  description: 'Update service types',
  
  notes: 'Update service types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of Service types')
    },
    payload: {
      name: joi.string()
               .description('name of service type')
               .required(),
      
      status: joi.number()
                 .valid([0, 1])
                 .allow(null)
                 .default(1)
                 .description('0=Inactive, 1=Active'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await userService.updateServiceTypes(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
