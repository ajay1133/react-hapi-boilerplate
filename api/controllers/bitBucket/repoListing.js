const joi = require('joi');
const boom = require('boom');
const superagent = require('superagent');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  
  auth: 'default',
  
  tags: ['api', 'bitBucket'],
  
  description: 'Listing of repositories',
  
  notes: 'Returns repositories',
  
  validate: {
    query: {
      token: joi.string()
                .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    let res = {};
    const { query } = request;
    const { token } = query;
    
    try {
      res = await superagent.get('https://api.bitbucket.org/2.0/repositories/simsaw/compass-hugo/src')
                            .set('Authorization', 'Bearer' + token);
    } catch(err) {
      return boom.badRequest(err);
    }
    return h.response(res.body.values);
  },
};
