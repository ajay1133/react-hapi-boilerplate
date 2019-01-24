const accountService = require('../../services/accountService');

module.exports = {
  up: () => new Promise((resolve, reject) => {
    const adminUser = {
      email: 'superAdmin@test.com',
      password: "admin123",
      role: 1,
      firstName: "Super",
      lastName: "Admin"
    };
    
    accountService
      .createUser(adminUser)
      .then(resolve)
      .catch(reject);
  }),

  down: () => { }
};
