const Sequelize = require('sequelize');
const config = require('config');
const settings = config.db;
const globalHooks = require('./globalHooks');

const db = new Sequelize(settings.database, settings.username, settings.password, {
  host: settings.host,
  dialect: 'mysql',
  port: settings.port || 3306,
  pool: {
    max: 5,
    min: 0,
  },
  operatorsAliases: Sequelize.Op,
  define: globalHooks
  }
);

db.models = {};
db.models.User = db.import('./models/User');
db.models.ServiceTypes = db.import('./models/servicetypes');
db.models.Services = db.import('./models/services');

// Associations
const models = db.models;
//Hooks

//User Hooks
models.User.addHook('afterCreate', 'sendInviteLink', (user, options) => {
  console.log("User Created");
});

// Export
module.exports = db;
