const db = require('../db');
const { TreatmentFocus, TreatmentFocusTypes }  = db.models;

// Services
const defaultTreatmentFocusAttributes = [
  'id',
  'userId',
  'treatmentfocustypeId'
];

exports.getAllTreatmentFocus = () => TreatmentFocus.findAndCountAll({
  attributes: defaultTreatmentFocusAttributes
});

exports.getTreatmentFocusByUser = (param) => {
  return new Promise((resolve, reject) => {
    const { userId } = param;
    
    TreatmentFocus.findAndCountAll({
      attributes: defaultTreatmentFocusAttributes,
      where: { userId }
    }).then(resolve).catch(reject);
  });
};

exports.createTreatmentFocus = (payload) => TreatmentFocus.create(payload);

exports.updateTreatmentFocus = (payload, id) => TreatmentFocus.update(payload, { where: { id } });

exports.deleteTreatmentFocus = (id) => TreatmentFocus.destroy({ where: { id } });



// Service Types
const defaultTreatmentFocusTypesAttributes = [
  'id',
  'name',
  'status'
];

exports.getAllTreatmentFocusTypes = () => TreatmentFocusTypes.findAndCountAll({
  attributes: defaultTreatmentFocusTypesAttributes,
  where: {
    status: 1
  }
});

exports.createTreatmentFocusTypes = (payload) => TreatmentFocusTypes.create(payload);

exports.createBulkTreatmentFocusTypes = (payload) => payload && Array.isArray(payload) && !!payload.length &&
TreatmentFocusTypes.bulkCreate(payload);

exports.updateTreatmentFocusTypes = (payload, id) => TreatmentFocusTypes.update(payload, { where: { id } });

exports.deleteTreatmentFocusTypes = (id) => TreatmentFocusTypes.destroy({ where: { id } });

exports.getTreatmentFocusTypesAndTreatmentFocus = (query) => {
  return new Promise((resolve, reject) => {
    const { id } = query;
    
    // Associations
    TreatmentFocus.hasMany(TreatmentFocusTypes, { foreignKey: 'id' });
    TreatmentFocusTypes.belongsTo(TreatmentFocus, { foreignKey: 'id', targetKey: 'treatmentfocustypeId' });
    
    let condition = { status: 1 };
    if (id) {
      condition.id = id;
    }
    
    TreatmentFocusTypes.findAndCountAll({
      include: {
        attributes: defaultTreatmentFocusAttributes,
        model: TreatmentFocus
      },
      attributes: defaultTreatmentFocusTypesAttributes,
      where: condition
    }).then(resolve).catch(reject);
  });
};