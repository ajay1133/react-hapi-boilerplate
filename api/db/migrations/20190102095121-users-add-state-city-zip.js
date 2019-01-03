'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface
        .addColumn('users', 'state', {
          type: Sequelize.STRING,
          defaultValue: ''
        }),
      queryInterface
        .addColumn('users', 'city', {
          type: Sequelize.STRING,
          defaultValue: ''
        }),
      queryInterface
        .addColumn('users', 'zip', {
          type: Sequelize.STRING,
          defaultValue: ''
        })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'state'),
      queryInterface.removeColumn('users', 'city'),
      queryInterface.removeColumn('users', 'zip')
    ]);
  }
};
