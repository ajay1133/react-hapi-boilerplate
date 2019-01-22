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
  
  description: 'Delete blog',
  
  notes: 'Delete blog',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of blog')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      const data = await blogService.deleteBlog(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
