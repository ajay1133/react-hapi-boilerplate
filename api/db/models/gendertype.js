'use strict';
module.exports = (sequelize, DataTypes) => {
  const genderType = sequelize.define('genderTypes', {
    name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  genderType.associate = function(models) {
    // associations can be defined here
  };
  return genderType;
};