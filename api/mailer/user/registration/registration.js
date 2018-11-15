const smtp = require('../../smtp');
const config = require('config');

module.exports = (user) => {
  const url = config.BasePath.host;
  const invitelink = `${url}/accept/invitation/${user.inviteToken}`;
  const subject = ' Welcome to Compass';
  const model = Object.assign({}, user, { invitelink } );
  return smtp.send(user.email, subject, model, __dirname);
};
