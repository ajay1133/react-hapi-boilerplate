const joi = require('joi');
const boom = require('boom');
const ageService = require('../../services/ageService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'age'],
  
  description: 'Create age groups',
  
  notes: 'Create age groups',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
	
	    ids: joi.array()
	                    .single()
	                    .items(
		                    joi.number()
		                       .description('PK of age Group')
	                    )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, ids } = payload;
    
    try {
      let promisesList = [];
	
	    ids.forEach(agetypeId => {
	      promisesList.push(ageService.createAgeGroup({
          userId,
          agetypeId
	      }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
