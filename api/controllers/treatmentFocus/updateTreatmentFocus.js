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
  
  description: 'Update treatment Group',
  
  notes: 'Update treatment Group',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of treatmentFocus')
    },
    payload: {
      userId: joi.number()
                  .description('PK of Users')
                  .required(),
  
      treatmentfocustypeId: joi.number()
                         .description('PK of treatmentFocusTypes')
                         .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await treatmentFocusService.updateTreatmentFocus(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
