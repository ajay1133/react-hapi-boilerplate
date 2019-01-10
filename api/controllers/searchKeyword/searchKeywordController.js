const prefix = '/searchKeywordTypes';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllSearchKeyword'),
  },
  {
    path: `${prefix}/search`,
    method: 'GET',
    config: require('./listSearchKeywordAndSearch'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addSearchKeyword'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateSearchKeyword'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteSearchKeyword'),
  },
];
