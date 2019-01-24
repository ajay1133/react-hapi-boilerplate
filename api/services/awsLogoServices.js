const uuid = require('node-uuid');
const aws = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const internals = {};

exports.createAwsObject = (req, options) => new Promise((resolve, reject) => {
  let S3_BUCKET = options.bucket,
    getFileKeyDir = options.getFileKeyDir || function () { return ''; };

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.');
  }

  if (options.uniquePrefix === undefined) {
    options.uniquePrefix = true;
  }
  const ext = req.query.objectName.split('.').pop();
  const filename = (new Date().getTime()).toString(36);
  const videoId = uuid.v4();
  const mimeType = req.query.contentType;
  const fileKey = 'videos/original/'+ logoId + '/' + filename +'.'+ ext ;
  const s3 = new aws.S3(s3Options);
  const params = {
    Bucket: S3_BUCKET,
    Key: fileKey,
    Expires: 60,
    ContentType: mimeType,
    ACL: options.ACL
  };
  s3.getSignedUrl('putObject', params, (err, data) => {
    if (err) {
      console.log(err);
      return reject(500, 'Cannot create S3 signed URL');
    }
    resolve({
      signedUrl: data,
      publicUrl: fileKey,
      fileName: filename,
      fileKey,
      videoId: videoId,
      fileType: mimeType
    });
  });
});

exports.getObject = (key, options) => new Promise((resolve, reject) => {
  const params = {
    Bucket: options.bucket,
    Key: key
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      reject(err);
    }
    resolve(url);
  });
});

exports.deleteFile = (key, options) => new Promise((resolve, reject) => {
  const params = {
    Bucket: options.bucket,
    Key: key
  };
  
  s3.deleteObject(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data);
  });
});
