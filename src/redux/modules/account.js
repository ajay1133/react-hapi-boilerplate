import Immutable from 'immutable';
import orderBy from 'lodash/orderBy';
import { updateBitBucketFile, deleteBitBucketFile } from './bitBucketRepo';

const LOAD = 'account/LOAD';
const LOAD_SUCCESS = 'account/LOAD_SUCCESS';
const LOAD_FAIL = 'account/LOAD_FAIL';

const ACCOUNT = 'account/ACCOUNT';
const ACCOUNT_SUCCESS = 'account/ACCOUNT_SUCCESS';
const ACCOUNT_FAIL = 'account/ACCOUNT_FAIL';

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

const internals = {};

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

    case ACCOUNT:
      return state
        .set('account', true)
        .set('accountErr', null)
        .set('accountMsg', null);

    case ACCOUNT_SUCCESS: {
      if (action.users) {
        return state
        .set('account', false)
        .set('accountErr', null)
        .set('items', action.users)
        .set('accountMsg', action.message || null)
      }
      return state
        .set('account', false)
        .set('accountErr', null)
        .set('accountMsg', action.message || null)
    }

    case ACCOUNT_FAIL:
      return state
        .set('account', false)
        .set('accountErr', action.error )
        .set('accountMsg', null);

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
        .set('selectedUser', action.user);

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

/**
 * saveAccount: used to add account details
 * @param accountDetails
 */
export const saveAccount = (accountDetails) => async (dispatch, getState, api) => {
  dispatch({ type: ACCOUNT });
  
  try {
    let addFileData = Object.assign({}, internals.getFileContent(accountDetails), { type: 1 });
    addFileData.message = `Added: ${addFileData.path}`;
    await dispatch(updateBitBucketFile(addFileData));
    await api.post('/account', { data: accountDetails });
    dispatch(loadAccounts());
    dispatch({ type: ACCOUNT_SUCCESS, message: 'Added Successfully !!'});
   return accountDetails;
  } catch (err) {
    dispatch({ type: ACCOUNT_FAIL, error: err.message });
  }
};

/**
 * updateAccount: used to update account details
 * @param accountDetails
 * @param isAllow
 */
export const updateAccount = (accountDetails, isAllow) => async (dispatch, getState, api) => {
  dispatch({ type: ACCOUNT });
  let users = getState().get('account').get('items');
  
  try {
    const { id } = accountDetails;
    delete accountDetails.id;
    if (accountDetails.isDeleted) {
      users.filter((user) => {
        return user.id !== id;
      });
      // Delete file on Bitbucket
      const { firstName, lastName } = accountDetails;
      const deleteFileData = {
        files: `/content/profile/${firstName+lastName}.md`
      };
      deleteFileData.message = `Deleted: ${deleteFileData.files}`;
      await dispatch(deleteBitBucketFile(deleteFileData));
    } else {
      users.map((user) => {
        if (user.id === id) {
          Object.assign(user, accountDetails);
            user.title = accountDetails.title;
            user.firstName = accountDetails.firstName;
            user.lastName = accountDetails.lastName;
            user.address = accountDetails.address;
            user.email = accountDetails.email;
            user.phone = accountDetails.phone;
            user.url = accountDetails.url;
            user.description = accountDetails.description;
            user.image = accountDetails.image;
            user.status = accountDetails.status;
        }
        return user;
      });
      if (isAllow) {
        // Update file on Bitbucket
        let updateFileData = Object.assign({}, internals.getFileContent(accountDetails), { type: 2 });
        updateFileData.message = `Updated: ${updateFileData.path}`;
        await dispatch(updateBitBucketFile(updateFileData));
      }
    }
    await api.put(`/account/${id}`, { data: accountDetails });
    dispatch(loadAccounts());
    dispatch({ type: ACCOUNT_SUCCESS, users, message: 'Updated Successfully !!' });
   return accountDetails;
  } catch (err) {
    dispatch({ type: ACCOUNT_FAIL, error: err.message });
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
};

export const selectUser = (user) => async (dispatch) => {
  dispatch( { type: SELECT_USER, user });
};

internals.getFileContent = (accountDetails) => {
  const { firstName, lastName, title, image, phone, address, description } = accountDetails;
  const path = `/content/profile/${firstName+lastName}.md`;
  
  let content = `---
title: "${title}"
featured_image: ''
image: ${image}
contact: ${phone}
address: "${address}"
draft: false
---


`;
  content += description;
  return { path, content } ;
};