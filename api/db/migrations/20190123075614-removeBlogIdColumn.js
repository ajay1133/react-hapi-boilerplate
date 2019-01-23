'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('blogs', 'id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('blogs', 'id', {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      });
  }
};
