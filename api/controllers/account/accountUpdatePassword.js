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
  // auth: 'default',
  tags: ['api', 'account'],
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
        return await accountService.updatePassword({
          password: payload.password,
          email: userdata.email,
          inviteToken: '',
          inviteStatus: 1
        });
      }
    } catch(err) {
      if (err && err.message === 'jwt expired') {
        return boom.badImplementation(i18n('plugins.auth.expired'));
      }
      return boom.badImplementation(err);
    }
  }
};
