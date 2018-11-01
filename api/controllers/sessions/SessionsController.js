module.exports = [
  {
    path: '/sessions',
    method: 'POST',
    config: require('./sessionsCreate'),
  },
  {
    path: '/sessions',
    method: 'GET',
    config: require('./sessionsGet'),
  },
  {
    path: '/sessions',
    method: 'DELETE',
    config: require('./sessionsDestroy'),
  }
];
