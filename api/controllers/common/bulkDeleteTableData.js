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
  description: 'Delete Table Data In Bulk',
  notes: 'Delete Table Data In Bulk',
  validate: {
    payload: {
	    table: joi.string()
	              .required()
	              .description('Table to update data'),
	    whereObj: joi.object()
	                 .required()
	                 .description('Where Condition Object')
    },
    options: { abortEarly: false },
  },
  handler: async (request, h) => {
    const { payload } = request;
    const { table, whereObj } = payload;
    
    try {
      const data = await commonService.deleteTableData(table, whereObj);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
