const joi = require('joi');
const Boom = require('boom');
const jwtHelper = require('../../helpers/jwtHelper');
const accountService = require('../../services/accountService');
const config = require("config");

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  // auth: 'default',
  tags: ['api', 'account'],
  description: 'Update user',

  notes: 'update password',


  validate: {
    payload: {
	    email: joi.string()
	              .email()
	              .allow(['', null])
	              .description('Email of User'),
      password: joi.string()
    },
    options: { abortEarly: false },
  },

  handler: async (request, h) => {
    const payload = request.payload;
    
    try {
	    let result = await accountService.updatePassword({ password: payload.password, email: payload.email });
	    return result;
    } catch(err) {
      return Boom.badImplementation(err);
    }
  }
};
