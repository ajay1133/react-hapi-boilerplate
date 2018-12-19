'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('treatmentFocusTypes', [{
        name: 'Self Pay fee',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Financing Available',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Private Insurance',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'State Financial Aid',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Scholarships',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('treatmentFocusTypes', null, {});
  }
};
