const db = require('../db');
const { GenderGroup, GenderType }  = db.models;

// Services
const defaultGenderGroupAttributes = [
  'id',
  'userId',
  'gendertypeId'
];

exports.getAllGenderGroups = () => GenderGroup.findAndCountAll({
  attributes: defaultGenderGroupAttributes
});

exports.getGenderGroupByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { userId } = param;
  
    GenderGroup.findAndCountAll({
      attributes: defaultGenderGroupAttributes,
      where: { userId }
    }).then(resolve).catch(reject);
  });
};

exports.createGenderGroup = (payload) => GenderGroup.create(payload);

exports.updateGenderGroup = (payload, id) => GenderGroup.update(payload, { where: { id } });

exports.deleteGenderGroup = (id) => GenderGroup.destroy({ where: { id } });

exports.deleteGenderGroupByTypeId = (userId, gendertypeId) => GenderGroup.destroy({ where: { userId, gendertypeId } });


// Service Types
const defaultGenderTypeAttributes = [
  'id',
  'name',
  'status'
];

exports.getAllGenderTypes = () => GenderType.findAndCountAll({
  attributes: defaultGenderTypeAttributes,
  where: {
    status: 1
  }
});

exports.createGenderType = (payload) => GenderType.create(payload);

exports.createBulkGenderTypes = (payload) => payload && Array.isArray(payload) && !!payload.length &&
GenderType.bulkCreate(payload);

exports.updateGenderType = (payload, id) => GenderType.update(payload, { where: { id } });

exports.deleteGenderType = (id) => GenderType.destroy({ where: { id } });

exports.getGenderTypeAndGenderGroup = (query) => {
  return new Promise((resolve, reject) => {
    const { id } = query;
    
    // Associations
    GenderGroup.hasMany(GenderType, { foreignKey: 'id' });
    GenderType.belongsTo(GenderGroup, { foreignKey: 'id', targetKey: 'gendertypeId' });
    
    let condition = { status: 1 };
    if (id) {
      condition.id = id;
    }
  
    GenderType.findAndCountAll({
      include: {
        attributes: defaultGenderGroupAttributes,
        model: GenderGroup
      },
      attributes: defaultGenderTypeAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};