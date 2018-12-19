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
  
  tags: ['api', 'ageGroup'],
  
  description: 'Create age group',
  
  notes: 'Create age group',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
      
      age: joi.array()
                   .single()
                   .items(
                     joi.object()
                       .keys({
                         agetypeId: joi.number()
                                            .required()
                                            .description('PK of ageTypes')
                       })
                   )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, age } = payload;
    
    try {
      let promisesList = [];
      
      age.forEach((serviceObj) => {
	      promisesList.push(ageService.createAgeGroup({ userId, agetypeId: serviceObj.agetypeId }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
