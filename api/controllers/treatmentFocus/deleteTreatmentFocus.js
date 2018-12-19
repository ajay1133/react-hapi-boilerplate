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
  
  tags: ['api', 'treatmentFocus'],
  
  description: 'Delete treatment Focus',
  
  notes: 'Delete treatment Focus',
  
  validate: {
    payload: {
      treatmentFocusIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of treatment Focus')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { treatmentFocusIds } = payload;
    
    try {
      let promisesList = [];
  
      treatmentFocusIds.forEach(treatmentFocusId => {
        promisesList.push(treatmentFocusService.deleteTreatmentFocus(treatmentFocusId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
