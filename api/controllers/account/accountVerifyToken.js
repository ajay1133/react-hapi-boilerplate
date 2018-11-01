const joi = require('joi');
const Boom = require('boom');
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
      if (userdata.email) {
        return h.response({ tokenValid: true });
      } else {
        return h.response({ tokenValid: false });
      }
    } catch(err) {
      if (err && err.message === 'jwt expired') {
        return Boom.badRequest("Link is expired");
      }
    }
  }
};
