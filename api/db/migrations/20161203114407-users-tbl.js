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
      role: {type: Sequelize.INTEGER(2), allowNull: true },
      isDeleted: { type: Sequelize.BOOLEAN, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
