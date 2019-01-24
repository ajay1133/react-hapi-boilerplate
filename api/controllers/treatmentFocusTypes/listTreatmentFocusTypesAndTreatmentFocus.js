const joi = require('joi');
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
  
  description: 'treatment Focus Types and treatment Focus',
  
  notes: 'treatment Focus Types and treatment Focus',
  
  validate: {
    query: {
      id: joi.number()
                 .allow('')
                 .description('PK of treatmentFocusTypes'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await treatmentFocusService.getTreatmentFocusTypesAndTreatmentFocus(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
