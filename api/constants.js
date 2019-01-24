exports.ROLES = [
  'admin',
  'user'
];

exports.DEFAULT_USER_REGISTRATION_ROLE = 2;

exports.DEFAULT_USER_ATTRIBUTES = [
	'id',
	'role',
	'email',
	'firstName',
	'lastName',
	'address',
	'state',
	'city',
	'zip',
	'phone',
	'image',
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

