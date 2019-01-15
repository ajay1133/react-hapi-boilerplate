const prefix = '/contactUs';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listContactUs'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addContactUs'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateContactUs'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteContactUs'),
  },
];
