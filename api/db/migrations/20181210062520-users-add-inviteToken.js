'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'inviteToken', {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'featuredVideo'
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'inviteToken');
  }
};
