const prefix = '/restApi';

module.exports = [
  {
    path: `${prefix}/ifEmailExists/{email}`,
    method: 'GET',
    config: require('./ifEmailExists'),
  },
  {
    path: `${prefix}/search`,
    method: 'GET',
    config: require('./search'),
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
  },
  {
    path: `${prefix}/stripe/create-customer`,
    method: 'POST',
    config: require('./stripe-create-customer')
  },
	{
		path: `${prefix}/stripe/create-customer-charge`,
		method: 'POST',
		config: require('./stripe-create-customer-charge')
	}
];
