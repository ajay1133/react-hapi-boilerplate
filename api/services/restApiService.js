const db = require('../db');
const { User, AgeGroup, GenderGroup, TreatmentFocus, Search } = db.models;
const { contactUs } = require('../mailer');
const constants = require('../constants');

/**
 * Return all user accounts for management
 */
exports.getAllAccounts = (query) => new Promise( ( resolve, reject ) => {
  let { status, search, zip, page, limit, gender, age, insurance } = query;
  let conditionArr = [];
  let finalInclude = [];
  
  let staticKeyObj = { status, search, zip, gender, age, insurance };
  
  Object.entries(staticKeyObj).forEach(([key, value]) => {
    if (value) {
      if (key === 'search') {
        // Associations
        User.hasMany(Search, { foreignKey: 'userId' });
        Search.belongsTo(User, { foreignKey: 'userId' });
        
        finalInclude.push({
          attributes: ['userId', 'searchkeywordtypeId'],
          model: Search,
          where: {
            searchkeywordtypeId: { $in: [JSON.parse("[" + value + "]")] }
          }
        });
      } else if (key === 'zip') {
        conditionArr.push({ zip: { $like: `${zip}%` } });
      } else if (key === 'gender') {
        // Associations
        User.hasMany(GenderGroup, { foreignKey: 'userId' });
        GenderGroup.belongsTo(User, { foreignKey: 'userId' });
  
        finalInclude.push({
          attributes: ['userId', 'gendertypeId'],
          model: GenderGroup,
          where: {
            gendertypeId: { $in: [JSON.parse("[" + value + "]")] }
          }
        });
      } else if (key === 'age') {
        // Associations
        User.hasMany(AgeGroup, { foreignKey: 'userId' });
        AgeGroup.belongsTo(User, { foreignKey: 'userId' });
        
        finalInclude.push({
          attributes: ['userId', 'agetypeId'],
          model: AgeGroup,
          where: {
            agetypeId: { $in: [JSON.parse("[" + value + "]")] }
          }
        });
      } else if (key === 'insurance') {
        // Associations
        User.hasMany(TreatmentFocus, { foreignKey: 'userId' });
        TreatmentFocus.belongsTo(User, { foreignKey: 'userId' });
  
        finalInclude.push({
          attributes: ['userId', 'treatmentfocustypeId'],
          model: TreatmentFocus,
          where: {
            treatmentfocustypeId: { $in: [JSON.parse("[" + value + "]")] }
          }
        });
      } else {
        conditionArr.push({ status });
      }
    }
  });
  
  page = page && page > 1 ? page : 1;
  let offset = page - 1;
  limit = (limit && parseInt(limit)) || 0;
  offset *= limit;
  
	User
    .findAndCountAll({
	    attributes: constants.DEFAULT_USER_ATTRIBUTES,
      include: finalInclude,
      where: {
        role: 2,
        $and: conditionArr
      },
      offset,
      limit
    })
    .then(resolve)
    .catch (reject);
});

/**
 * sendContactUs: Used to send contact us email
 * @param payload
 * @returns {Promise.<*>}
 */
exports.sendContactUs = async (payload) =>  {
  try {
    const { name, email, message } = payload;
    // Contact Us Email
    const subject = ' Contact US Email';
    const model = { name, message };
    return contactUs(email, subject, model);
  } catch(err) {
    return err;
  }
};