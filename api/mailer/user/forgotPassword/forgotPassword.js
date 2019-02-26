const smtp = require('../../smtp');
const config = require('config');

module.exports = (user) => {
  const url = config.BasePath.host;
  const subject = 'Reset Your Password';
  const resetPassLink = `${url}/accept/invitation/${user.token}`;
  const model = Object.assign({}, user, { resetPassLink });
  
  return smtp.send(user.email, '', '', '', subject, model, __dirname);
};
