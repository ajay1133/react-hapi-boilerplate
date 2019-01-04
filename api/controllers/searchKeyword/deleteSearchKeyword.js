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
  
  description: 'Delete search Keyword',
  
  notes: 'Delete search Keyword',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of search Keyword')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      let data = await searchService.deleteSearchKeyword(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
