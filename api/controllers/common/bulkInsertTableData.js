const joi = require('joi');
const boom = require('boom');
const commonService = require('../../services/commonService');

module.exports = {
  plugins: {
    'hapi-swagger': {
      payloadType: 'form',
    },
  },
  auth: {
    strategy: 'default'
  },
  tags: ['api', 'common'],
  description: 'Create Table Data In Bulk',
  notes: 'Create Table Data In Bulk',
  validate: {
    payload: {
    	table: joi.string()
	              .required()
	              .description('Table to create an entry'),
      dataListOfObjects: joi.array()
                            .required()
                            .single()
                            .description('Data List Of Objects To Insert In Table')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { table, dataListOfObjects } = payload;
    
    try {
      const data = await commonService.bulkInsertTableData(table, dataListOfObjects);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
