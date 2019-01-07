const prefix = '/unauthorized';

module.exports = [
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./registration'),
  },
  {
    path: `${prefix}/contact`,
    method: 'POST',
    config: require('./contact'),
  }
];
