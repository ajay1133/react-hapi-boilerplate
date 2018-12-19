'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('genderTypes', [{
        type: 'Co-Ed',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        type: 'Female',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        type: 'Male',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        type: 'LGBT Friendly',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('genderTypes', null, {});
  }
};
