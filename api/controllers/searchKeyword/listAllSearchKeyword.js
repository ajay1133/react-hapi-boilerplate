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
  
  description: 'Get all search Keyword',
  
  notes: 'Get all search Keyword',
  
  handler: async (request, h) => {
    try {
      let data = await searchService.getAllSearchKeyword();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
