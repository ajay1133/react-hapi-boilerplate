'use strict';
module.exports = (sequelize, DataTypes) => {
  const genderGroup = sequelize.define('genderGroup', {
    userId: DataTypes.INTEGER,
    gendertypeId: DataTypes.INTEGER
  }, {});
  genderGroup.associate = function(models) {
    // associations can be defined here
  };
  return genderGroup;
};