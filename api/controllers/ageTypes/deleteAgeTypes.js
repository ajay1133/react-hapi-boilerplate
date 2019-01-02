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
  
  description: 'Delete age types',
  
  notes: 'Delete age types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of age types')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      let data = await ageService.deleteAgeType(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
