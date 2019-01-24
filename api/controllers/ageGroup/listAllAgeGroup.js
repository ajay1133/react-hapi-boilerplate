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
  
  tags: ['api', 'age'],
  
  description: 'Get all age Group',
  
  notes: 'Get all age Group',
  
  handler: async (request, h) => {
    try {
      let data = await ageService.getAllAgeGroups();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
