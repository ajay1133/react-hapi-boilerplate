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
  description: 'Get Table Data',
  notes: 'Get Table Data',
	validate: {
		query: {
			table: joi.string()
			          .required()
			          .description('Table to update data'),
			page: joi.string()
			         .allow('', null)
			         .default('')
			         .description('Page number to get list of records'),
			limit: joi.string()
			          .allow('', null)
			          .default('')
			          .description('Number of records per page'),
			order: joi.array()
			          .items(joi.string())
			          .single()
			          .allow('', null)
			          .optional()
			          .description('Order array asc or desc'),
			sortBy: joi.array()
			           .items(joi.string())
			           .single()
			           .allow('', null)
			           .optional()
			           .description('Sort by columns array defined in table'),
			filters: joi.string()
			            .allow('', null)
			            .optional()
			            .description('Json stringified filter array'),
			attributes: joi.array()
			               .items(joi.string())
			               .single()
			               .allow('', null)
			               .optional()
			               .description('Attributes to fetch')
		},
		options: { abortEarly: false }
	},
  handler: async (request, h) => {
    const { query } = request;
    const { table } = query;
    
    try {
      let data = await commonService.getTableData(table, query);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
