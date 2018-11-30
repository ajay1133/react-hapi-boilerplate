module.exports = {
    development: {
      username: 'root',
      password: 'root',
      database: 'fan',
      host: 'localhost',
      dialect: 'mysql'
    },
    test: {
      username: 'root',
      password: null,
      database: 'fan_test',
      host: '127.0.0.1',
      dialect: 'mysql'
    },
    production: {
      host: process.env.DB_HOST,
      database: process.env.DB,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      dialect: 'mysql'
    },
    staging: {
      host: process.env.DB_HOST,
      database: process.env.DB,
      username: process.env.DB_USER,
      password: process.env.DB_PWD,
      dialect: 'mysql'
    },
    aws: {
      key: process.env.AWS_KEY || 'AKIAIQHJ4IHVFTQUHIPQ',
      secret: process.env.AWS_SECRET || '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'
    },
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_POST || '6379'
    },
  };
