const db = require('./db');
const path = require('path');

module.exports = {
  api: {
    host: 'localhost',
    port: 8000,
    secret: 'fdgwVtghrt5345gfdgfd653245235232v2rcra'
  },
  db: db.development,
  redis: {
    host: db.redis.host,
    port: db.redis.port,
    prefix: 'com_'
  },
  bitBucket: {
    username: db.bitBucket.username,
    password: db.bitBucket.password,
    basePath: db.bitBucket.basePath
  },
	aws: {
		s3: {
			bucketWrite: 'compass-development-storage',
			bucket: 'compass-development-storage'
		}
	},
  stripe: {
    secretKey: 'sk_test_3akdpHjSXOigyyxlkwn91lMw',
    planId: 'plan_EMHodgPZFnpPvS'
  },
  emailUrl:{
    host: ''
  },
  BasePath:{
    host: "http://localhost:4000"
  },
  profileImage:{
    maxPayloadSize: 5242880,
    profileImagePath: path.join(__dirname,"../public/userProfile/images")
  },
  debugLog : 1, //Set 0 to disable and 1 to enable error logg
};

