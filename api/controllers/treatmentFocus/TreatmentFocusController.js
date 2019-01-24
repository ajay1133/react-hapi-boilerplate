const prefix = '/treatmentFocusGroup';

module.exports = [
  {
    path: prefix,
    method: 'GET',
    config: require('./listAllTreatmentFocus'),
  },
  {
    path: `${prefix}/byUser/{userId}`,
    method: 'GET',
    config: require('./listAllTreatmentFocusByUser'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./addTreatmentFocus'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./updateTreatmentFocus'),
  },
  {
    path: `${prefix}/delete`,
    method: 'POST',
    config: require('./deleteTreatmentFocus'),
  }
];
