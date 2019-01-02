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
  
  description: 'age Group by user',
  
  notes: 'age Group  by user',
  
  validate: {
    params: {
      userId: joi.number()
                 .description('PK of users'),
    },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    try {
      let data = await ageService.getAgeGroupByUser(params);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
