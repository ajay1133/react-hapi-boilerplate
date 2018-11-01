const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default',
    scope: ['admin']
  },
  tags: ['api', 'account'],
  description: 'Get all accounts',
  notes: 'Get all accounts',
  handler: async (request, h) => {
    try {
      let data = await accountService.getAllAccounts();
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }

};
