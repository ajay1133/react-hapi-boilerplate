const prefix = '/sessions';

module.exports = [
  {
    path: prefix,
    method: 'POST',
    config: require('./sessionsCreate'),
  },
  {
    path: `${prefix}/forgotPassword`,
    method: 'POST',
    config: require('./forgotPassword'),
  },
  {
    path: prefix,
    method: 'GET',
    config: require('./sessionsGet'),
  },
  {
    path: prefix,
    method: 'DELETE',
    config: require('./sessionsDestroy'),
  }
];
