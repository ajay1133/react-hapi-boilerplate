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
  
  description: 'Update gender Group',
  
  notes: 'Update gender Group',
  
  validate: {
    params: {
      id: joi.number()
             .description('PK of genderGroup')
    },
    payload: {
      userId: joi.number()
                  .description('PK of Users')
                  .required(),
  
      gendertypeId: joi.number()
                         .description('PK of genderTypes')
                         .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params, payload } = request;
    const { id } = params;
    
    try {
      let data = await genderService.updateGenderGroup(payload, id);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
