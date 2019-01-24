const assert = require('assert');
const i18n = require('../helpers/i18nHelper');
const db = require('../db');
const cryptoHelper = require('../helpers/cryptoHelper');
const logger = require('../helpers/logHelper');
const Boom = require('boom');
const { users } = db.models;
const jwtHelper = require('../helpers/jwtHelper');
const { userRegistration, contactUs } = require('../mailer');
const constants = require('../constants');

/**
 * Create a user
 * @param userPayload {email, password}
 */
exports.createUser = async (userPayload) =>  {
  try {
	  assert(userPayload, i18n('services.accountService.missingUserPayload'));
	  assert(userPayload.email, i18n('services.accountService.missingUserEmail'));
	  assert(constants, i18n('constants.missing.DEFAULT_USER_REGISTRATION_ROLE'));
	  
    const userData = Object.assign({}, userPayload);
    if (userPayload.password) {
	    delete userData.password;
    }
    
	  userData.role = userPayload.role || constants.DEFAULT_USER_REGISTRATION_ROLE;
    let foundUser = await users.findOne({ where: { email: userPayload.email }});
    
    if (foundUser) {
      return i18n('services.accountService.emailExists');
    }
	  
    if (userPayload.password) {
	    let response = await cryptoHelper.hashString(userPayload.password);
      userData.hash = response.hash;
      userData.salt = response.salt;
    } else {
      userData.inviteToken = await jwtHelper.sign(userData, '48h', 'HS512');
      userData.inviteStatus = 0;
    }
    
    const result = await users.create(userData);
    
    // Send user registration email if payload contains sendEmail object
    if (userPayload.sendEmail) {
      await userRegistration(userPayload.email, userPayload.sendEmail.subject, userPayload.sendEmail.data);
    }
    
    return result;
  } catch(err) {
    return err;
  }
};

/**
 * Get User on basis of user id
 * @param userId
 */
exports.getUser = async (userId) => {
  console.log('user fetching: ', userId, users);
  try {
    let userDetails = await users.findOne({
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
 * Get User on basis of search query
 * @param userId
 */
exports.getUsersBySearchParams = async (query) => {
	console.log('user fetching: ', userId, users);
	try {
		let userDetails = await users.findOne({
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
		let userDetails = await users.findOne({
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
     users
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
  
      return await users.update(userData, { where:{email: userPayload.email }});
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
    const subject = ' Thank you for writing to us';
    const model = { name, message };
    return contactUs(email, subject, model);
  } catch(err) {
    return err;
  }
};