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
  
  description: 'Get all gender Group',
  
  notes: 'Get all gender Group',
  
  handler: async (request, h) => {
    try {
      let data = await genderService.getAllGenderGroups();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
