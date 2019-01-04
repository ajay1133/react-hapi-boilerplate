const prefix = '/search';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllSearch'),
  },
  {
    path: `${prefix}/byUser/{userId}`,
    method: 'GET',
    config: require('./listAllSearchByUser'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addSearch'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateSearch'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteSearch'),
  }
];
