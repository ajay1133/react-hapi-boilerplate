const joi = require('joi');
const Boom = require('boom');
const jwtHelper = require('../../helpers/jwtHelper');
const accountService = require('../../services/accountService');
const config = require("config");

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  // auth: 'default',
  tags: ['api', 'campaign'],
  description: 'Update user',

  notes: 'update password',


  validate: {
    payload: {
      password: joi.string(),
      confirmPassword: joi.string(),
      inviteToken: joi.string()
    },
    options: { abortEarly: false },
  },

  handler: async (request, h) => {
    const payload = request.payload;
    try {
      let userdata = await jwtHelper.verify(payload.inviteToken);
      if (userdata.email) {
        let result = await accountService.updatePassword({password: payload.password, email: userdata.email, inviteToken: '', inviteStatus: 1 });
        return result;
      }
    } catch(err) {
      if (err && err.message === 'jwt expired') {
        return Boom.badImplementation(i18n('plugins.auth.expired'));
      }
      return Boom.badImplementation(err);
    }
  }
};
