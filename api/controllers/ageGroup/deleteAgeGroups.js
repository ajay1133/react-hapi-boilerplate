const joi = require('joi');
const boom = require('boom');
const userService = require('../../services/ageService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'ageGroup'],
  
  description: 'Delete age Groups',
  
  notes: 'Delete age Groups',
  
  validate: {
    payload: {
	    userId: joi.number(),
	
	    typeIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of ageType Id')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, typeIds } = payload;
    
    try {
      let promisesList = [];
	
	    typeIds.forEach(agetypeId => {
        promisesList.push(userService.deleteAgeGroupByTypeId(userId, agetypeId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
