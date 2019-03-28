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
    prefix: 'shareCabs_'
  },
  bitBucket: {
    username: db.bitBucket.username,
    password: db.bitBucket.password,
    basePath: db.bitBucket.basePath
  },
  aws: {
		s3: {
			bucketWrite: '',
			bucket: '',
			s3Url: ``
		}
  },
	stripe: {
		secretKey: '',
		planId_Individual: '',
		planId_Facility: ''
	},
  BasePath:{
    host: ""
  },
  emailUrl: {
    host: 'smtps://username:password@smtp.example.com/?pool=true'
  },
  debugLog : 1, //Set 0 to disable and 1 to enable error logs
  cron : 0,
  sendEmail: 1
};
