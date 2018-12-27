'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn('users', 'url', 'website');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'website', 'url');
  }
};
