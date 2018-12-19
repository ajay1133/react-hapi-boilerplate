const prefix = '/genderTypes';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllGenderTypes'),
  },
  {
    path: `${prefix}/genderGroup`,
    method: 'GET',
    config: require('./listGenderTypesAndGenderGroup'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addGenderTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateGenderTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteGenderTypes'),
  },
];
