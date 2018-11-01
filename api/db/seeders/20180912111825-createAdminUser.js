const accountService = require('../../services/accountService');
module.exports = {
  up: () => new Promise((resolve, reject) => {
    const adminUser = {
      email: 'admin@simsaw.com',
      password: "admin123",
      role: 1,
      firstName: "Admin",
      lastName: "User"
    };
    accountService
      .createUser(adminUser)
      .then(resolve)
      .catch(reject);

  }),

  down: () => { }
};
