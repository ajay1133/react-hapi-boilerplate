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
  
  description: 'GET repositories',
  
  notes: 'Returns repositories',
  
  handler: async (request, h) => {
    let res = {};
    try {
      res = await superagent.get('https://api.bitbucket.org/2.0/repositories/pht_ajaysharma/Hello_World_Repo');
      console.log('I m mr, Aj2 ====> ', res);
	    return h.response(res);
    } catch(err) {
      console.error(err);
      return boom.badRequest(err);
    }
  },
};
