const smtp = require('../../smtp');
const config = require('config');
const jwt = require('../../../helpers/jwtHelper');

module.exports = (user) => {
  const url = config.BasePath.host;
  const subject = 'Reset Your Compass Password';
  const resetPassLink = `${url}/reset/password/${user.token}`;
  const model = Object.assign({}, user, { resetPassLink });
  return smtp.send(user.email, subject, model, __dirname);
};
