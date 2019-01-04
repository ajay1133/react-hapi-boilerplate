'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('searchKeywords', [{
        keyword: 'Alcohol',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Opioids',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Benzodiazepines',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Cannabis',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Cocaine',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Other Prescription Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Methamphetamine',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Hallucinogens',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Inhalants',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Bath Salts',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'K2',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Other Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Sex Addiction',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Video Game Addiction',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        keyword: 'Other Addictions',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('searchKeywords', null, {});
  }
};
