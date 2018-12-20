'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('genderTypes', [
      {
        name: 'Co-Ed',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Female',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Male',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'LGBT Friendly',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('genderTypes', null, {});
  }
};
