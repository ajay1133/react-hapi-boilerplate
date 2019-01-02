const joi = require('joi');
const boom = require('boom');
const genderService = require('../../services/genderService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'gender'],
  
  description: 'Create gender groups',
  
  notes: 'Create gender groups',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
	
	    ids: joi.array()
	                    .single()
	                    .items(
		                    joi.number()
		                       .description('PK of gender Group')
	                    )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, ids } = payload;
    
    try {
      let promisesList = [];
	
	    ids.forEach(gendertypeId => {
	      promisesList.push(genderService.createGenderGroup({
          userId,
          gendertypeId
	      }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
