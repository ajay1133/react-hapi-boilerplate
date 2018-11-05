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
  
  handler: async (request, h) => {
    let res = {};
    
    try {
      res = await superagent.get('https://api.bitbucket.org/2.0/repositories/pht_ajaysharma/Hello_World_Repo');
	    return h.response(res);
    } catch(err) {
      return boom.badRequest(err);
    }
  },
};
