const db = require('../db');
const { AgeGroup, AgeType }  = db.models;

// Services
const defaultAgeGroupAttributes = [
  'id',
  'userId',
  'agetypeId'
];

exports.getAllAgeGroups = () => AgeGroup.findAndCountAll({
  attributes: defaultAgeGroupAttributes
});

exports.getAgeGroupByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { userId } = param;
    
    AgeGroup.findAndCountAll({
      attributes: defaultAgeGroupAttributes,
      where: { userId }
    }).then(resolve).catch(reject);
  });
};

exports.createAgeGroup = (payload) => AgeGroup.create(payload);

exports.updateAgeGroup = (payload, id) => AgeGroup.update(payload, { where: { id } });

exports.deleteAgeGroup = (id) => AgeGroup.destroy({ where: { id } });

exports.deleteAgeGroupByTypeId = (userId, agetypeId) => AgeGroup.destroy({ where: { userId, agetypeId } });


// Service Types
const defaultAgeTypeAttributes = [
  'id',
  'name',
  'status'
];

exports.getAllAgeTypes = () => AgeType.findAndCountAll({
  attributes: defaultAgeTypeAttributes,
  where: {
    status: 1
  }
});

exports.createAgeType = (payload) => AgeType.create(payload);

exports.createBulkAgeTypes = (payload) => payload && Array.isArray(payload) && !!payload.length &&
AgeType.bulkCreate(payload);

exports.updateAgeType = (payload, id) => AgeType.update(payload, { where: { id } });

exports.deleteAgeType = (id) => AgeType.destroy({ where: { id } });

exports.getAgeTypeAndAgeGroup = (query) => {
  return new Promise((resolve, reject) => {
    const { id } = query;
    
    // Associations
    AgeGroup.hasMany(AgeType, { foreignKey: 'id' });
    AgeType.belongsTo(AgeGroup, { foreignKey: 'id', targetKey: 'agetypeId' });
  
    let condition = { status: 1 };
    if (id) {
      condition.id = id;
    }
  
    AgeType.findAndCountAll({
      include: {
        attributes: defaultAgeGroupAttributes,
        model: AgeGroup
      },
      attributes: defaultAgeTypeAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};