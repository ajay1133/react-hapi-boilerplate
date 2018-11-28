'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServiceTypes = sequelize.define('ServiceTypes', {
    name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  ServiceTypes.associate = function(models) {
    // associations can be defined here
  };
  return ServiceTypes;
};