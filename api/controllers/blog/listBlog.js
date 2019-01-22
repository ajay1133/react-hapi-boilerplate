const joi = require('joi');
const boom = require('boom');
const blogService = require('../../services/blogService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'blog'],
  
  description: 'Get all blog',
  
  notes: 'Get all blog',
  
  validate: {
    query: {
      Page: joi.number()
               .description('page number to get list of blogs'),
      
      Limit: joi.number()
                .description('number of blog per page'),
      
      SortBy: joi.string()
                 .allow('')
                 .description('field name'),
      
      Order: joi.string()
                .allow('')
                .description('asc or desc'),
      
    },
    options: { abortEarly: false }
  },
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await blogService.getBlog(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
