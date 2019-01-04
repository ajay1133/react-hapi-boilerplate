const Sequelize = require('sequelize');
const config = require('config');
const settings = config.db;
const globalHooks = require('./globalHooks');

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
  }
);

db.models = {};
db.models.User = db.import('./models/User');

db.models.ServiceTypes = db.import('./models/servicetypes');
db.models.Services = db.import('./models/services');

db.models.AgeGroup = db.import('./models/agegroup');
db.models.AgeType = db.import('./models/agetype');

db.models.GenderGroup = db.import('./models/gendergroup');
db.models.GenderType = db.import('./models/gendertype');

db.models.TreatmentFocus = db.import('./models/treatmentfocus');
db.models.TreatmentFocusTypes = db.import('./models/treatmentfocustypes');

db.models.Search = db.import('./models/search');
db.models.SearchKeyword = db.import('./models/searchkeyword');


// Associations
const models = db.models;
//Hooks

//User Hooks
models.User.addHook('afterCreate', 'sendInviteLink', (user, options) => {
  console.log("User Created");
});

// Export
module.exports = db;
