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
      address               : { type: Sequelize.TEXT, allowNull: true },
      state                 : { type: Sequelize.TEXT, defaultValue: '' },
      city                  : { type: Sequelize.TEXT, defaultValue: '' },
      zip                   : { type: Sequelize.TEXT, defaultValue: '' },
      phone                 : { type: Sequelize.STRING, allowNull: true },
      image                 : { type: Sequelize.STRING, allowNull: true },
      inviteToken           : { type: Sequelize.TEXT, allowNull: true },
      inviteStatus          : { type: Sequelize.TINYINT, defaultValue: 0 },
      status                : { type: Sequelize.TINYINT, allowNull: true },
      role                  : { type: Sequelize.INTEGER, allowNull: true },
      createdAt             : { type: Sequelize.DATE },
      updatedAt             : { type: Sequelize.DATE },
    },
    {
      defaultScope: {
        where: {
          status: 1
        }
      }
    },
    {
      tableName: 'users'
    }
  );

  users.getUserById = query => new Promise((resolve, reject) => {
      users
      .findOne(query)
      .then(resolve)
      .catch(reject);
  });

  return users;
};
