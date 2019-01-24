const boom = require('boom');
const genderService = require('../../services/genderService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'gender'],
  
  description: 'Get all gender types',
  
  notes: 'Get all gender types',
  
  handler: async (request, h) => {
    try {
      let data = await genderService.getAllGenderTypes();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
