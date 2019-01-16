'use strict';

const accountService = require('../../services/accountService');
const userService = require('../../services/userService');
const currentDate = new Date();

const runUpSeeders = (queryInterface, Sequelize) => new Promise((resolve, reject) => {
	const adminUser = {
		email: 'admin@simsaw.com',
		password: "admin123",
		role: 1,
		firstName: "Admin",
		lastName: "User"
	};
	
	const serviceTypes = [
		{
			name: 'Treatment Type',
			status: 1
		},
		{
			name: 'Type Of Services',
			status: 1
		},
		{
			name: 'Level Of Care',
			status: 1
		},
		{
			name: 'Treatment Focus',
			status: 1
		}
	];
 
	const ageTypesInsertList = [
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
		}
  ];
	
	const genderTypesInsertList = [
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
		}
  ];
	
	const treatmentFocusTypeInsertList = [
	  {
		  name: 'Self Pay Fee',
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
		}
  ];
	
	const searchKeywordsInsertList = [
	  {
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
		}
  ];
	
	const promisesList = [
		new Promise((resolve, reject) => {
			accountService
				.createUser(adminUser)
				.then(resolve)
				.catch(reject);
		}),
		new Promise((resolve, reject) => {
			userService
				.createBulkServiceTypes(serviceTypes)
				.then(resolve)
				.catch(reject);
		}),
		queryInterface.bulkInsert('ageTypes', ageTypesInsertList, {}),
		queryInterface.bulkInsert('genderTypes',genderTypesInsertList , {}),
		queryInterface.bulkInsert('treatmentFocusTypes', treatmentFocusTypeInsertList, {}),
		queryInterface.bulkInsert('searchKeywords', searchKeywordsInsertList, {})
	];
	
	return Promise
    .all(promisesList)
    .then(resolve)
    .catch(reject);
});

const runDownSeeders = (queryInterface, Sequelize) => new Promise((resolve, reject) => {
  const promisesList = [
	  queryInterface.bulkDelete('ageTypes', null, {}),
	  queryInterface.bulkDelete('genderTypes', null, {}),
	  queryInterface.bulkDelete('treatmentFocusTypes', null, {}),
	  queryInterface.bulkDelete('searchKeywords', null, {})
  ];
  
  return Promise
    .all(promisesList)
    .then(resolve)
    .catch(reject);
});

module.exports = {
  up: (queryInterface, Sequelize) => runUpSeeders(queryInterface, Sequelize),
  down: (queryInterface, Sequelize) => runDownSeeders(queryInterface, Sequelize)
};
