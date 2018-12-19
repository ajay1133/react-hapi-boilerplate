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
  
  tags: ['api', 'genderGroup'],
  
  description: 'Create gender group',
  
  notes: 'Create gender group',
  
  validate: {
    payload: {
      userId: joi.number()
                 .required()
                 .description('PK of Users'),
      
      gender: joi.array()
                   .single()
                   .items(
                     joi.object()
                       .keys({
                         gendertypeId: joi.number()
                                            .required()
                                            .description('PK of genderTypes')
                       })
                   )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { userId, gender } = payload;
    
    try {
      let promisesList = [];
  
      gender.forEach((serviceObj) => {
	      promisesList.push(genderService.createGenderGroup({ userId, gendertypeId: serviceObj.gendertypeId }));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
