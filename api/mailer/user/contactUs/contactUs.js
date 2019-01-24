const smtp = require('../../smtp');

module.exports = (to, subject, model) => {
  return smtp.send(to, '', '', '', subject, model, __dirname);
};
