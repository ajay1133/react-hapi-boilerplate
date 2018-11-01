import Immutable from 'immutable';
import orderBy from 'lodash/orderBy';

const LOAD = 'account/LOAD';
const LOAD_SUCCESS = 'account/LOAD_SUCCESS';
const LOAD_FAIL = 'account/LOAD_FAIL';

const SAVE_ACCOUNT = 'account/SAVE_ACCOUNT';
const SAVE_ACCOUNT_SUCCESS = 'account/SAVE_ACCOUNT_SUCCESS';
const SAVE_ACCOUNT_FAIL = 'account/SAVE_ACCOUNT_FAIL';

const VERIFY_TOKEN = 'account/VERIFY_TOKEN';
const VERIFY_TOKEN_SUCCESS = 'account/VERIFY_TOKEN_SUCCESS';
const VERIFY_TOKEN_FAIL = 'account/VERIFY_TOKEN_FAIL';

const UPDATE_PASSWORD = 'account/UPDATE_PASSWORD';
const UPDATE_PASSWORD_SUCCESS = 'account/UPDATE_PASSWORD_SUCCESS';
const UPDATE_PASSWORD_FAIL = 'account/UPDATE_PASSWORD_FAIL';

const SELECT_USER = 'account/SELECT_USER';

const initialState = Immutable.fromJS({
  isLoad: false,
  loadErr: null,
  loading: false,
  items: [],
  itemsCount: 0,
  columns: [],
  sort: {by: '', dir: 'asc'},
  selectedUser: undefined
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
        .set('loadErr', null)
        .set('items', action.items)
        .set('itemsCount', action.count);

    case LOAD_FAIL:
      return state
        .set('isLoad', false)
        .set('loadErr', action.error)
        .set('items', null);

    case SAVE_ACCOUNT:
      return state
        .set('savingAccount', true)
        .set('saveAccountErr', null);

    case SAVE_ACCOUNT_SUCCESS: {
      if (action.users) {
        return state
        .set('savingAccount', false)
        .set('saveAccountErr', null)
        .set('items', action.users)  
      }
      return state
        .set('savingAccount', false)
        .set('saveAccountErr', null)
    }    

    case SAVE_ACCOUNT_FAIL:
      return state
        .set('savingAccount', false)
        .set('saveAccountErr', action.err );  

    case VERIFY_TOKEN:
      return state
        .set('tokenValid', false)
        .set('confirmationErr', null);

    case VERIFY_TOKEN_SUCCESS:
      return state
        .set('tokenValid', action.res.tokenValid )
        .set('confirmationErr', null);

    case VERIFY_TOKEN_FAIL:
      return state
        .set('tokenValid', false)
        .set('confirmationErr', action.error );  


    case UPDATE_PASSWORD:
      return state
        .set('updatingPassword', true)
        .set('passwordUpdated', false)
        .set('confirmationErr', null);
  
    case UPDATE_PASSWORD_SUCCESS:
      return state
        .set('updatingPassword', false)
        .set('passwordUpdated', true)
        .set('confirmationErr', null);

    case UPDATE_PASSWORD_FAIL:
      return state
        .set('updatingPassword', false)
        .set('passwordUpdated', false)
        .set('confirmationErr', action.error );      
        
    case SELECT_USER: 
      return state
        .set('selectedUser', action.user)    

    default:
      return state;
  }
}


export const loadAccounts = () => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  try {
    const res = await api.get('/account/all');
    if (res.message) {
      dispatch({ type: LOAD_FAIL, error: res.message });
      return;
    }
    let sortedList = orderBy(res.rows,['firstName'], ['asc']);
    sortedList.forEach((list, index) => {
      let events = orderBy(list.events, ['event_participants.updatedAt'], ['desc']);
      sortedList[index].events = events;
    });
    dispatch({ type: LOAD_SUCCESS, items: sortedList, count: res.count });
    return sortedList;
  } catch (error) {
    let errorMessage = error.message;
    if (error.statusCode === 403) {
      errorMessage = "You are not authorized to access this page";
    }
    dispatch({ type: LOAD_FAIL, error: errorMessage });
  }
};

export const saveAccount = (accountDetails) => async (dispatch, getState, api) => {
  dispatch({ type: SAVE_ACCOUNT });
  try {
    if (accountDetails.id) {
      let users = getState().get('account').get('items');
      let index = users.findIndex((user) => user.id === accountDetails.id)
      if (accountDetails.isDeleted) {
        users.splice(index, 1);
      } else {
        let selectedUser = users[index];
        selectedUser.firstName = accountDetails.firstName;
        selectedUser.lastName =accountDetails.lastName;
        selectedUser.email = accountDetails.email;
        users.splice(index, 1, selectedUser)
      }
      await api.put('/account', { data: accountDetails });
      dispatch(loadAccounts());
      dispatch({ type: SAVE_ACCOUNT_SUCCESS, users });
    } else {
      await api.post('/account', { data: accountDetails });
      dispatch(loadAccounts());
      dispatch({ type: SAVE_ACCOUNT_SUCCESS });
    }
   return accountDetails;
  } catch (err) {
    dispatch({ type: SAVE_ACCOUNT_FAIL, error: err.message });
    return err;
  }
};

export const verifyToken = (inviteToken) => async (dispatch, getState, api) => {
  dispatch({ type: VERIFY_TOKEN });
  try {
    let res = await api.post('/account/verify/token', { data: {inviteToken} });
    dispatch({ type: VERIFY_TOKEN_SUCCESS, res: res });
    return res;
  } catch (err) {
    dispatch({ type: VERIFY_TOKEN_FAIL, error: err.message });
  }
};

export const updatePassword = (accountDetails) => async (dispatch, getState, api) => {
  console.log(updatePassword);
  dispatch({ type: UPDATE_PASSWORD });
  try {
    let res = await api.put('/account/update/password', { data: accountDetails });
    dispatch({ type: UPDATE_PASSWORD_SUCCESS });
    return res;
  } catch (err) {
    dispatch({ type: UPDATE_PASSWORD_FAIL, error: err.message });
  }
};

export const sortAccounts = (sortDir, sortCol) => async (dispatch, getState, api) => {  
  const items = getState().get('account').get('items');
  const sortedList = orderBy(items,[`${sortCol}`],[`${sortDir}`]);
  dispatch({ type: LOAD_SUCCESS, items: sortedList, count: sortedList.length });
}

export const selectUser = (user) => async (dispatch) => {
  dispatch( { type: SELECT_USER, user });
}