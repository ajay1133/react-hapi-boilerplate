export const OFFSET = 20;

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

export const ACCESSIBLE_ROOT_PATH = '/' + ROOT_BRANCH + '/' + REPO_PATH;

export const MD_FILE_META_DATA_KEYS = ['title', 'image', 'description', 'draft'];

export const KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS = ['fileName', 'content'];

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