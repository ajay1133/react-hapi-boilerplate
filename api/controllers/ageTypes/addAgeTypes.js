const joi = require('joi');
const boom = require('boom');
const ageService = require('../../services/ageService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'age'],
  
  description: 'Create age Types',
  
  notes: 'Create age Types',
  
  validate: {
    payload: {
      name: joi.string()
               .description('name of age type')
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
      let data = await ageService.createAgeType(payload);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
