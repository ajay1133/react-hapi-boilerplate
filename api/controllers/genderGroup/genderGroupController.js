const prefix = '/genderGroup';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllGenderGroup'),
  },
  {
    path: `${prefix}/byUser/{userId}`,
    method: 'GET',
    config: require('./listAllGenderGroupByUser'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addGenderGroups'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateGenderGroup'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteGenderGroups'),
  }
];
