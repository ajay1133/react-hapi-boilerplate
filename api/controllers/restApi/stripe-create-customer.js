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
  description: 'Creates a stripe customer',
  notes: 'Creates a stripe customer',
  validate: {
	  payload: {
      tokenId: joi.string()
                 .required()
                 .description('stripe card token'),
		  email: joi.string()
		            .required()
		            .description('email')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { tokenId, email } = request.payload;
    
    try {
	    const stripe = require("stripe")(config.stripe.secretKey);
	    const customer = await stripe.customers.create({
		    source: tokenId,
		    email,
	    });
	   return h.response(customer);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
