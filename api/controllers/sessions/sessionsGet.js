const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: 'default',
  tags: ['api', 'session'],
  description: 'GET session user',
  notes: 'Returns logged in session user',
  handler: async (request, h) => {
    try {
      let user = await accountService.getUser( request.auth.credentials.id);
      return h.response(user);
    } catch(err) {
      return boom.badRequest(err)
    }
  },
};
