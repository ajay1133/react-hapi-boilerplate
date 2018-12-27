exports.ROLES = [
  'free',
  'basic',
  'standard',
  'pro',
  'enterprise'
];

exports.DEFAULT_USER_ATTRIBUTES = [
	'id',
	'role',
	'email',
	'firstName',
	'lastName',
	'title',
	'address',
	'phone',
	'website',
	'description',
	'image',
	'featuredVideo',
	'status'
];

exports.USER_AUTHENTICATION_ATTRIBUTES = [
	'id',
	'email',
	'hash',
	'salt',
	'firstName',
	'lastName',
	'role'
];

exports.DEFAULT_USER_SERVICES_ATTRIBUTES = [
	'id',
	'usersId',
	'serviceTypesId',
	'name',
	'status'
];