const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');
const jwtHelper = require('../../helpers/jwtHelper');
const i18n = require('../../helpers/i18nHelper');

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
  description: 'Update user password with help of token',
  notes: 'Update user password with help of token',
  validate: {
    payload: {
      password: joi.string(),
      confirmPassword: joi.string(),
      token: joi.string()
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const payload = request.payload;
    try {
      let userdata = await jwtHelper.verify(payload.token);
      // If valid token is passed update inviteToken & its status
      if (userdata.email) {
        return await accountService.updatePassword({
          password: payload.password,
          email: userdata.email,
          inviteToken: '',
          inviteStatus: 1
        });
      } else {
        return h.response({ success: false, error: 'Invalid token' });
      }
      return h.response({ success: true });
    } catch(err) {
      // Assign special error message if we are able to catch jwt expired error message 
      if (err && err.message === 'jwt expired') {
        return boom.badImplementation(i18n('plugins.auth.expired'));
      }
      return boom.badImplementation(err);
    }
  }
};
