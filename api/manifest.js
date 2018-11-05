const config = require('config');
const rootPackage = require('../package.json');
const constants = require('./constants');
var corsHeaders = {
  origin: ["*"],
  headers: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Access-Control-Request-Method", "Accept", "Content-Type", "If-None-Match", "Access-Control-Request-Headers","Connection, Host, Origin, X-Requested-With, Content-Type", "Authorization", "RefreshToken"],
  credentials: true
};
console.log(config.api);
module.exports = {
  server: {
    host: config.api.host,
    port: config.api.port,
    routes: {
      cors: corsHeaders
    }
  },
  register: {
      plugins: [
        {
            plugin: require('inert')
        },
        {
            plugin: require('vision')
        },
        {
          plugin: require('hapi-swagger'),
          options:  {
            pathPrefixSize: 1,
            grouping: 'tags',
            sortTags: 'name',
            expanded: 'none',
            info: {
              title: `${rootPackage.name} Documentation`,
              version: rootPackage.version,
              contact: {
                name: 'Simsaw',
                email: 'info@simsaw.com',
              },
            },
          },
        },
        {
          plugin: require('yar'),
          options: {
            storeBlank: false,
            cookieOptions: {
              password: config.api.secret,
              isSecure: false,
              isHttpOnly: true,
            },
          },
        },
        {
          plugin: require('./plugins/auth'),
          options: {
            secret: config.api.secret,
            isSecure: false
          },
        },
        {
          plugin: require('./plugins/common'),
          options: {},
        },
        {
          plugin: require('./plugins/notification'),
          options: {
            host: config.redis.host,
            port: config.redis.port
          },
        },
        {
          plugin: require('hapi-router'),
          options: {
            cwd: __dirname,
            routes: 'controllers/**/*Controller.js',
          },
        },
        {
          plugin: require('good'),
          options: {
            reporters: {
              console: [
                {
                  module: 'good-squeeze',
                  name: 'Squeeze',
                  args: [{
                    response: '*',
                    error: '*',
                    log: '*',
                  }],
                },
                {
                  module: 'good-console',
                },
                'stdout',
              ],
            },
          },
        }
      ],
      options: {
          once: true
      }
  }
};

// module.exports = {
//   connections: [
//     {
//       labels: ['api'],
//       host: config.api.host,
//       port: config.api.port,
//       routes: {
//         cors: true
//       }
//     },
//   ],

//   registrations: [

//     { plugin: { register: 'inert' } }, // required by hapi-swagger

//     { plugin: { register: 'vision' } }, // required by hapi-swagger

//     {
//       plugin: {
//         register: 'hapi-swagger',
//         options: {
//           info: {
//             title: `${rootPackage.name} Documentation`,
//             version: rootPackage.version,
//             contact: {
//               name: 'Ankit Patial',
//               email: 'ankit@simsaw.com',
//             },
//           },
//         },
//       },
//     },
//     {
//       plugin: {
//         register: 'yar',
//         options: {
//           storeBlank: false,
//           cookieOptions: {
//             password: config.api.secret,
//             isSecure: false,
//             isHttpOnly: true,
//           },
//         },
//       },
//     },

//     {
//       plugin: {
//         register: './plugins/auth',
//         options: {
//           secret: config.api.secret,
//           isSecure: false
//         },
//       },
//     },
//     {
//       plugin: {
//         register: './plugins/cognito',
//         options: {
//           userPoolId: config.cognito.userPoolId,
//           clientId: config.cognito.clientId
//         },
//       },
//     },
//     {
//       plugin: {
//         register: './plugins/common',
//         options: {},
//       },
//     },

//     {
//       plugin: {
//         register: './plugins/notification',
//         options: {
//           host: config.redis.host,
//           port: config.redis.port
//         },
//       },
//     },

//     {
//       plugin: {
//         register: 'hapi-authorization',
//         options: {
//           roles: constants.ROLES_LIST,
//         },
//       },
//     },

//     {
//       plugin: {
//         register: 'hapi-router',
//         options: {
//           cwd: __dirname,
//           routes: 'controllers/**/*Controller.js',
//         },
//       },
//     },

//     {
//       plugin: {
//         register: 'good',
//         options: {
//           reporters: {
//             console: [
//               {
//                 module: 'good-squeeze',
//                 name: 'Squeeze',
//                 args: [{
//                   response: '*',
//                   error: '*',
//                   log: '*',
//                 }],
//               },
//               {
//                 module: 'good-console',
//               },
//               'stdout',
//             ],
//           },
//         },
//       },
//     }
//   ]
// };
