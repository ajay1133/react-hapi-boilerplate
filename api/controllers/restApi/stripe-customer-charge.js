const joi = require('joi');
const boom = require('boom');
const config = require('config');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'restApi', 'stripe'],
  description: 'Creates a stripe customer charge',
  notes: 'Creates a stripe customer charge',
  validate: {
	  payload: {
		  customer: joi.string()
                 .required()
                 .description('stripe customer id'),
		  amount: joi.number()
		            .required()
		            .description('amount to be charged'),
		  currency: joi.string()
		             .required()
		             .description('currency to be charged in')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { customer, amount, currency } = request.payload;
    
    try {
	    const stripe = require("stripe")(config.stripe.secretKey);
	    const charge = await stripe.charges.create({
		    amount,
		    currency,
		    customer,
	    });
	   return h.response(charge);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
