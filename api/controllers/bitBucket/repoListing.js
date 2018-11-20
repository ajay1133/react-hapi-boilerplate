const joi = require('joi');
const boom = require('boom');
const superagent = require('superagent');
const config = require('config');

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
      accessToken: joi.string()
                .required(),
      
      path: joi.string()
               .allow('')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    const { accessToken, path = '' } = query;
    
    let res = {};
    const url = `${config.bitBucket.basePath}/src${path}`;
    
    try {
      res = await superagent
        .get(url)
        .set('Authorization', `Bearer ${accessToken}`);
    } catch(err) {
      return boom.badRequest(err);
    }
    
    return h.response(res.body.values);
  },
};
