const db = require('./db');
const path = require('path');

module.exports = {
  api: {
    host: 'localhost',
    port: 5020,
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
  emailUrl:{
    host: ''
  },
  BasePath:{
    host: "http://localhost:3000"
  },
  profileImage:{
    maxPayloadSize: 5242880,
    profileImagePath: path.join(__dirname,"../public/userProfile/images")
  },
  debugLog : 1, //Set 0 to disable and 1 to enable error logg
};
