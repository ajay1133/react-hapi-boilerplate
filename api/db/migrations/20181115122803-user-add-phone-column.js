'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'phone', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: false,
        after: "lastName"
      });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'phone');
  }
};
