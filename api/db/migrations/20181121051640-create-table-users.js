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
      title: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT },
	    city: { type: Sequelize.STRING, allowNull: true },
	    state: { type: Sequelize.STRING, allowNull: true },
	    zip: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.TINYINT, allowNull: true, comment: '0= Deleted, 1=Active, 2=Pending, 3=Denied' },
      role: {type: Sequelize.INTEGER(2), allowNull: true },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
