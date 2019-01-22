'use strict';
module.exports = (sequelize, DataTypes) => {
  const blogs = sequelize.define('blogs', {
    fileName: DataTypes.STRING,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    draft: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
    status: DataTypes.BOOLEAN
  }, {});
  blogs.associate = function(models) {
    // associations can be defined here
  };
  return blogs;
};