const prefix = '/treatmentFocusTypes';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllTreatmentFocusTypes'),
  },
  {
    path: `${prefix}/treatmentFocus`,
    method: 'GET',
    config: require('./listTreatmentFocusTypesAndTreatmentFocus'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addTreatmentFocusTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateTreatmentFocusTypes'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'DELETE',
    config: require('./deleteTreatmentFocusTypes'),
  },
];
