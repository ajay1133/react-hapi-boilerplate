import Immutable from 'immutable';
import store from 'store2';
import { push } from 'react-router-redux';

const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';

const SIGNUP = 'auth/SIGNUP';
const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'auth/SIGNUP_FAIL';


const LOGOUT = 'auth/LOGOUT';

const FLUSH = 'auth/FLUSH';

const initialState = Immutable.fromJS({
  isLoad: false,
  loadErr: null,
  isLogin: false,
  loginErr: null,
  user: null,
  loading: false,
  signupError: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state
        .set('isLoad', true)
        .set('loadErr', null);

    case LOAD_SUCCESS:
      return state
        .set('isLoad', false)
        .set('user', action.user);

    case LOAD_FAIL:
      return state
        .set('isLoad', false)
        .set('loadErr', action.error)
        .set('user', null);


    case LOGIN:
      return state
        .set('isLogin', true)
        .set('loginErr', null);

    case LOGIN_SUCCESS:
      return state
        .set('isLogin', false)
        .set('user', action.user);

    case LOGIN_FAIL:
      return state
        .set('isLogin', false)
        .set('loginErr', action.error)
        .set('user', null);

    case SIGNUP:
      return state
        .set('loading', true)
        .set('signupError', null);

    case SIGNUP_SUCCESS:
      return state
        .set('loading', false)
        .set('signupError', null)
        .set('user', action.user);

    case SIGNUP_FAIL:
      return state
        .set('loading', false)
        .set('signupError', action.error)
        .set('user', null);

    case LOGOUT:
    case FLUSH: {
      return initialState;
    }

    default:
      return state;
  }
}


export const load = (forced) => async (dispatch, getState, api) => {
  // dont call api if user data is in state
  const user = getState().get('auth').get('user');
  
  if (user && !forced) {
    return;
  }
  
  dispatch({ type: LOAD });
  
  try {
    const res = await api.get('/sessions');
    
    if (res.message) {
      dispatch({ type: LOAD_FAIL, error: res.message });
      return;
    }
    
    if (res.accessToken) {
      store('authToken', res.accessToken);
      store('refreshToken', res.refreshToken);
    }
    
    dispatch({ type: LOAD_SUCCESS, user: res });
    return res;
  } catch (error) {
    dispatch({ type: LOAD_FAIL, error });
  }
};

export const login = (email, password) => async (dispatch, getState, api) => {
  dispatch({ type: LOGIN });
  
  try {
    const res = await api.post('/sessions?jwt=1', { data: { email: email, password:  password} });
    
    // set authToken to local storage
    store('authToken', res.accessToken);
    
    dispatch({ type: LOGIN_SUCCESS, user: res });
    dispatch(load(true));
    
    return res;
  } catch (err) {
    dispatch({ type: LOGIN_FAIL, error: err.message });
  }
};

export const logout = () => (dispatch, getState, api) => {
  store.remove('authToken');
  store.remove('refreshToken');
  
  dispatch({ type: LOGOUT });
  dispatch({ type: 'FLUSH' });
  
  dispatch(push('/'));
};