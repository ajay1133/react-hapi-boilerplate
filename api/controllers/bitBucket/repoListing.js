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
      path: joi.string()
               .allow(''),
      
      page: joi.number()
        .default(1)
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { query } = request;
    const { path = '', page } = query;
    
    let queryStr = '';
    
    if (page) {
      queryStr = `?page=${page}`;
    }
    
    let res = {};
    const url = queryStr
      ? `${config.bitBucket.basePath}/src${path}${queryStr}`
      : `${config.bitBucket.basePath}/src${path}`;
    
    try {
      res = await superagent
        .get(url)
        .auth(config.bitBucket.username, config.bitBucket.password);
    } catch(err) {
      return boom.badRequest(err);
    }
    return h.response(res.body.values);
  },
};
