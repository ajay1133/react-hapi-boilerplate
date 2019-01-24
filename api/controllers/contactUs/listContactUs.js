const joi = require('joi');
const boom = require('boom');
const contactService = require('../../services/contactService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'contactUs'],
  
  description: 'Get all contacts',
  
  notes: 'Get all contacts',
  
  validate: {
    query: {
      Page: joi.number()
               .description('page number to get list of contacts'),
      
      Limit: joi.number()
                .description('number of contacts per page'),
      
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
      let data = await contactService.getContactUs(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
