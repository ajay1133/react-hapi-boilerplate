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

exports.getServicesByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { usersId } = param;
    
    let condition = { status: 1 };
    if (usersId) {
      condition.usersId = usersId;
    }
  
    Services.findAndCountAll({
      attributes: defaultServiceAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};

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
        attributes: defaultServiceAttributes,
        model: Services,
        where: {
          status: 1,
        }
      },
      attributes: ['name', 'status'],
      where: condition
    }).then(resolve).catch(reject);
  });
};