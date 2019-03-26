const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');
const jwtHelper = require('../../helpers/jwtHelper');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'account'],
  description: 'Verify token',
  notes: 'Verify token',
  validate: {
    payload: {
      inviteToken: joi.string()
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const payload = request.payload;
    try {
      let userdata = await jwtHelper.verify(payload.inviteToken);
      // If thge decrytpted jwt object contains 'email' key it is a valid token if such an user exists
      if (userdata.email) {
        const res = await accountService.getUserByEmail( userdata.email );
        if (res.inviteStatus === 0) {
	        return h.response({ tokenValid: true });
        }
        return h.response({ tokenValid: false });
      } else {
        return h.response({ tokenValid: false });
      }
    } catch(err) {
      if (err && err.message === 'jwt expired') {
        return boom.badRequest("Link is expired");
      } else {
	      return boom.badRequest(JSON.stringify(err));
      }
    }
  }
};
