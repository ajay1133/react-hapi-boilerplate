'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface
        .addColumn('users', 'url', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: false
        }),
      queryInterface
        .addColumn('users', 'description', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: false
        }),
      queryInterface
        .addColumn('users', 'image', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: false
        })
    ];
  },
  
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'url'),
      queryInterface.removeColumn('users', 'description'),
      queryInterface.removeColumn('users', 'image')
    ];
  }
};
