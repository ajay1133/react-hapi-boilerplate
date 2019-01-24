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
  
  description: 'Delete services',
  
  notes: 'Delete services',
  
  validate: {
    payload: {
      serviceIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of Services')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    
    try {
      let promisesList = [];
      
      payload.serviceIds.forEach(serviceId => {
        promisesList.push(userService.deleteService(serviceId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
