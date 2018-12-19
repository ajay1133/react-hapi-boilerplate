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
  
  description: 'Delete gender Group',
  
  notes: 'Delete gender Group',
  
  validate: {
    payload: {
      genderGroupIds: joi.array()
                     .single()
                     .items(
                       joi.number()
                          .description('PK of gender Group')
                     )
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { genderGroupIds } = payload;
    
    try {
      let promisesList = [];
  
      genderGroupIds.forEach(genderGroupId => {
        promisesList.push(genderService.deleteGenderGroup(genderGroupId));
      });
      
      const data = await Promise.all(promisesList);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
