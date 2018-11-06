const prefix = '/bitBucket';

module.exports = [
  {
    path: `${prefix}/listing`,
    method: 'GET',
    config: require('./repoListing'),
  },
  {
    path: `${prefix}/view`,
    method: 'GET',
    config: require('./repoView'),
  }
];
