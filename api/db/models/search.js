'use strict';
module.exports = (sequelize, DataTypes) => {
  const search = sequelize.define('search', {
    userId: DataTypes.INTEGER,
    searchkeywordId: DataTypes.INTEGER
  }, {});
  search.associate = function(models) {
    // associations can be defined here
  };
  return search;
};