const joi = require('joi');
const accountService = require('../../services/accountService');
const { genericReply } = require('../../helpers');
module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default'
  },
  tags: ['api', 'account'],
  description: 'Update user\'s account',
  notes: 'Update user\'s account',
  validate: {
    params: {
      id: joi.number()
             .description('PK of User')
    },
    payload: {
      email: joi.string()
                .email()
                .allow(['', null])
                .description('Email of User'),
      
      firstName: joi.string()
                    .optional()
                    .allow(['', null])
                    .max(100)
                    .description('First Name of User'),
      
      lastName: joi.string()
                   .optional()
                   .allow(['', null])
                   .max(100)
                   .description('Last Name of User'),
      
      title: joi.string()
                .optional()
                .allow(['', null])
                .description('Title of User'),
      
      address: joi.string()
                  .optional()
                  .allow(['', null])
                  .description('Address of User'),
      
      phone: joi.string()
                .optional()
                .allow(['', null])
                .description('Phone of User'),
      
      website: joi.string()
                  .optional()
                  .allow(['', null])
                  .description('Url of User'),
      
      description: joi.string()
                      .optional()
                      .allow(['', null])
                      .description('Description of User'),
      
      image: joi.string()
                .optional()
                .allow(['', null])
                .description('Image of User'),
      
      featuredVideo: joi.string()
                        .optional()
                        .allow(['', null])
                        .description('FeaturedVideo of User'),
      
      status: joi.number()
                 .optional()
                 .valid([1,2,3])
                 .allow(['', null])
                 .description('1=Active, 2=Pending, 3=Denied'),
      
      isDeleted: joi.boolean()
                    .valid(true, false)
                    .default(false)
                    .description('0 = not deleted, 1 = deleted'),
	
	    role: joi.number()
	              .optional()
	              .description('Role of User')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { params, payload } = request;
    return accountService.updateUser(params.id, payload)
                         .then((data) => genericReply.put(h, data))
                         .catch(err => genericReply.onError(h, 'There was an error. Please Try Again', err));
  }
};