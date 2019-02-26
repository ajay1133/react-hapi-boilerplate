'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('contactUs', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  message: DataTypes.TEXT,
  status: DataTypes.TINYINT
}, {});