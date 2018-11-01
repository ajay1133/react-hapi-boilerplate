const joi = require('joi');
const boom = require('boom');
const accountService = require('../../services/accountService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'user'],
  description: 'get user',
  notes: 'get all user.',
  validate: {  // Route validations check
    params: {
      id: joi.string().description('id to get user record'),
    }
  },
  handler: (request, reply) => {
    const userPool = request.server.plugins['cognito-auth'].userPool;
    const onError = (err) => {
      request.server.log(['error'], err);
      return reply(boom.badRequest(err));
    };
    accountService
      .getUser( request.params.id, userPool )
      .then((data) =>  {
        reply( data );
      })
      .catch(onError);

  },


};
