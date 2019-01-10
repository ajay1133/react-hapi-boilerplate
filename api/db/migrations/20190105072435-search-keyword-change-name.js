'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn('searchKeywords', 'keyword', 'name');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('searchKeywords', 'name', 'keyword');
  }
};
