const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const users = sequelize.define(
    'users',
    {
      id                    : { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      email                 : { type: Sequelize.STRING, allowNull: true },
      hash                  : { type: Sequelize.TEXT },
      salt                  : { type: Sequelize.TEXT },
      firstName             : { type: Sequelize.STRING, allowNull: true },
      lastName              : { type: Sequelize.STRING, allowNull: true },
      title                 : { type: Sequelize.TEXT, allowNull: true },
      address               : { type: Sequelize.TEXT, allowNull: true },
      state                 : { type: Sequelize.TEXT, defaultValue: '' },
      city                  : { type: Sequelize.TEXT, defaultValue: '' },
      zip                   : { type: Sequelize.TEXT, defaultValue: '' },
      phone                 : { type: Sequelize.STRING, allowNull: true },
      description           : { type: Sequelize.TEXT, allowNull: true },
      image                 : { type: Sequelize.STRING, allowNull: true },
      featuredVideo         : { type: Sequelize.STRING, allowNull: true },
      inviteToken           : { type: Sequelize.TEXT, allowNull: true },
      inviteStatus          : { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      status                : { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      role                  : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 2 },
      createdAt             : { type: Sequelize.DATE },
      updatedAt             : { type: Sequelize.DATE },
    },
    {
      tableName: 'users'
    }
  );
	return users;
};
