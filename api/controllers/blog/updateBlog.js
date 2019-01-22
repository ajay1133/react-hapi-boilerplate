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
  
  description: 'Update blog',
  
  notes: 'Update blog',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of blog')
    },
    payload: {
      title: joi.string()
                .optional()
                .allow(['', null])
                .description('title'),
    
      image: joi.string()
                .optional()
                .allow(['', null])
                .description('blog image'),
    
      draft: joi.number()
                .valid([0, 1])
                .allow(null)
                .default(0)
                .description('0=false, 1=true'),
    
      description: joi.string()
                      .optional()
                      .allow(['', null])
                      .description('description'),
      content: joi.string()
                  .optional()
                  .allow(['', null])
                  .description('content'),
    
      status: joi.number()
                 .valid([0, 1])
                 .allow(null)
                 .default(1)
                 .description('0=Inactive, 1=Active'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      const data = await blogService.updateBlog(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
