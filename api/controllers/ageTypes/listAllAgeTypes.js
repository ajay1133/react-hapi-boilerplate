const boom = require('boom');
const ageService = require('../../services/ageService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'ageTypes'],
  
  description: 'Get all age types',
  
  notes: 'Get all age types',
  
  handler: async (request, h) => {
    try {
      let data = await ageService.getAllAgeTypes();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
