'use strict';
module.exports = (sequelize, DataTypes) => {
  const ageGroup = sequelize.define('ageGroups', {
    userId: DataTypes.INTEGER,
    agetypeId: DataTypes.INTEGER
  }, {});
  ageGroup.associate = function(models) {
    // associations can be defined here
  };
  return ageGroup;
};