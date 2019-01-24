const prefix = '/services';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllService'),
  },
  {
    path: `${prefix}/byUser/{usersId}`,
    method: 'GET',
    config: require('./listAllServiceByUser'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addServices'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateService'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteServices'),
  }
];
