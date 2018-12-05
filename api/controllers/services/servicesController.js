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
    config: require('./addService'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateService'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteService'),
  },
];
