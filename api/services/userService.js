const db = require('../db');
const { Services, ServiceTypes }  = db.models;

// Services
const defaultServiceAttributes = [
  'id',
  'usersId',
  'serviceTypesId',
  'name',
  'status'
];

exports.getAllServices = () => Services.findAndCountAll({
    attributes: defaultServiceAttributes,
    where: {
      status: 1
    }
  });

exports.createService = (payload) => Services.create(payload);

exports.updateService = (payload, id) => Services.update(payload, { where: { id } });

exports.deleteService = (id) => Services.destroy({ where: { id } });



// Service Types
exports.getAllServiceTypes = () => ServiceTypes.findAndCountAll({
    attributes: ['name', 'status'],
    where: {
      status: 1
    }
  });

exports.createServiceTypes = (payload) => ServiceTypes.create(payload);

exports.updateServiceTypes = (payload, id) => ServiceTypes.update(payload, { where: { id } });

exports.deleteServiceTypes = (id) => ServiceTypes.destroy({ where: { id } });