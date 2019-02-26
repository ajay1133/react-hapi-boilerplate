const joi = require('joi');
const boom = require('boom');
const awsServices = require('../../services/awsServices');
const config = require('config');

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
			bucket: config.aws.s3.bucket,
			getFileKeyDir: request.params.dirName,
			ACL: 'public-read'
		};
		
		try {
			const res = await awsServices.createAwsObject(request, options);
			return h.response(res);
		} catch (err) {
			return boom.badRequest('Error uploading file');
		}
	}
};
