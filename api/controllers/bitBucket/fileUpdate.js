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
  
  description: 'Updates a file in a repository',
  
  notes: 'Updates a file in a repository',
  
  validate: {
    payload: {
      token: joi.string()
                .required(),
	
	    fileName: joi.string()
	                    .allow('', null)
	                    .required(),
      
	    fileContent: joi.string()
                  .allow('', null)
                  .required()
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { token, fileName, fileContent } = payload;
    
    let res = {};
    const url = `${config.bitBucket.basePath}/src`;
    
    try {
      const postObj = {};
      
      postObj[fileName] = fileContent;
      
      res = await superagent
        .post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${token}`)
        .send(postObj);
    } catch(err) {
      return boom.badRequest(err);
    }
    
    return h.response(res.body);
  },
};