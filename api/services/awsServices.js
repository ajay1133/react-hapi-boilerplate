const uuid = require('node-uuid');
const aws = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const internals = {};

const async = require("async");

exports.createAwsObject = (req, options) => new Promise((resolve, reject) => {
  if(req.query.duration && req.query.duration > 300){ return reject('video duration is more than 5 minutes') }
  let S3_BUCKET = options.bucket,
    getFileKeyDir = options.getFileKeyDir || function () { return ''; };

  if (!S3_BUCKET) {
    throw new Error('S3_BUCKET is required.');
  }

  if (options.uniquePrefix === undefined) {
    options.uniquePrefix = true;
  }
  const ext = req.query.objectName.split('.').pop().toLowerCase();
  const filename = (new Date().getTime()).toString(36);
  const mediaId = uuid.v4();
  const mimeType = req.query.contentType;
  const fileKey = mediaId + '/' + filename +'.'+ ext ;
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
      mediaId: mediaId,
      fileType: mimeType,
      originalFileName: req.query.objectName
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

exports.copyAWSObjects = (images, options) => new Promise((resolve, reject) => {

    async.eachLimit(images, 1, function(image, callback) {
      var params = {
          Bucket: options.bucket,
          CopySource: options.bucket + '/' + image.source,
          Key: image.destination,
          ACL: options.ACL
      };
      s3.copyObject(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
            callback(err.stack);
          }
          else {
            console.log("Copied", image.source, image.destination)
            callback(null)
          }
      });
    }, function(err, result) {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
});
