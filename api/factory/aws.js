const AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({ region: 'us-east-1' });

if (process.env.NODE_ENV !== 'production') {
  AWS.config.update({ accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey });
}

exports.s3 = new AWS.S3();
