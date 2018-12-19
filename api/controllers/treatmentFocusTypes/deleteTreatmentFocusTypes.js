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
  
  tags: ['api', 'treatmentFocusTypes'],
  
  description: 'Delete treatment Focus types',
  
  notes: 'Delete treatment Focus types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of treatmentFocusTypes')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    const { id } = params;
    
    try {
      let data = await treatmentFocusService.deleteTreatmentFocusTypes(id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
