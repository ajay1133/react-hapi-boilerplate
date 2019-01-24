const prefix = '/serviceTypes';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllServiceTypes'),
  },
  {
    path: `${prefix}/services`,
    method: 'GET',
    config: require('./listServiceTypesAndServices'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addServiceTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateServiceTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteServiceTypes'),
  },
];
