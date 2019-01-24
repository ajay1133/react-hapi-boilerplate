const joi = require('joi');
const boom = require('boom');
const genderService = require('../../services/genderService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'gender'],
  
  description: 'Create gender Types',
  
  notes: 'Create gender Types',
  
  validate: {
    payload: {
      name: joi.string()
               .description('name of gender type')
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
      let data = await genderService.createGenderType(payload);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
