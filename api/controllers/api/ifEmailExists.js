const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'ifEmailExists'],
  description: 'Check if email is taken',
  notes: 'Check if email is taken',
  validate: {
	  params: {
      email: joi.string()
                .description('Email of User')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { params } = request;
    
    const onError = (err) => {
      request.server.log(['error'], err);
      return boom.badRequest(err);
    };
	  
    try {
	    const userExistsObj = await accountService.getUserByEmail(params.email);
	    if (userExistsObj && userExistsObj.id) {
		    return h.response({ data: false });
	    }
      return h.response({ data: true });
    } catch (e) {
      return onError(e);
    }
  }
};
