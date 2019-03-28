export const DEFAULT_LIMIT = 10;

export const DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES = 3000;

export const VALID_ACCESSIBLE_IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];

export const DEFAULT_HOME_PAGE_ROUTES = [];

DEFAULT_HOME_PAGE_ROUTES[1] = '/accounts';
DEFAULT_HOME_PAGE_ROUTES[2] = '/profile';

export const DEFAULT_PASSWORD_MIN_LENGTH = 6;

export const DEFAULT_ACTIVE_TAB_INDEX = 0;

export const DEFAULT_USER_PROFILE_IMAGE_URL = 'images/default_User_Profile_Image.jpg';

export const DEFAULT_BLOG_IMAGE_URL = 'images/default_Blog_Image.jpg';

export const DEFAULT_VALID_BEGIN_FILE_NAME_REG_EXP = '^[_|0-9|a-z|A-Z]+';

export const DEFAULT_IMAGE_FILE_NAME_BEGIN_REG_EXP = '^[_|0-9|a-z|A-Z|//|-]+';

export const DEFAULT_OPTION = 'SELECT';

export const STATES_LIST = [
	'Test State'
];

export const STATUS_DROPDOWN_OPTIONS_OBJECT_LIST = [
  { key: 0, text: 'Please select', value: '' },
  { key: 2, text: 'Pending', value: 2, label: { color: 'yellow', empty: true, circular: true }, },
  { key: 3, text: 'Denied', value: 3, label: { color: 'red', empty: true, circular: true }, },
  { key: 1, text: 'Active', value: 1, label: { color: 'green', empty: true, circular: true } },
];

export const USER_PROFILE_TABS = [
	{
		tabName: 'Home',
		associatedFormKeys: [
			'title',
			'firstName',
			'lastName',
			'email',
			'phone',
			'address',
			'city',
			'state',
			'zip',
			'description'
		]
	}
];

export const RELATIONAL_MAPPING_INFO_LIST = [
	/*{
		primaryTable: 'primaryTable',
		secondaryTable: 'secondaryTable',
		targetKey: 'targetKey',
		reduxStateKey: 'reduxStateKey',
		formValuesKey: 'formValuesKey',
		dataIncludeKey: 'dataIncludeKey'
	}*/
];

// Reducer constants
export const DEFAULT_ACCOUNT_LIST_FILTERS = {
	status: '',
	keyword: '',
	page: 1,
	limit: DEFAULT_LIMIT,
	order: [['firstName', 'ASC']]
};

export const DEFAULT_CONTACT_LIST_FILTERS = {
	status: '',
	keyword: '',
	page: 1,
	limit: DEFAULT_LIMIT,
	order: [['id', 'DESC']]
};