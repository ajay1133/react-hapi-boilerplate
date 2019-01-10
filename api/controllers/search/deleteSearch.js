const joi = require('joi');
const boom = require('boom');
const searchService = require('../../services/searchService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'search'],
  
  description: 'Delete search',
  
  notes: 'Delete search',
  
  validate: {
    payload: {
	    userId: joi.number(),
	
	    typeIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of searchkeyword')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, typeIds } = payload;
    
    try {
      let promisesList = [];
	
	    typeIds.forEach(searchkeywordtypeId => {
        promisesList.push(searchService.deleteSearchBySearchId(userId, searchkeywordtypeId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
