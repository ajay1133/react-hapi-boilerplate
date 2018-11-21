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
      email: joi.string()
                .email()
                .allow('')
                .description('Email of User'),
      
      password: joi.string(),
      
      firstName: joi.string()
                    .max(100)
                    .description('First Name of User')
                    .required(),
  
      lastName: joi.string()
                   .max(100)
                   .description('Last Name of User')
                   .required(),
  
      title: joi.string()
                .description('Title of User')
                .required(),
      
      address: joi.string()
                  .allow('')
                  .description('Address of User'),
      
      phone: joi.string()
                .allow('')
                .description('Phone of User'),
  
      url: joi.string()
              .allow('')
              .description('Url of User'),
  
      description: joi.string()
                      .allow('')
                      .description('Description of User'),
      
      image: joi.string()
                .allow('')
                .description('Image of User'),
      
      status: joi.number()
                 .valid([1,2,3])
                 .allow(null)
                 .description('1=Active, 2=Pending, 3=Denied'),
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
