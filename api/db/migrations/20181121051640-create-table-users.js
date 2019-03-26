'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'users',
    {
      id: { type: Sequelize.BIGINT(11), primaryKey: true, autoIncrement: true  },
      email: {type: Sequelize.STRING, allowNull: true },
      hash: { type: Sequelize.TEXT, allowNull: true },
      salt: { type: Sequelize.TEXT, allowNull: true },
      firstName: { type: Sequelize.STRING, allowNull: true },
      lastName: { type: Sequelize.STRING, allowNull: true },
      title: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
	    city: { type: Sequelize.STRING, allowNull: true },
	    state: { type: Sequelize.STRING, allowNull: true },
	    zip: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      image: { type: Sequelize.STRING, allowNull: true },
      featuredVideo: { type: Sequelize.STRING, allowNull: true },
      inviteToken: { type: Sequelize.TEXT, allowNull: true },
      inviteStatus: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0, comment: '0= Not invited yet, 1= Invited' },
      status: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1, comment: '0= Deleted, 1=Active, 2=Pending, 3=Denied' },
      role: {type: Sequelize.INTEGER(2), allowNull: false, defaultValue: 2 },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true }
    }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
