const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default'
  },
  tags: ['api', 'socialAccount'],
  description: 'Create Social User',
  notes: 'Social User registeration and login',
  validate: {
    payload: {
      email: joi.any(),
      password: joi.string()
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    let payload = request.payload;
    if (request.auth.credentials && request.auth.credentials.id) {
      return {user: request.auth.credentials};
    } else {
      const userPool = request.server.plugins['cognito-auth'].userPool;
      try {
        let data = await accountService.signInUser(payload.email, payload.password, userPool);
        return h.response(data);
      } catch(err) {
        return boom.badRequest(err);
      }
    }
  }
};
