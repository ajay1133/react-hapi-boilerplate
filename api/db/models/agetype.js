'use strict';
module.exports = (sequelize, DataTypes) => {
  const ageType = sequelize.define('ageTypes', {
    name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  ageType.associate = function(models) {
    // associations can be defined here
  };
  return ageType;
};