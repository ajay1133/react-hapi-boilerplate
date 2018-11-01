import Immutable from 'immutable';

/**
 * This will keep track of
 * - menu
 * - locattion
 * - actions for page
 * - flash messages
 */

const FLASH_INFO = 'app/FLASH_INFO';
const FLASH_SUCCESS = 'app/FLASH_SUCCESS';
const FLASH_ERROR = 'app/FLASH_ERROR';

const initialState = Immutable.fromJS({
  flash: []
});


export default (state = initialState, action) => {
  switch (action.type) {
    case FLASH_INFO:
      return state.flash.push({ type: 'info', msg: action.msg, stamp: Date.now() });
    case FLASH_SUCCESS:
      return state.flash.push({ type: 'success', msg: action.msg, stamp: Date.now() });
    case FLASH_ERROR:
      return state.flash.push({ type: 'error', msg: action.msg, stamp: Date.now() });

    case 'FLUSH':
      return initialState;

    default:
      return state;
  }
};

/**
 * Flash info message
 * @param {string} msg
 */
export const flashInfo = msg => ({ type: FLASH_INFO, msg });

/**
 * Flash success message
 * @param {string} msg
 */
export const flashSuccess = msg => ({ type: FLASH_SUCCESS, msg });

/**
 * Flash error message
 * @param {string} msg
 */
export const flashError = msg => ({ type: FLASH_ERROR, msg });
