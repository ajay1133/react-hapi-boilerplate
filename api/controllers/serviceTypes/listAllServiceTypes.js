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
  
  tags: ['api', 'serviceTypes'],
  
  description: 'Get all service types',
  
  notes: 'Get all service types',
  
  handler: async (request, h) => {
    try {
      let data = await userService.getAllServiceTypes();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
