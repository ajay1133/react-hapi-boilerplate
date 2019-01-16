'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn('searchkeywords', 'type', Sequelize.STRING);
	},
	
	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('searchkeywords', 'type');
	}
};