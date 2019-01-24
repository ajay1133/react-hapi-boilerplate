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
  
  description: 'Update age Group',
  
  notes: 'Update age Group',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of ageGroup')
    },
    payload: {
      userId: joi.number()
                  .description('PK of Users')
                  .required(),
      
      agetypeId: joi.number()
                         .description('PK of ageTypes')
                         .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await ageService.updateAgeGroup(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
