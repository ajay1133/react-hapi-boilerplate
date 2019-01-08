const prefix = '/api';

module.exports = [
	{
		path: `${prefix}/ifEmailExists/{email}`,
		method: 'GET',
		config: require('./ifEmailExists'),
	},
  {
    path: `${prefix}/registration`,
    method: 'POST',
    config: require('./registration'),
  },
  {
    path: `${prefix}/contact`,
    method: 'POST',
    config: require('./contact'),
  }
];
