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
  
  description: 'gender Group by user',
  
  notes: 'gender Group  by user',
  
  validate: {
    params: {
      userId: joi.number()
                 .description('PK of users'),
    },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    try {
      let data = await genderService.getGenderGroupByUser(params);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
