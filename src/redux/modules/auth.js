import Immutable from 'immutable';
import store from 'store2';
import { push } from 'react-router-redux';
import { flush as flushAccount } from './account';
import { flush as flushContact } from './contact';
import { validObjectWithParameterKeys, typeCastToString } from '../../utils/commonutils';

// Action creators
// Loading
const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';
// Forgot password
const FORGOT_PASSWORD_SUCCESS = 'auth/FORGOT_PASSWORD_SUCCESS';
const FORGOT_PASSWORD_FAIL = 'auth/FORGOT_PASSWORD_FAIL';
// Login
const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
// SignUp
const SIGNUP = 'auth/SIGNUP';
const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'auth/SIGNUP_FAIL';
// Reset reducer
const FLUSH = 'auth/FLUSH';

const initialState = Immutable.fromJS({
  isLoad: false,
  loadErr: null,
  isLogin: false,
  loginErr: null,
  loginMsg: null,
  user: null,
  loading: false,
  signupError: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case LOAD:
      return state
        .set('isLoad', true)
        .set('loadErr', null);
    case LOAD_SUCCESS:
      return state
        .set('isLoad', false)
        .set(
          'user', 
          validObjectWithParameterKeys(action.user, ['id']) &&
          action.user
        );
    case LOAD_FAIL:
      return state
        .set('isLoad', false)
        .set(
					'loadErr', 
					(
						validObjectWithParameterKeys(action, ['error']) && 
						typeCastToString(action.error)
					) || state.loadErr
				)
        .set('user', null);
    // Forgot password
    case FORGOT_PASSWORD_SUCCESS:
      return state
        .set('isLogin', false)
        .set(
					'loginMsg', 
					(
						validObjectWithParameterKeys(action, ['message']) && 
						typeCastToString(action.message)
					) || state.loginMsg
				)
        .set('user', null);
    case FORGOT_PASSWORD_FAIL:
      return state
        .set('isLogin', false)
        .set(
					'loginErr', 
					(
						validObjectWithParameterKeys(action, ['error']) && 
						typeCastToString(action.error)
					) || state.loginErr
				)
        .set('loginMsg', null)
        .set('user', null);    
    // Login
    case LOGIN:
      return state
        .set('isLogin', true)
        .set('loginErr', null);
    case LOGIN_SUCCESS:
      return state
        .set('isLogin', false)
        .set(
          'user', 
          validObjectWithParameterKeys(action.user, ['id']) &&
          action.user
        );
    case LOGIN_FAIL:
      return state
        .set('isLogin', false)
        .set(
          'loginErr', 
          (
            validObjectWithParameterKeys(action, ['error']) && 
            typeCastToString(action.error)
          ) || state.loginErr
        )
        .set('user', null);    
    // SignUp
    case SIGNUP:
      return state
        .set('loading', true)
        .set('signupError', null);
    case SIGNUP_SUCCESS:
      return state
        .set('loading', false)
        .set('signupError', null)
        .set(
          'user', 
          validObjectWithParameterKeys(action.user, ['id']) &&
          action.user
        );
    case SIGNUP_FAIL:
      return state
        .set('loading', false)
        .set(
          'signupError', 
          (
            validObjectWithParameterKeys(action, ['error']) && 
            typeCastToString(action.error)
          ) || state.signupError
        )
        .set('user', null);
    // Reset reducer
    case FLUSH: {
      return initialState;
    }
    // Default
    default:
      return state;
  }
}

/**
 * To load users account details
 * Access role allowed - admin/user
 * @param forced boolean
 */
export const load = forced => async (dispatch, getState, api) => {
  // Dont call api if user data is set in state
  const user = getState().get('auth').get('user');
  if (user && !forced) {
    return;
  }
  // Start loading
  dispatch({ type: LOAD });
  try {
    // Ca;ll api to fetch user data
    const res = await api.get('/sessions');
    // If an error occurs
    if (validObjectWithParameterKeys(res, ['message'])) {
      dispatch({ 
        type: LOAD_FAIL, 
        error: typeCastToString(res.message) 
      });
      return;
    }
    if (validObjectWithParameterKeys(res, ['accessToken'])) {
      store('authToken', typeCastToString(res.accessToken));
      store('refreshToken', typeCastToString(res.refreshToken));
    }
    dispatch({ type: LOAD_SUCCESS, user: res });
    // Return user
    return res;
  } catch (err) {
    // If an error occurs, set error field
    dispatch({ 
			type: LOAD_FAIL, 
			error: (validObjectWithParameterKeys(err, ['message']) && typeCastToString(err.message)) || typeCastToString(err) 
		});
  }
};

/**
 * To authenticate user login
 * Access role allowed - admin/user
 * @param data object
 */
export const login = data => async (dispatch, getState, api) => {
  dispatch({ type: LOGIN });
  try {
    // Post session api to get 'authToken'
    const res = await api.post('/sessions?jwt=1', { data });
    // If response from api contains 'authToken' key
    if (validObjectWithParameterKeys(res, ['accessToken'])) {
      // Set authToken to local storage
      store('authToken', res.accessToken);
      dispatch({ type: LOGIN_SUCCESS, user: res });
      await dispatch(load(true));
      return res;
    }
  } catch (err) {
    // If an error occurs, set error field
    dispatch({
      type: LOGIN_FAIL,
      error: (
        validObjectWithParameterKeys(err, ['response']) && 
        validObjectWithParameterKeys(err.response, ['data']) &&
        validObjectWithParameterKeys(err.response.data, ['message']) && 
        err.response.data.message
      ) || 'System Error'
    });
  }
};

/**
 * To process forgot password request
 * Access role allowed - admin/user
 * @param email string
 */
export const forgotPassword = email => async (dispatch, getState, api) => {
  dispatch({ type: LOGIN });
  try {
    // Call api to initiate a mail
    const res = await api.post('/sessions/forgotPassword', { data: { email } });
    if (validObjectWithParameterKeys(res, ['message'])) {
      dispatch({ 
        type: FORGOT_PASSWORD_SUCCESS, 
        message: typeCastToString(res.message) 
      });
      return res;
    }
  } catch (err) {
    // If an error occurs, set error field
    dispatch({ 
			type: FORGOT_PASSWORD_FAIL, 
			error: (validObjectWithParameterKeys(err, ['message']) && typeCastToString(err.message)) || typeCastToString(err) 
		});
  }
};

/**
 * To verify user
 * Access role allowed - admin/user
 * @param email string
 * @param password string
 */
export const verifyUser = (email, password) => async (dispatch, getState, api) => {
	dispatch({ type: LOGIN });
	try {
    // Call post session api to verify
		const res = await api.post('/sessions?jwt=1', { data: { email, password } });
    return res;
	} catch (err) {
		return typeCastToString(err);
	}
};

/**
 * To logout user, this flushes or empties all browser states
 * Access role allowed - admin/user
 */
export const logout = () => async (dispatch) => {
  // Remove 'authToken' & 'refreshToken' from store
  store.remove('authToken');
  store.remove('refreshToken');
  // Flush this reducer
  await dispatch({ type: FLUSH });
  // Flush account reducer
  await dispatch(flushAccount());
  // Flush contact reducer
  await dispatch(flushContact());
  // Redirect user
  dispatch(push('/'));
};