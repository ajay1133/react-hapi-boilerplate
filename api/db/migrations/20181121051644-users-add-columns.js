'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface
        .addColumn('users', 'title', {
          type: Sequelize.TEXT,
          allowNull: true,
          after: "lastName"
        }),
      queryInterface
        .addColumn('users', 'address', {
          type: Sequelize.TEXT,
          allowNull: true,
          after: "title"
        })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'title'),
      queryInterface.removeColumn('users', 'address')
    ];
  }
};
