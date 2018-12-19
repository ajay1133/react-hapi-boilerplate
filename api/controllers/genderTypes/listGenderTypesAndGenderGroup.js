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
  
  tags: ['api', 'genderTypes'],
  
  description: 'gender Types and gender Group',
  
  notes: 'gender Types and gender Group',
  
  validate: {
    query: {
      id: joi.number()
                 .allow('')
                 .description('PK of genderTypes'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await genderService.getGenderTypeAndGenderGroup(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
