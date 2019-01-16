'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ageTypes', [
      {
        name: 'Below 18',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: '18 to 65',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Above 65',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ageTypes', null, {});
  }
};
