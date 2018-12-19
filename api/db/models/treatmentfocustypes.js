'use strict';
module.exports = (sequelize, DataTypes) => {
  const treatmentFocusTypes = sequelize.define('treatmentFocusTypes', {
    name: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {});
  treatmentFocusTypes.associate = function(models) {
    // associations can be defined here
  };
  return treatmentFocusTypes;
};