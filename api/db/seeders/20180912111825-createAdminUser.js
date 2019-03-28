const accountService = require('../../services/accountService');
module.exports = {
  up: async () => {
    const adminUser = {
      email: `admin@shareCabs.com`,
      password: "admin123",
      role: 1,
      firstName: "Super",
      lastName: "Admin"
    };
    await accountService.createUser(adminUser);
  },
  down: () => {}
};
