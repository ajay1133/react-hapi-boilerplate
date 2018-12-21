const AWS = require('aws-sdk');
const db = require('./../../config/db');

AWS.config.update({ accessKeyId: db.aws.key, secretAccessKey: db.aws.secret, region: 'us-east-1' });

exports.ses = new AWS.SES();

exports.s3 = new AWS.S3({ signatureVersion: 'v4' });
