const joi = require('joi');
const Boom = require('boom');
const sessionService = require('../../services/sessionService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },

  tags: ['api', 'session'],

  description: 'Forgot Password',

  notes: 'Forgot Password',

  validate: {
    payload: {
      email: joi.string().email().max(250).required()
    },
    options: { abortEarly: false },
  },

  handler: async (request, h) => {
    const payload = request.payload;
    const { email } = payload;
    
    try {
      const res = await sessionService.forgotPassword(email);
      if (res) {
        return h.response({ message: 'Email sent !!' });
      } else {
        return Boom.badRequest('Incorrect Email');
      }
    } catch (err) {
      return Boom.badRequest(err);
    }
  },
};