const assert = require('assert');
const config = require('config');
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
exports.createUser = (userPayload) => new Promise((resolve, reject) => {
  try {
	  assert(userPayload, i18n('services.accountService.missingUserPayload'));
    const userData = Object.assign({}, userPayload);
	  delete userData.password;
	
	  userData.role = userPayload.role || 2;
	  
    users
	    .findOne({ where: { email: userPayload.email }})
	    .then(existingUser => {
	    	if (existingUser) {
	    		reject(i18n('services.accountService.emailExists'));
		    }
		    if (userPayload.password) {
			    return cryptoHelper.hashString(userPayload.password);
		    } else {
		    	return jwtHelper.sign(userData, '48h', 'HS512');
		    }
	    })
	    .then(response => {
		    if (userPayload.password) {
			    userData.hash = response.hash;
			    userData.salt = response.salt;
		    } else {
			    userData.inviteToken = response;
			    userData.inviteStatus = 0;
		    }
		
		    return users.create(userData);
	    })
	    .then(createdUser => {
		    // User Registration Email
		    if (userPayload.sendInvitationEmailFlag) {
			    const url = config.BasePath.host;
			    const subject = ' Welcome to ShareCabs';
			    const model = {
				    inviteLink: userData.inviteToken ? `${url}/accept/invitation/${userData.inviteToken}` : `${url}`,
				    name: userPayload.firstName + ' ' + userPayload.lastName,
				    inviteToken: userData.inviteToken
			    };
			    return Promise.all([
			    	createdUser,
			    	userRegistration(userPayload.email, subject, model)
		      ]);
		    }
		    return Promise.resolve(createdUser);
	    })
	    .then(response => {
		    if (userPayload.sendInvitationEmailFlag) {
		    	resolve(response[0]);
		    }
		    resolve(response);
	    })
	    .catch(reject);
  } catch(err) {
    return err;
  }
});

/**
 * Return all user accounts for management
 */
exports.getAllAccounts = (query) => new Promise(( resolve, reject ) => {
  let { page, limit, order } = query;
  let conditionArr = [];
  let finalInclude = [];
  
  page = page && page > 1 ? page : 1;
  let offset = page - 1;
  limit = (limit && parseInt(limit)) || 0;
  offset *= limit;
  
  if (!order) {
    order = JSON.stringify([['id', 'ASC']]);
  }
  
	users
    .findAndCountAll({
	    attributes: constants.DEFAULT_USER_ATTRIBUTES,
      include: finalInclude,
      where: {
        role: { $in: constants.DEFAULT_USER_ROLES },
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
  
      return await users.update(userData, { where:{ email: userPayload.email }});
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