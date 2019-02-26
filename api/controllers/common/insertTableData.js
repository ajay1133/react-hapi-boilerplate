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
  
  description: 'Create Table Data',
  
  notes: 'Create Table Data',
  
  validate: {
    payload: {
    	table: joi.string()
	              .required()
	              .description('Table to create data'),
      dataObj: joi.array()
                        .required()
                        .single()
                        .description('Data Object To Insert In Table')
    },
    options: { abortEarly: false },
  },
  
  handler: async (request, h) => {
    const { payload } = request;
    const { table,dataObj } = payload;
    
    try {
      const data = await commonService.insertTableData(table, dataObj);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
