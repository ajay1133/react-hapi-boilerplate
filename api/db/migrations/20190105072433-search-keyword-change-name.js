'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn('searchkeywords', 'keyword', 'name');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('searchkeywords', 'name', 'keyword');
  }
};
