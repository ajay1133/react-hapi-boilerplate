'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'users',
    {
      id: { type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true  },
      email: {type: Sequelize.STRING, allowNull: true },
      hash: { type: Sequelize.TEXT },
      salt: { type: Sequelize.TEXT },
      firstName: { type: Sequelize.STRING, allowNull: true },
      lastName: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT },
	    state: { type: Sequelize.STRING, allowNull: true },
	    city: { type: Sequelize.STRING, allowNull: true },
	    zip: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.TINYINT, allowNull: true, comment: '0=Inactive, 1=Active'},
      role: { type: Sequelize.INTEGER(2), allowNull: true },
      inviteToken: { type: Sequelize.STRING, allowNull: true },
      inviteStatus: { type: Sequelize.TINYINT, allowNull: false, comment: '0: Uninvited, 1=Invited' },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
