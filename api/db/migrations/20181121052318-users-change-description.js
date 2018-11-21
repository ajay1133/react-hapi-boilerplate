'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'description', {
      type: Sequelize.TEXT
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'description', {
      type: Sequelize.STRING
    });
  }
};
