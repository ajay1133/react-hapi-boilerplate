const joi = require('joi');
const boom = require('boom');
const restApiService = require('../../services/restApiService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'restApi', 'stripe'],
  description: 'Creates a stripe charge',
  notes: 'Creates a stripe charge',
  validate: {
	  payload: {
      email: joi.string()
                 .required()
                 .description('email of user')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { payload } = request;
    
    try {
	    const stripe = require("stripe")("sk_test_3akdpHjSXOigyyxlkwn91lMw");
	
	    const data = await stripe.charges.create({
		    amount: 2000,
		    currency: "usd",
		    source: "tok_visa", // obtained with Stripe.js
		    metadata: payload
	    });
	    
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }

};
