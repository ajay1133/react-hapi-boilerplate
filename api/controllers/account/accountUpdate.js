const joi = require('joi');
const accountService = require('../../services/accountService');
const genericReply = require('../../helpers/responseHelper');

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
                .optional()
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
	
	    city: joi.string()
	                .optional()
	                .allow(['', null])
	                .description('City of User'),
	
	    state: joi.string()
	                .optional()
	                .allow(['', null])
	                .description('State of User'),
	
	    zip: joi.string()
	                .optional()
	                .allow(['', null])
	                .description('Zip of User'),
      
      phone: joi.string()
                .optional()
                .allow(['', null])
                .description('Phone of User'),
      
      description: joi.string()
                      .optional()
                      .allow(['', null])
                      .description('Description of User'),
      
      image: joi.string()
                .optional()
                .allow(['', null])
                .description('Image of User'),
	    
      status: joi.number()
                 .optional()
                 .valid([1,2,3])
                 .allow(['', null])
                 .description('1=Active, 2=Pending, 3=Denied'),
      
	    role: joi.number()
	              .optional()
	              .description('Role of User')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { params, payload } = request;
    return accountService
	    .updateUser(params.id, payload)
	    .then((data) => genericReply.put(h, data))
	    .catch(err => genericReply.onError(h, 'There was an error. Please Try Again', err));
  }
};