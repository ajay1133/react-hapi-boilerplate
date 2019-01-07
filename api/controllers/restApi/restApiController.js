const prefix = '/restApi';

module.exports = [
  {
    path: `${prefix}/search`,
    method: 'GET',
    config: require('./search'),
  },
  {
    path: `${prefix}/registration`,
    method: 'POST',
    config: require('./registration'),
  },
  {
    path: `${prefix}/contact`,
    method: 'POST',
    config: require('./contact'),
  }
];
