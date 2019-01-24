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
  
  description: 'Delete a file in a repository',
  
  notes: 'Delete a file in a repository',
  
  validate: {
    payload: {
      files: joi.string()
                .required()
                .description('path of file name after "src"'),
  
      message: joi.string()
                  .allow('')
                  .default('Deleted with Bitbucket')
                  .description('Commit message')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { files, message } = payload;
    
    let res = {};
    const url = `${config.bitBucket.basePath}/src`;
    
    try {
      res = await superagent
        .post(url)
        .auth(config.bitBucket.username, config.bitBucket.password)
        .type('form')
        .send({ files, message });
    } catch(err) {
      return boom.badRequest(err);
    }
    
    return h.response(res.body);
  },
};