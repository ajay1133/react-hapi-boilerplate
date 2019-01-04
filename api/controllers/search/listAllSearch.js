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
  
  description: 'Get all search',
  
  notes: 'Get all search',
  
  handler: async (request, h) => {
    try {
      let data = await searchService.getAllSearch();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
