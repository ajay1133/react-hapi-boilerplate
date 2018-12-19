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
  
  tags: ['api', 'ageTypes'],
  
  description: 'age Types and age Group',
  
  notes: 'age Types and age Group',
  
  validate: {
    query: {
      id: joi.number()
                 .allow('')
                 .description('PK of ageTypes'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await ageService.getAgeTypeAndAgeGroup(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
