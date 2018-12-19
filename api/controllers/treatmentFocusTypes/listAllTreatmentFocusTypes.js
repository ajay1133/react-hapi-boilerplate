const boom = require('boom');
const treatmentFocusService = require('../../services/treatmentFocusService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'treatmentFocusTypes'],
  
  description: 'Get all treatment Focus types',
  
  notes: 'Get all treatment Focus types',
  
  handler: async (request, h) => {
    try {
      let data = await treatmentFocusService.getAllTreatmentFocusTypes();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
