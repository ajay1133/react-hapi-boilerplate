const prefix = '/ageTypes';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllAgeTypes'),
  },
  {
    path: `${prefix}/services`,
    method: 'GET',
    config: require('./listAgeTypesAndAgeGroup'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addAgeTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateAgeTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteAgeTypes'),
  },
];
