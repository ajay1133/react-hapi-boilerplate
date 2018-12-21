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
    const { ids } = payload;
    
    try {
      let promisesList = [];
      
      ids.forEach(ageGroupId => {
        promisesList.push(userService.deleteAgeGroup(ageGroupId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
