'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
	  return [
		  queryInterface
			  .addColumn('users', 'inviteToken', {
				  type: Sequelize.TEXT,
				  allowNull: true
			  }),
		  queryInterface
			  .addColumn('users', 'inviteStatus', {
				  type: Sequelize.BOOLEAN,
				  defaultValue: 0
			  })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
	    queryInterface.removeColumn('users', 'inviteToken'),
	    queryInterface.removeColumn('users', 'inviteStatus')
    ];
  }
};
