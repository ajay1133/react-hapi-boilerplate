const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');
const constants = require('../../constants');
const db = require('../../db');
const jwtHelper = require('../../helpers/jwtHelper');
const config = require("config");

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default',
    scope: ['admin']
  },
  tags: ['api', 'account'],
  description: 'Create user',

  notes: 'Create user',


  validate: {
    payload: {
      email: joi.any(),
      password: joi.string(),
      firstName: joi.string(),
      lastName: joi.string(),
      phoneNumber: joi.string()
    },
    options: { abortEarly: false },
  },

  handler: (request, h) => {
    const payload = request.payload;
    const onError = (err) => {
      request.server.log(['error'], err);
      return boom.badRequest(err);
    };

    return accountService.createUser(payload)
        .then((data) => {
          return h.response(data);
        })
        .catch(onError);
    }

};
