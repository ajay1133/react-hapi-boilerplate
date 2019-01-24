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
  
  description: 'view of file',
  
  notes: 'Returns content',
  
  validate: {
    query: {
	    path: joi.string()
               .allow('')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    const { path } = query;
    
    const url = `${config.bitBucket.basePath}/src${path}`;
    
    try {
      const res = await superagent
        .get(url)
        .auth(config.bitBucket.username, config.bitBucket.password);
      
	    return h.response({ data: res.text });
    } catch(err) {
      return boom.badRequest(err);
    }
  },
};