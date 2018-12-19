'use strict';
module.exports = (sequelize, DataTypes) => {
  const treatmentFocus = sequelize.define('treatmentFocus', {
    userId: DataTypes.INTEGER,
    treatmentfocustypeId: DataTypes.INTEGER
  }, {});
  treatmentFocus.associate = function(models) {
    // associations can be defined here
  };
  return treatmentFocus;
};