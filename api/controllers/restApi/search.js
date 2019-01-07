const joi = require('joi');
const boom = require('boom');
const restApiService = require('../../services/restApiService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  tags: ['api', 'restApi'],
  description: 'Get all accounts',
  notes: 'Get all accounts',
  validate: {
    query: {
      status: joi.number()
                 .allow(['', null])
                 .description('1=Active, 2=Pending, 3=Denied'),
  
      search: joi.string()
                 .allow(['', null])
                 .description('string of search id separated by comma, no spaces allowed'),
  
      page: joi.string()
               .allow(['', null])
               .description('page number to get list of Account'),
  
      limit: joi.string()
                .allow(['', null])
                .description('number of account per page'),
      
      gender: joi.string()
	              .allow(['', null])
	              .description('string of gender id separated by comma, no spaces allowed'),
      
      age: joi.string()
	              .allow(['', null])
	              .description('string of age id separated by comma, no spaces allowed'),
  
      insurance: joi.string()
	              .allow(['', null])
	              .description('string of insurance id separated by comma, no spaces allowed')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { query } = request;
    
    try {
      let data = await restApiService.getAllAccounts(query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }

};
