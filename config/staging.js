const db = require('./db');
const path = require('path');
module.exports = {
  api: {
    host: '0.0.0.0',
    port: 4001,
    secret: process.env.API_SECRET
  },
  db: db.staging,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    prefix: 'compass_'
  },
  bitBucket: {
    accessKeyId: db.bitBucket.key,
    secretAccessKey: db.bitBucket.secret,
    basePath: db.bitBucket.path
  },
  aws: {
    s3: {
      bucketWrite: 'compass-development-original',
      bucket: 'compass-development'
    }
  },
  BasePath:{
    host: "http://stagingapi.compassrecoverynetwork.com"
  },
  emailUrl: {
    host: 'smtps://username:password@smtp.example.com/?pool=true'
  },
  debugLog : 1, //Set 0 to disable and 1 to enable error logs
  cron : 0,
  sendEmail: 1
};
