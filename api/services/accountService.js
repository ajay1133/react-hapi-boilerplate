const assert = require('assert');
const sequelize = require('sequelize');
const config = require('config');
const i18n = require('../helpers/i18nHelper');
const db = require('../db');
const cryptoHelper = require('../helpers/cryptoHelper');
const logger = require('../helpers/logHelper');
const Boom = require('boom');
const { User, AgeGroup, GenderGroup, TreatmentFocus } = db.models;
const jwtHelper = require('../helpers/jwtHelper');
const { userRegistration, contactUs } = require('../mailer');
const constants = require('../constants');

/**
 * Create a user
 * @param userPayload {email, password}
 */
exports.createUser = async (userPayload) =>  {
  assert(userPayload, i18n('services.accountService.missingUserPayload'));

  const userData = Object.assign({}, userPayload);
  
  delete userData.password;
  userData.role = userPayload.role || 2;
  
  try {
    let foundUser = await User.findOne({ where: { email: userPayload.email }});
    
    if (foundUser) {
      return i18n('services.accountService.emailExists');
    }
	  
    if (userPayload.password) {
	    let response = await cryptoHelper.hashString(userPayload.password);
      userData.role = 1;
      userData.hash = response.hash;
      userData.salt = response.salt;
    } else {
      userData.inviteToken = await jwtHelper.sign(userData, '48h', 'HS512');
      userData.inviteStatus = 0;
    }
    
    const result = await User.create(userData);
    // User Registration Email
    const url = config.BasePath.host;
    const subject = ' Welcome to Compass';
    const model = {
      inviteLink: userData.inviteToken ? `${url}/accept/invitation/${userData.inviteToken}` : `${url}`,
      name: userPayload.firstName + ' ' + userPayload.lastName,
      inviteToken: userData.inviteToken
    };
    await userRegistration(userPayload.email, subject, model);
    return result;
  } catch(err) {
    return err;
  }
};

/**
 * Return all user accounts for management
 */
exports.getAllAccounts = (query) => new Promise( ( resolve, reject ) => {
  let { status, keyword, page, limit, order, gender, age, insurance } = query;
  let conditionArr = [];
  let finalInclude = [];
  
  let staticKeyObj = { status, keyword, gender, age, insurance };
  
  Object.entries(staticKeyObj).forEach(([key, value]) => {
    if (value) {
      if (key === 'keyword') {
        let keywordArr = [
          { title: { $like: `%${keyword}%` } },
          { description: { $like: `%${keyword}%` } }
        ];
        
        conditionArr.push({ $or: keywordArr });
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
  
  if (!order) {
    order = JSON.stringify([['firstName', 'ASC']]);
  }
  
	User
    .findAndCountAll({
	    attributes: constants.DEFAULT_USER_ATTRIBUTES,
      include: finalInclude,
      where: {
        role: 2,
        $and: conditionArr
      },
      offset,
      limit,
      order: JSON.parse(order)
    })
    .then(resolve)
    .catch (reject);
});

/**
 * Get User on basis of user id
 * @param userId
 */
exports.getUser = async (userId) => {
  try {
    let userDetails = await User.findOne({
      attributes: constants.DEFAULT_USER_ATTRIBUTES,
      where: { id: userId }
    });
    
    if (userDetails) {
      return userDetails.toJSON();
    } else {
      return Boom.internal('User Not Found');
    }
  } catch(err) {
    return err;
  }
};

/**
 * Get User on basis of user email
 * @param email
 */
exports.getUserByEmail = async (email) => {
	try {
		let userDetails = await User.findOne({
			where: { email }
		});
		
		if (userDetails) {
			return userDetails.toJSON();
		} else {
			return Boom.internal('User Not Found');
		}
	} catch(err) {
		return err;
	}
};

/**
 * Update User
 * @param userPayload { email, password, firstName, lastName } etc
 */
 exports.updateUser = (id, userPayload) => new Promise((resolve, reject) => {
   // assert(userPayload, i18n('services.accountService.missingUserPayload'));
   const userData = Object.assign({}, userPayload);
   if (userPayload.password) {
     delete userData.password;
     delete userData.id;
     
     cryptoHelper
       .hashString(userPayload.password)
       .then(({ hash, salt }) => {
         userData.pwd = hash;
         userData.pwdSalt = salt;
       })
       .catch((dbErr) => {
         logger.error(dbErr);
         reject(i18n('db.error'));
       });
   }
   else {
     User
       .update(userData, { where: { id } })
       .then((data) => resolve(data))
       .catch('error');
   }
 });

 /**
  * Update user password on confirmation
  * @param userPayload { password, email }
  */

 exports.updatePassword = async (userPayload) => {
  try {
    const userData = Object.assign({}, userPayload);
    
    delete userData.password;
    
    let hashDetails = await cryptoHelper.hashString(userPayload.password);
    
    if (hashDetails) {
      userData.hash = hashDetails.hash;
      userData.salt = hashDetails.salt;
      
      let result = await User.update(userData, {where:{email: userPayload.email }});
      
      return result;
    }
  } catch(err) {
    return err;
  }
 };

/**
 * contactUs: Used to send contact us email
 * @param payload
 * @returns {Promise.<*>}
 */
exports.contactUs = async (payload) =>  {
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