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
  
  tags: ['api', 'treatmentFocusGroup'],
  
  description: 'Create treatment Focus Groups',
  
  notes: 'Create treatment Focus Groups',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
	
	    ids: joi.array()
	                                .single()
                                  .items(
                                    joi.number()
                                       .description('PK of treatmentFocus Group')
                                  )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, ids } = payload;
    
    try {
      let promisesList = [];
	
	    ids.forEach(treatmentfocustypeId => {
	      promisesList.push(treatmentFocusService.createTreatmentFocus({
	        userId,
          treatmentfocustypeId
	      }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
