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
      password: joi.string(),
      
      firstName: joi.string()
                    .max(100)
                    .description('First Name of User')
                    .required(),
  
      lastName: joi.string()
                   .max(100)
                   .description('Last Name of User')
                   .required(),
  
      phone: joi.string()
                .description('Phone of User')
                .required(),
  
      url: joi.string()
              .optional()
              .allow('', null)
              .description('Url of User'),
  
      description: joi.string()
                      .optional()
                      .allow('', null)
                      .description('Description of User'),
      
      email: joi.string()
                .email()
                .description('Email of User')
                .required(),
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
