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
  
  description: 'Delete gender Group',
  
  notes: 'Delete gender Group',
  
  validate: {
    payload: {
      userId: joi.number(),
      
      typeIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of genderType Id')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, typeIds } = payload;
    
    try {
      let promisesList = [];
	
	    typeIds.forEach(gendertypeId => {
        promisesList.push(genderService.deleteGenderGroupByTypeId(userId, gendertypeId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
