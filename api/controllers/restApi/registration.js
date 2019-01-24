const joi = require('joi');
const boom = require('boom');
const config = require('config');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'registration'],
  description: 'Create user',
  notes: 'Create user',
  validate: {
    payload: {
      email: joi.string()
                .email()
                .required()
                .description('Email of User'),
	
	    stripeCardToken: joi.string()
                .required()
                .description('Stripe Card Token'),
      
      password: joi.string()
                   .required(),
      
      firstName: joi.string()
                    .max(100)
                    .description('First Name of User')
                    .required(),
      
      lastName: joi.string()
                   .default('')
                   .max(100)
                   .required()
                   .description('Last Name of User'),
      
      phone: joi.string()
                .optional()
                .allow(['', null])
                .description('Phone of User'),
      
      address: joi.string()
                  .required()
                  .allow(['', null])
                  .description('Address/Street of User'),
      
      city: joi.string()
               .required()
               .allow(['', null])
               .description('City of User'),
      
      zip: joi.string()
              .required()
              .allow(['', null])
              .description('Zip of User'),
      
      state: joi.string()
                .required()
                .allow(['', null])
                .description('State of User'),
      
      status: joi.number()
                 .valid([1,2,3])
                 .allow(null)
                 .default(2)
                 .description('1=Active, 2=Pending, 3=Denied'),
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    
    const onError = (err) => {
      request.server.log(['error'], err);
      return boom.badRequest(err);
    };
    
    try {
	    const stripe = require("stripe")(config.stripe.secretKey);
      const userExistsObj = await accountService.getUserByEmail(payload.email);
      if (userExistsObj && userExistsObj.id) {
        onError('This email is already taken');
      }
      payload.role = 2;
	    const stripeCustomer = await stripe.customers.create({
		    source: payload.stripeCardToken,
		    email: payload.email,
	    });
	    let stripeCustomerSubscription = {};
	    if (stripeCustomer && stripeCustomer.id) {
		    stripeCustomerSubscription = await stripe.subscriptions.create({
			    customer: stripeCustomer.id,
			    items: [{ plan: config.stripe.planId }],
		    });
      } else {
		    onError('An error occurred while creating stripe customer');
	    }
	    if (stripeCustomerSubscription && stripeCustomerSubscription.id) {
		    const accountCreatedObject = await accountService.createUser(payload);
		    if (accountCreatedObject && accountCreatedObject.id) {
			    await accountService.updatePassword({
				    password: payload.password,
				    email: payload.email,
				    inviteToken: '',
				    inviteStatus: 1
			    });
			    return h.response({ data: accountCreatedObject });
		    } else {
			    onError('An error occurred while creating user');
		    }
      } else {
		    onError('An error occurred while creating stripe customer subscription');
      }
    } catch (err) {
      onError(err);
    }
  }
};
