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
  
  description: 'Delete age Group',
  
  notes: 'Delete age Group',
  
  validate: {
    payload: {
      ageGroupIds: joi.array()
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
    const { ageGroupIds } = payload;
    
    try {
      let promisesList = [];
      
      ageGroupIds.forEach(ageGroupId => {
        promisesList.push(userService.deleteAgeGroup(ageGroupId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
