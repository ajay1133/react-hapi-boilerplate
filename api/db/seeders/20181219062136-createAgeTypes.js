'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ageTypes', [{
        type: 'Below 18',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        type: '18 to 65',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        type: 'Above 65',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ageTypes', null, {});
  }
};
