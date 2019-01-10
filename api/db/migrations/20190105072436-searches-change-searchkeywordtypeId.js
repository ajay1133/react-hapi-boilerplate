'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .renameColumn('searches', 'searchkeywordId', 'searchkeywordtypeId');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('searches', 'searchkeywordtypeId', 'searchkeywordId');
  }
};
