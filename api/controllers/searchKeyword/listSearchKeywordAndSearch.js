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
  
  description: 'search Keyword and search',
  
  notes: 'search Keyword and search',
  
  validate: {
    query: {
      id: joi.number()
                 .allow('')
                 .description('PK of search Keyword'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await searchService.getSearchKeywordAndSearch(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
