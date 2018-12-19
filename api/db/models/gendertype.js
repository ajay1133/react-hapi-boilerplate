'use strict';
module.exports = (sequelize, DataTypes) => {
  const genderType = sequelize.define('genderType', {
    usersId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  genderType.associate = function(models) {
    // associations can be defined here
  };
  return genderType;
};