const joi = require('joi');
const boom = require('boom');
const awsServices = require('../../services/awsServices');

module.exports = {
	tags: ['api', 's3'],
	
	description: 'File upload in S3 Bucket',
	
	notes: 'Returns upload files',
	
	plugins: {
		'hapi-swagger': { payloadType: 'form' }
	},
	
	validate: {
		params: {
			dirName: joi.string()
			            .required()
			            .description('S3 Directory name')
		},
		
		options: { abortEarly: false }
	},
	
	handler: async (request, h) => {
		const options = {
			bucket: 'compass-development-storage',
			getFileKeyDir: request.params.dirName
		};
		
		let res = null;
		
		try {
			res = await awsServices.createAwsObject(request, options);
		} catch (err) {
			return boom.badRequest(err);
		}
		console.log('res', res);
		return h.response(res);
	}
};
