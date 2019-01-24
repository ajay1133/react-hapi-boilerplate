'use strict';
module.exports = (sequelize, DataTypes) => {
  const blogs = sequelize.define('blogs', {
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    draft: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    fileName: DataTypes.STRING,
  }, {});
  blogs.associate = function(models) {
    // associations can be defined here
  };
  return blogs;
};