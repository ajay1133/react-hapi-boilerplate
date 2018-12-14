const joi = require('joi');
const boom = require('boom');
const userService = require('../../services/userService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: {
    strategy: 'default'
  },
  
  tags: ['api', 'services'],
  
  description: 'Create services',
  
  notes: 'Create services',
  
  validate: {
    payload: {
      usersId: joi.number()
                  .description('PK of Users')
                  .required(),
      
      services: joi.array()
                   .single()
                   .items(
                     joi.object()
                       .keys({
                         service: joi.string()
                                     .required()
                                     .description('Service'),
                         
                         serviceTypesId: joi.number()
                                            .required()
                                            .description('PK of serviceType')
                       })
                   )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    
    try {
      let promisesList = [];
      
      payload.services.forEach((serviceObj) => {
        let serviceDataObj = {
          usersId: payload.usersId,
          name: serviceObj.service,
          serviceTypesId: serviceObj.serviceTypesId,
          status: 1
        };
        
	      promisesList.push(userService.createService(serviceDataObj));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
