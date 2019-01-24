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
  
  description: 'Update age types',
  
  notes: 'Update age types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of age types')
    },
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
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await ageService.updateAgeType(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
