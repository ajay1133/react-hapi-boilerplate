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
  
  description: 'Update search',
  
  notes: 'Update search',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of search')
    },
    payload: {
      userId: joi.number()
                  .description('PK of Users')
                  .required(),
  
      searchkeywordId: joi.number()
                         .description('PK of searchkeyword')
                         .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await searchService.updateSearch(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
