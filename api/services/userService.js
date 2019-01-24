const db = require('../db');
const constants = require('../constants');
const { Services, ServiceTypes } = db.models;

exports.getAllServices = () => Services.findAndCountAll({
  attributes: constants.DEFAULT_USER_SERVICES_ATTRIBUTES,
  where: {
    status: 1
  }
});

exports.getServicesByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { usersId } = param;
    
    let condition = { status: 1 };
    if (usersId) {
      condition.usersId = usersId;
    }
  
    Services.findAndCountAll({
      attributes: constants.DEFAULT_USER_SERVICES_ATTRIBUTES,
      where: condition
    }).then(resolve).catch(reject);
  });
};

exports.createService = (payload) => Services.create(payload);

exports.updateService = (payload, id) => Services.update(payload, { where: { id } });

exports.deleteService = (id) => Services.destroy({ where: { id } });



// Service Types
const defaultServiceTypeAttributes = [
  'id',
  'name',
  'status'
];

exports.getAllServiceTypes = () => ServiceTypes.findAndCountAll({
  attributes: defaultServiceTypeAttributes,
  where: {
    status: 1
  }
});

exports.createServiceTypes = (payload) => ServiceTypes.create(payload);

exports.createBulkServiceTypes = (payload) => payload && Array.isArray(payload) && !!payload.length &&
ServiceTypes.bulkCreate(payload);

exports.updateServiceTypes = (payload, id) => ServiceTypes.update(payload, { where: { id } });

exports.deleteServiceTypes = (id) => ServiceTypes.destroy({ where: { id } });

exports.getServiceTypeAndServices = (query) => {
  return new Promise((resolve, reject) => {
    const { id } = query;
    
    // Associations
    Services.hasMany(ServiceTypes, { foreignKey: 'id' });
    ServiceTypes.belongsTo(Services, { foreignKey: 'id', targetKey: 'serviceTypesId' });
  
    let condition = { status: 1 };
    if (id) {
      condition.id = id;
    }
  
    ServiceTypes.findAndCountAll({
      include: {
        attributes: constants.DEFAULT_USER_SERVICES_ATTRIBUTES,
        model: Services,
        where: {
          status: 1,
        }
      },
      attributes: defaultServiceTypeAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};