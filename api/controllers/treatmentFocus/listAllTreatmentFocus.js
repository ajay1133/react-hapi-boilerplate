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
  
  tags: ['api', 'treatment'],
  
  description: 'Get all treatment Focus',
  
  notes: 'Get all treatment Focus',
  
  handler: async (request, h) => {
    try {
      let data = await treatmentFocusService.getAllTreatmentFocus();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
