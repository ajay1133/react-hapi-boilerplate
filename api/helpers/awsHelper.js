const AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({ region: 'us-east-1' });

exports.ses = new AWS.SES();

exports.s3 = new AWS.S3({ signatureVersion: 'v4' });
