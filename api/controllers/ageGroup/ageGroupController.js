const prefix = '/ageGroup';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllAgeGroup'),
  },
  {
    path: `${prefix}/byUser/{userId}`,
    method: 'GET',
    config: require('./listAllAgeGroupByUser'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addAgeGroups'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateAgeGroup'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteAgeGroups'),
  }
];
