const joi = require('joi');
const Boom = require('boom');
const sessionService = require('../../services/sessionService');
const jwtHelper = require('../../helpers/jwtHelper');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },

  tags: ['api', 'session'],

  description: 'Create session',

  notes: 'User web login or mobile login',

  validate: {
    query: {
      jwt: joi.number().valid(0, 1).default(0).description('set 1 to get jwt token'),
    },
    
    payload: {
      email: joi.string().email().max(250).required(),
      password: joi.string().max(250).required(),
    },
    
    options: { abortEarly: false },
  },

  handler: async (request, h) => {
    const payload = request.payload;
    
    const onError = (err) => {
      throw Boom.badRequest(err);
    };

    try {
      let user = await sessionService.authenticate(payload.email, payload.password);
      
      if (user && user.id) {
        let scope = ['user'];
        
        if (user.role == 1) {
          scope.push('admin');
        } else {
          scope.push('customer');
        }
        
        user.scope = scope;
        
        if (request.query.jwt) {
          try {
            let accessToken =  await jwtHelper.sign(user);
            return h.response({ user, accessToken });
          } catch(err) {
            onError("Invalid Username or Password");
          }
        } else {
          request.auth.session.set(user);
          return h.response({ user });
        }
      } else {
        onError("Invalid Username or Password");
      }
    } catch(err) {
      onError("Invalid Username or Password");
    }

  },

};