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
  
  tags: ['api', 'treatmentFocusGroups'],
  
  description: 'Delete treatment Focus Groups',
  
  notes: 'Delete treatment Focus Groups',
  
  validate: {
    payload: {
	    userId: joi.number(),
      
      typeIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of Treatment Focus Type id')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, typeIds } = payload;
    
    try {
      let promisesList = [];
	
	    typeIds.forEach(treatmentfocustypeId => {
        promisesList.push(treatmentFocusService.deleteTreatmentFocusByTypeId(treatmentfocustypeId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
