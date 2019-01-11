'use strict';
module.exports = (sequelize, DataTypes) => {
  const contactUs = sequelize.define('contactUs', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: DataTypes.TINYINT
  }, {});
  contactUs.associate = function(models) {
    // associations can be defined here
  };
  return contactUs;
};