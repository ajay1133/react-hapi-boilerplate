const prefix = '/account';

module.exports = [
  {
    path: `${prefix}/all`,
    method: 'GET',
    config: require('./accountGetAll'),
  },
  {
    path: `${prefix}/{id?}`,
    method: 'GET',
    config: require('./accountGet'),
  },
  {
    path: `${prefix}`,
    method: 'POST',
    config: require('./accountCreate'),
  },
  {
    path: `${prefix}/login`,
    method: 'POST',
    config: require('./accountLogin'),
  },
  {
    path: `${prefix}/verify/token`,
    method: 'POST',
    config: require('./accountVerifyToken'),
  },
  {
    path: `${prefix}/contact`,
    method: 'POST',
    config: require('./accountContact'),
  },
  {
    path: `${prefix}/update/password`,
    method: 'PUT',
    config: require('./accountUpdatePassword'),
  },
  {
    path: `${prefix}/{id}`,
    method: 'PUT',
    config: require('./accountUpdate'),
  },
	{
		path: `${prefix}/update/passwordWithoutToken`,
		method: 'PUT',
		config: require('./accountUpdatePasswordWithoutToken'),
	},
];
