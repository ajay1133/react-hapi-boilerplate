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
  
  description: 'Services by user',
  
  notes: 'Services  by user',
  
  validate: {
    params: {
      usersId: joi.number()
                 .description('PK of Users'),
    },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    try {
      let data = await userService.getServicesByUser(params);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
