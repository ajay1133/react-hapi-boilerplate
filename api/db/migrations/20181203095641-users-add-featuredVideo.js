'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'featuredVideo', {
        type: Sequelize.TEXT,
        allowNull: true,
        after: 'image'
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'featuredVideo');
  }
};
