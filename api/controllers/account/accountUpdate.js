const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');
const { genericReply } = require('../../helpers');
module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'account'],
  description: 'Update user\'s account',
  notes: 'Update user\'s account',
  validate: {
    payload: {
      id: joi.number()
             .description('PK of User')
             .required(),
  
      email: joi.string()
                .email()
                .description('Email of User')
                .required(),
      
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
      
      status: joi.number()
                 .optional()
                 .valid([1,2,3])
                 .allow(null)
                 .description('1=Active, 2=Pending, 3=Denied'),
  
      isDeleted: joi.boolean()
                    .valid(true, false)
                    .default(false)
                    .description('0 = not deleted, 1 = deleted'),
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const payload = request.payload;
    return accountService.updateUser(payload)
                         .then((data) => genericReply.put(h, data))
                         .catch(err => genericReply.onError(h, 'There was an error. Please Try Again', err));
  }
};