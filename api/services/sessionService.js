const assert = require('assert');
const i18n = require('../helpers/i18nHelper');
const Boom = require('boom');
const db = require('../db');
const cryptoHelper = require('../helpers/cryptoHelper');
const constants = require('../constants');
const User = db.models.User;

/**
 * Find session user on basis of sessionData from JWT
 * @param sessionData { id }
 */
exports.findSessionUser = (sessionData) =>
  new Promise((resolve, reject) => {
    User
      .findOne({
        where: { id: sessionData.id },
        attributes: ['id']
      })
      .then(resolve)
      .catch (reject);
});


/**
 * Authenticate a user by its email and plain password
 * @param email
 * @param password
 */
exports.authenticate = async (email, password) => {
  assert(email, i18n('services.sessionService.missingEmail'));
  assert(password, i18n('services.sessionService.missingPassword'));
  
  let userDetails = await User.findOne({
    where: {email: email },
    attributes: constants.USER_AUTHENTICATION_ATTRIBUTES
  });
  
  let user;
  
  if (userDetails) {
    user = userDetails.toJSON();
    
    if (user.salt) {
      let hashData = await cryptoHelper.hashStringWithSalt(password, user.salt);
      
      if (user.hash !== hashData.hash) {
        return Boom.badRequest(i18n('services.sessionService.wrongUsernamePassword'));
      }
    } else {
      return Boom.badRequest(i18n('services.sessionService.wrongUsernamePassword'));
    }
    
    // Sanitize user and return
    delete user.hash;
    delete user.salt;
  }
  
  return user;
};
