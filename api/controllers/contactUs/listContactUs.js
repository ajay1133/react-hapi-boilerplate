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
  
  handler: async (request, h) => {
    try {
      let data = await contactService.getContactUs();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
