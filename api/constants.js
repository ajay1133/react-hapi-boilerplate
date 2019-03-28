// Api folder constants
exports.DEFAULT_USER_ATTRIBUTES = [
	'id',
	'role',
	'email',
	'firstName',
	'lastName',
	'title',
	'address',
	'state',
	'city',
	'zip',
	'phone',
	'description',
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

exports.DEFAULT_USER_ROLES = [ 2 ];

exports.RELATIONAL_MAPPING_LIST = [
	/*
	** Follow the format
	** {
	** 		primaryTable: 'primaryTable',
	**		secondaryTable: 'secondaryTable',
	**		targetKey: 'targetKey'
	** }
	*/
];