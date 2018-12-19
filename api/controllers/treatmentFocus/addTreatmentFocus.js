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
  
  description: 'Create treatment Focus',
  
  notes: 'Create treatment Focus',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
      
      treatment: joi.array()
                   .single()
                   .items(
                     joi.object()
                       .keys({
                         treatmentfocustypeId: joi.number()
                                            .required()
                                            .description('PK of treatmentFocusTypes')
                       })
                   )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, treatment } = payload;
    
    try {
      let promisesList = [];
  
      treatment.forEach((serviceObj) => {
	      promisesList.push(treatmentFocusService.createTreatmentFocus({
	        userId,
          treatmentfocustypeId: serviceObj.treatmentfocustypeId
	      }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
