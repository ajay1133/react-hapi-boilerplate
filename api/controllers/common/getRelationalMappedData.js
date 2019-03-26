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
  description: 'Get relational mapped data',
  notes: 'Get relational mapped data',
	validate: {
		query: {
			userId: joi.number()
                 .description('Relational mapped data for userId')
		}
	},
  handler: async (request, h) => {
    const { userId } = request.query;
    try {
      const queryOnPrimaryTable = { status: 1 };
      const queryOnSecondaryTable = userId ? { userId } : {};
      const data = await commonService.getRelationalMappedData(queryOnPrimaryTable, queryOnSecondaryTable);
      return h.response(data);
    } catch(err) {
      return boom.badRequest(err);
    }
  }
};
