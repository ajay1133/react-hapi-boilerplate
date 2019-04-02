const Sequelize = require('sequelize');
const config = require('config');
const settings = config.db;
const globalHooks = require('./globalHooks');
const constants = require('../constants');
const path = require('path');
const fs = require('fs');

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const db = new Sequelize(settings.database, settings.username, settings.password, {
  host: settings.host,
  dialect: 'mysql',
  port: settings.port || 3306,
  pool: {
    max: 5,
    min: 0,
  },
  operatorsAliases,
  define: globalHooks
});

db.models = {};
const modelsDirRelativePath = './models';
const dbModelsDirAbsPath = path.resolve(__dirname, modelsDirRelativePath);

// Read ./models directory in db folder and assign to db.models object
fs.readdirSync(dbModelsDirAbsPath).forEach(file => {
	const fileName = path.parse(file).name;
	const fileExt = path.parse(file).ext;
	if (fileName && fileExt.toLowerCase() === '.js') {
    const modelToAssign = db.import(`${modelsDirRelativePath}/${fileName}`);
    if (typeof modelToAssign === 'function') {
      db.models[fileName] = modelToAssign;
    }
	}
});

// Associations
constants.RELATIONAL_MAPPING_LIST.forEach(v => {
  const parameterKeysList = [v.primaryTable, v.secondaryTable];
  // Check if primaryTable & secondaryTable exists in db.models object
  if (Object.keys(db.models).filter(r => parameterKeysList.indexOf(r) > -1).length === parameterKeysList.length) {
	  // create association
	  db.models[`${v.secondaryTable}`]
		  .hasMany(
        db.models[`${v.secondaryTable}`], 
        { foreignKey: 'id' }
      );
	  db.models[`${v.primaryTable}`]
		  .belongsTo(
        db.models[`${v.secondaryTable}`], 
        { 
          foreignKey: 'id', 
          targetKey: v.targetKey 
        }
      );
  } else {
    console.log('Invalid db models entry in Relational Mapping List', v.primaryTable, v.secondaryTable);
  }
});

// Export
module.exports = db;
