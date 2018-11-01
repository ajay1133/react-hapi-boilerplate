const joi = require('joi')
const accountService = require('../../services/accountService');
module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'account'],
  description: 'Update user\'s account',
  notes: 'Update user\'s account',
  validate: {
    payload: {
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      phoneNumber: joi.string().required(),
      id: joi.number().required(),
      isDeleted: joi.boolean().default(false),
      email: joi.string().required()
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    try {
      let result = await accountService.updateUser(request.payload);
      return h.response(result);
    } catch (err) {
      return err;
    }
  }
};