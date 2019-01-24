const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

exports.s3 = new AWS.S3();
