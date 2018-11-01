const uuid = require('node-uuid');
const aws = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const internals = {};
const s3Options = {
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
};

exports.createAwsObject = (req, campaignId, options) => new Promise((resolve, reject) => {
  let S3_BUCKET = options.bucket,
    getFileKeyDir = options.getFileKeyDir || function () { return ''; };

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.');
  }

  if (options.region) {
    s3Options.region = options.region;
  }
  if (options.signatureVersion) {
    s3Options.signatureVersion = options.signatureVersion;
  }
  if (options.uniquePrefix === undefined) {
    options.uniquePrefix = true;
  }
  const ext = req.query.objectName.split('.').pop().toLowerCase();
  const mimeType = req.query.contentType;
  const filename = uuid.v4();
  const fileKey = 'campaign/banner/original/'+ campaignId +'/' + filename +'.'+ ext ;
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
      fileType: mimeType
    });
  });
});

exports.createAwsObjectBody = (req, folder ,campaignID, options) => new Promise((resolve, reject) => {

  let S3_BUCKET = options.bucket,
    getFileKeyDir = options.getFileKeyDir || function () { return ''; };

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.');
  }

  if (options.region) {
    s3Options.region = options.region;
  }
  if (options.signatureVersion) {
    s3Options.signatureVersion = options.signatureVersion;
  }
  if (options.uniquePrefix === undefined) {
    options.uniquePrefix = true;
  }
  const Type = req.split(';')[0].split('/')[1];
  const ext = Type.toLowerCase();
  const filename = uuid.v4();;
  const fileKey = 'campaign/'+ folder +'/original/'+ campaignID +'/' + filename +'.'+ ext ; // campaign/profile/original/filename
  const s3 = new aws.S3(s3Options);
  const params = {
    Bucket: S3_BUCKET,
    Body: new Buffer (req.split(',')[1], 'base64'),
    Key: fileKey,
    Expires: 60,
    ContentType: 'image/'+Type,
    ACL: options.ACL
  };
  s3.putObject( params, (err, data) => {
    if (err) {
      console.log(err);
      return reject(500, 'Cannot create S3 signed URL');
    }
    resolve({
      signedUrl: data,
      publicUrl: fileKey,
      fileName: filename,
      fileKey,
      fileType: Type
    });
  });
});

exports.getObject = (key, options) => new Promise((resolve, reject) => {
  const params = {
    Bucket: options.bucket,
    Key: key
  };
  const s3 = new aws.S3(s3Options);
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
  const s3 = new aws.S3(s3Options);
  s3.deleteObject(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data);
  });
});
