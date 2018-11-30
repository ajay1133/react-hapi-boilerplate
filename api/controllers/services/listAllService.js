const boom = require('boom');
const userService = require('../../services/userService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'services'],
  
  description: 'Get all services',
  
  notes: 'Get all services',
  
  handler: async (request, h) => {
    try {
      let data = await userService.getAllServices();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
