const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
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
      phone                 : { type: Sequelize.STRING, allowNull: true },
      url                   : { type: Sequelize.STRING, allowNull: true },
      description           : { type: Sequelize.TEXT, allowNull: true },
      image                 : { type: Sequelize.STRING, allowNull: true },
      featuredVideo         : { type: Sequelize.TEXT, allowNull: true },
      inviteToken           : { type: Sequelize.TEXT, allowNull: true },
      inviteStatus          : { type: Sequelize.TINYINT, defaultValue: 0 },
      status                : { type: Sequelize.TINYINT, allowNull: true },
      role                  : { type: Sequelize.INTEGER, allowNull: true },
      isDeleted             : { type: Sequelize.BOOLEAN, defaultValue: 0 },
	    createdAt             : { type: Sequelize.DATE },
      updatedAt             : { type: Sequelize.DATE },
    },
    {
      defaultScope: {
        where: {
          isDeleted: 0
        }
      }
    },
    {
      tableName: 'users'
    }
  );

  User.getUserById = query => new Promise((resolve, reject) => {
      User
      .findOne(query)
      .then(resolve)
      .catch(reject);
  });

  return User;
};
