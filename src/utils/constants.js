export const OFFSET = 10;

export const DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES = 3000;

export const VALID_ACCESSIBLE_IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];

export const DEFAULT_HOME_PAGE_ROUTES = [];

DEFAULT_HOME_PAGE_ROUTES[1] = '/accounts';
DEFAULT_HOME_PAGE_ROUTES[2] = '/profile';

export const DEFAULT_PASSWORD_MIN_LENGTH = 6;

export const DEFAULT_ACTIVE_TAB_INDEX = 1;

export const DEFAULT_USER_PROFILE_IMAGE_URL = 'images/default_User_Profile_Image.jpg';

export const DEFAULT_BLOG_IMAGE_URL = 'images/default_Blog_Image.jpg';

export const VALID_BEGIN_FILE_NAME = '^[_|0-9|a-z|A-Z]+';

export const IMAGE_FILE_NAME_BEGIN_REG_EXP = '^[_|0-9|a-z|A-Z|//|-]+';

export const DEFAULT_OPTION = 'SELECT';

export const STATES_LIST = [];

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