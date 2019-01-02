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
  
  description: 'treatment Focus by user',
  
  notes: 'treatment Focus by user',
  
  validate: {
    params: {
      userId: joi.number()
                 .description('PK of users'),
    },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    try {
      let data = await treatmentFocusService.getTreatmentFocusByUser(params);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
