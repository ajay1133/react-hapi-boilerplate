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
      title: { type: Sequelize.TEXT },
      address: { type: Sequelize.TEXT },
      phone: { type: Sequelize.STRING, allowNull: true },
      url: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.TINYINT, allowNull: true, comment: '1=Active, 2=Pending, 3=Denied' },
      role: {type: Sequelize.INTEGER(2), allowNull: true },
      isDeleted: { type: Sequelize.BOOLEAN, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
