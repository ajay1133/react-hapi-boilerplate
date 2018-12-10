'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'inviteStatus', {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        after: 'inviteToken'
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'inviteStatus');
  }
};
