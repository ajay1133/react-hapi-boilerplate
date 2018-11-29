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
  
  description: 'Create service Types',
  
  notes: 'Create service Types',
  
  validate: {
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
    const { payload } = request;
    
    try {
      let data = await userService.createServiceTypes(payload);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
