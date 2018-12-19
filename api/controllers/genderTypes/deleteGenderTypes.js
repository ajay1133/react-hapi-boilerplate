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
  
  description: 'Delete gender types',
  
  notes: 'Delete gender types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of gender types')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      let data = await genderService.deleteGenderType(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
