const assert = require('assert');
const sequelize = require('sequelize');
const i18n = require('../helpers/i18nHelper');
const db = require('../db');
const cryptoHelper = require('../helpers/cryptoHelper');
const logger = require('../helpers/logHelper');
const Boom = require('boom');
const User = db.models.User;
const jwtHelper = require('../helpers/jwtHelper');
const mailer = require('../mailer');

const defaultUserAttributes = [
  'id',
  'email',
  'firstName',
  'lastName',
  'phone',
  'url',
  'description',
  'status'
];

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
    let foundUser = await User.findOne({where: { email: userPayload.email }});
    
    if (foundUser) {
      return reject(i18n('services.accountService.emailExists'));
    }
    
    if (userPayload.password) {
      let response = await cryptoHelper.hashString(userPayload.password);
      
      userData.role = 1;
      userData.hash = response.hash;
      userData.salt = response.salt;
      
      let result = User.create(userData);
      return result;
    } else {
      let inviteToken =  await jwtHelper.sign(userData, '48h', 'HS512');
      
      userData.inviteToken = inviteToken;
      userData.inviteStatus = 0;
      
      let result = User.create(userData);
      return result;
    }
  } catch(err) {
    return err;
  }
};

/**
 * Return all user accounts for management
 */
exports.getAllAccounts = () => new Promise( ( resolve, reject ) => {
	User
    .findAndCountAll({
      where: {
        role: 2
      },
      attributes: defaultUserAttributes
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
      attributes: ['id', 'role', 'email', 'firstName', 'lastName'],
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
 * Update User
 * @param userPayload { email, password, firstName, lastName } etc
 */
 exports.updateUser = (userPayload) => new Promise((resolve, reject) => {
   assert(userPayload, i18n('services.accountService.missingUserPayload'));
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
     User.findOne({ where: { id: userPayload.id }})
      .then((existingUser) => {
        User.update(userData, { where: { id: userPayload.id } })
          .then((data) => {
//            if (existingUser.dataValues.email !== userData.email) {
//              let name = userPayload.firstName + ' ' + userPayload.lastName;
//
//              let response = mailer.userRegistration({
//                email: userPayload.email,
//                inviteToken: existingUser.dataValues.inviteToken,
//                name: name
//              });
//              console.log("Mail Response", response);
//            }
            resolve(data);
          })
          .catch('error');
      });
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