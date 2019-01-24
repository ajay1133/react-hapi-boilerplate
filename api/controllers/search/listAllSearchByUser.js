const joi = require('joi');
const boom = require('boom');
const searchService = require('../../services/searchService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'search'],
  
  description: 'search by user',
  
  notes: 'search  by user',
  
  validate: {
    params: {
      userId: joi.number()
                 .description('PK of users'),
    },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    try {
      let data = await searchService.getSearchByUser(params);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
