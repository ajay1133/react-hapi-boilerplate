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
  
  description: 'Create search',
  
  notes: 'Create search',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
	
	    ids: joi.array()
	                    .single()
	                    .items(
		                    joi.number()
		                       .description('PK of search')
	                    )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, ids } = payload;
    
    try {
      let promisesList = [];
	
	    ids.forEach(searchkeywordtypeId => {
	      promisesList.push(searchService.createSearch({
          userId,
          searchkeywordtypeId
	      }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
