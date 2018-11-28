'use strict';
module.exports = (sequelize, DataTypes) => {
  const Services = sequelize.define('Services', {
    usersId: DataTypes.INTEGER,
    serviceTypesId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  Services.associate = function(models) {
    // associations can be defined here
  };
  return Services;
};