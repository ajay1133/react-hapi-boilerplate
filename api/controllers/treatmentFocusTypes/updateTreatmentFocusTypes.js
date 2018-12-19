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
  
  description: 'Update treatment Focus types',
  
  notes: 'Update treatment Focus types',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of treatment Focus types')
    },
    payload: {
      name: joi.string()
               .description('name of treatment Focus type')
               .required(),
      
      status: joi.number()
                 .valid([0, 1])
                 .allow(null)
                 .default(1)
                 .description('0=Inactive, 1=Active'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await treatmentFocusService.updateTreatmentFocusTypes(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
