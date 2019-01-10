'use strict';

const currentDate = new Date();

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('searchKeywords', [{
        name: 'Alcohol',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Opioids',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Benzodiazepines',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Cannabis',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Cocaine',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Other Prescription Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Methamphetamine',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Hallucinogens',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Inhalants',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Bath Salts',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'K2',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Other Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Sex Addiction',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Video Game Addiction',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Other Addictions',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('searchKeywords', null, {});
  }
};
