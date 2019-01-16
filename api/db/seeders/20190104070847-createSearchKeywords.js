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
        type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Benzodiazepines',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        name: 'Cannabis',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Cocaine',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Other Prescription Drugs',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Methamphetamine',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Hallucinogens',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Inhalants',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Bath Salts',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'K2',
	      type: 'Drugs',
        status: 1,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
	      name: 'Other Drugs',
	      type: 'Drugs',
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
