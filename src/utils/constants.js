export const OFFSET = 10;

export const SCORE_INTERVAL_OPTIONS =[
  { value:.01, text: .01 },
  { value:.1, text:.1 },
  { value:1, text:1 },
  { value:10, text:10 },
  { value:100, text:100 }
];

export const SCORE_ERROR_MESSAGE = 'There must be at least 10 options for fans to score by, please adjust the Min, Max, and Score Interval';

export const DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES = 3000;

export const ROOT_BRANCH = 'master';

export const REPO_PATH = 'content/blog';

export const USER_PROFILE_PATH = 'content/profile';

export const DEFAULT_ACCESSIBLE_ROOT_PATH = `/${ROOT_BRANCH}/${REPO_PATH}`;

export const MD_FILE_META_DATA_KEYS = [
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
	'draft'
];

export const KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS = [
	'id',
	'fileName',
	'filePath',
	'content',
	'serviceType',
	'hash',
	'salt',
	'role',
	'status',
	'isDeleted',
	'inviteToken',
	'inviteStatus',
	'updatedAt',
	'createdAt',
	'otherDetails'
];

export const MD_FILE_DRAFT_OPTIONS_LIST = [
	{
		value: 'true',
		text: 'true',
		className: 'radioBtn',
		readOnly: false
	},
	{
		value: 'false',
		text: 'false',
    className: 'radioBtn',
		readOnly: false
	}
];

export const MD_META_INITIAL_VALUES = {
  draft: false
};

export const VALID_ACCESSIBLE_FILE_FORMATS = ['md'];

export const VALID_ACCESSIBLE_IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];

export const DEFAULT_BITBUCKET_LIST_FILTERS = {
	path: DEFAULT_ACCESSIBLE_ROOT_PATH,
	page: 1
};

export const DEFAULT_HOME_PAGE_ROUTES = [];

DEFAULT_HOME_PAGE_ROUTES[1] = '/accounts';
DEFAULT_HOME_PAGE_ROUTES[2] = '/profile';

export const DEFAULT_PASSWORD_MIN_LENGTH = 6;

export const USER_PROFILE_TABS = [
	'profileDetails',
	'userServices',
	'password'
];

export const USER_PROFILE_DETAILS_FORM_KEYS = [
	'title',
	'firstName',
	'lastName',
	'email',
	'phone',
	'website',
	'description'
];

export const USER_PASSWORD_SECTION_FORM_KEYS = [
	'password',
	'confirmPassword'
];

export const DEFAULT_USER_PROFILE_IMAGE_URL = 'images/default_User_Profile_Image.png';

export const VALID_BEGIN_FILE_NAME = '^[_|0-9|a-z|A-Z]+';

export const IMAGE_FILE_NAME_BEGIN_REG_EXP = '^[_|0-9|a-z|A-Z|//|-]+';