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