const path = require('path');
const Glue = require('glue');
const i18n = require('i18n');
process.env.NODE_CONFIG_DIR = path.join(__dirname, '../config');
// Helpers
const appHelper = require('./helpers/appHelper');
const logger = require('./helpers/logHelper');
// Glue server
const manifest = require('./manifest');
// Locale Settings
i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.resolve(__dirname, 'locales'),
  autoReload: true,
  objectNotation: true
});
// Start server definition
const startServer = async function () {
  try {
      const server = await Glue.compose(manifest, { relativeTo: path.join(__dirname) });
      server.events.on('log', logger);
      const healthCheck = async () => await appHelper.checkDbConnection();
      // Health route
      server.route({
        path: '/heart-beat',
        method: 'GET',
        handler: async (request, h) => {
          const health = await healthCheck();
          if (health) {
            return h.response('ok');
          }
        },
      });
      // Health route
      server.route({
        path: '/',
        method: 'GET',
        handler: (request, h) => {
          return h.response(i18n.__('db.error'));
        },
      });
      // Check health and start server
      await healthCheck();
      await server.start();
  }
  catch (err) {
      console.error(err);
      process.exit(1);
  }
};
// Start server
startServer();
