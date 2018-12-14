import Immutable from 'immutable';
import orderBy from 'lodash/orderBy';
import { load } from './auth';
import { updateBitBucketFile, deleteBitBucketFile } from './bitBucketRepo';
import { strictValidObjectWithKeys, typeCastToString, strictValidArrayWithLength } from '../../utils/commonutils';
import { DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';

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

const UPDATED_PROFILE = 'account/UPDATED_PROFILE';
const SELECT_USER = 'account/SELECT_USER';

const LOAD_USER_SERVICES = 'account/LOAD_USER_SERVICES';

const RESET_MESSAGE = 'account/RESET_MESSAGE';
const FLUSH = 'account/FLUSH';

const initialState = Immutable.fromJS({
  isLoad: false,
  loadErr: null,
  loading: false,
  items: [],
  itemsCount: 0,
  columns: [],
  sort: {by: '', dir: 'asc'},
  selectedUser: undefined,
	accountMsg: null,
	passwordUpdated: false,
	passwordUpdatedMsg: null,
  serviceTypes: [],
  userServices: []
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
        .set('items', action.items || state.items)
        .set('itemsCount', action.count || state.itemsCount);

    case LOAD_FAIL:
      return state
        .set('isLoad', false)
        .set('loadErr', typeCastToString(action.error))
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
        .set('accountMsg', typeCastToString(action.message))
      }
      return state
        .set('account', false)
        .set('accountErr', null)
        .set('accountMsg', typeCastToString(action.message))
    }

    case ACCOUNT_FAIL:
      return state
        .set('account', false)
        .set('accountErr', typeCastToString(action.error))
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
        .set('confirmationErr', typeCastToString(action.error));
    
    case UPDATE_PASSWORD:
      return state
        .set('updatingPassword', true)
        .set('passwordUpdated', false)
        .set('confirmationErr', null);
  
    case UPDATE_PASSWORD_SUCCESS:
      return state
        .set('updatingPassword', false)
        .set('passwordUpdated', true)
        .set('passwordUpdatedMsg', 'Please login using your new password')
        .set('confirmationErr', null);

    case UPDATE_PASSWORD_FAIL:
      return state
        .set('updatingPassword', false)
        .set('passwordUpdated', false)
        .set('confirmationErr', typeCastToString(action.error));
        
    case SELECT_USER:
      return state
        .set('selectedUser', action.user);
      
    case UPDATED_PROFILE:
      return state
        .set('accountMsg', action.message);
	
    case LOAD_USER_SERVICES:
      return state
        .set('serviceTypes', action.serviceTypes)
        .set('userServices', action.userServices);
      
	  case RESET_MESSAGE:
		  return state
			  .set('accountMsg', null)
			  .set('passwordUpdatedMsg', null)
			  .set('loadErr', null)
			  .set('confirmationErr', null)
			  .set('accountErr', null);
	
	  case FLUSH: {
		  return initialState;
	  }
	  
    default:
      return state;
  }
}

export const loadAccounts = (params) => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  
  try {
    const res = await api.get('/account/all', { params });
    
    if (strictValidObjectWithKeys(res) && res.message) {
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
    let errorMessage = error.message || typeCastToString(error);
    
    if (strictValidObjectWithKeys(error) && error.statusCode === 403) {
      errorMessage = "You are not authorized to access this page";
    }
    
    dispatch({ type: LOAD_FAIL, error: errorMessage });
	  dispatch(internals.resetMessage());
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
	  accountDetails.status = 2;
    
    await api.post('/account', { data: accountDetails });
    dispatch(loadAccounts());
    dispatch({ type: ACCOUNT_SUCCESS, message: 'Added Successfully !!' });
	  dispatch(internals.resetMessage());
	  
    return accountDetails;
  } catch (err) {
    dispatch({ type: ACCOUNT_FAIL, error: err.message || typeCastToString(err) });
	  dispatch(internals.resetMessage());
  }
};

/**
 * updateAccount: used to update account details
 * @param accountDetails
 * @param isAllow
 */
export const updateAccount = (accountDetails) => async (dispatch, getState, api) => {
  dispatch({ type: ACCOUNT });
  
  try {
	  let users = getState().get('account').get('items');
    const { id } = accountDetails;
    
    delete accountDetails.id;
    
    if (accountDetails.isDeleted) {
      users.filter((user) => {
        return user.id !== id;
      });
      
      // Delete file on BitBucket
      const { firstName, lastName } = accountDetails;
      const deleteFileData = {
        files: `/content/profile/${(firstName+lastName).trim()}.md`
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
            user.email = accountDetails.email;
            user.phone = accountDetails.phone;
            user.url = accountDetails.url;
            user.description = accountDetails.description;
            user.image = accountDetails.image;
            user.featuredVideo = accountDetails.featuredVideo;
            user.status = accountDetails.status;
        }
        return user;
      });
      
      if (accountDetails.status === 1) {
        accountDetails.active = true;
      }
      
      let updateFileData = Object.assign({}, internals.getFileContent(accountDetails), { type: 2 });
      updateFileData.message = `Updated: ${updateFileData.path}`;
      
      await dispatch(updateBitBucketFile(updateFileData));
    }
    
    delete accountDetails.active;
    await api.put(`/account/${id}`, { data: accountDetails });
    
    dispatch(loadAccounts());
    dispatch({ type: ACCOUNT_SUCCESS, users, message: 'Updated Successfully !!' });
	  dispatch(internals.resetMessage());
   
    return accountDetails;
  } catch (err) {
    dispatch({ type: ACCOUNT_FAIL, error: err.message || typeCastToString(err) });
	  dispatch(internals.resetMessage());
  }
};

export const updateUserProfile = (formData) => async (dispatch, getState, api) => {
	dispatch({ type: ACCOUNT });
	
	try {
		const { id, email } = getState().get('auth').get('user');
		const userServices = getState().get('account').get('userServices');
		const serviceTypes = getState().get('account').get('serviceTypes');
		
		if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.profileDetails)) {
			formData.profileDetails.active = true;
			
			let updateFileData = Object.assign({}, internals.getFileContent(formData.profileDetails), { type: 2 });
			updateFileData.message = `Updated: ${updateFileData.path}`;
			
			await dispatch(updateBitBucketFile(updateFileData));
			delete formData.profileDetails.active;
			
			await api.put(`/account/${id}`, { data: formData.profileDetails });
			await dispatch(load(true));
    } else if (strictValidObjectWithKeys(formData) && strictValidArrayWithLength(formData.userServices)) {
			const toAddServicesList = [];
			const toDeleteServicesList = [];
			
			formData.userServices.forEach((serviceList, indexOfServiceType) => {
				const serviceTypesId = serviceTypes[indexOfServiceType].id;
				
				serviceList.forEach(service => {
					let isPresentFlag = false;
					userServices.forEach(serviceType => {
						if (serviceType.name === service && serviceType.serviceTypesId === serviceTypesId) {
							isPresentFlag = true;
						}
					});
					if (!isPresentFlag) {
						toAddServicesList.push({
							service,
							serviceTypesId
						});
					}
				});
			});
			
			userServices.forEach(service => {
				let indexOfServiceType = -1;
				
				serviceTypes.forEach((serviceType, idx) => {
					if (serviceType.id === service.serviceTypesId) {
						indexOfServiceType = idx;
					}
				});
				
				if (formData.userServices[indexOfServiceType].indexOf(service.name) <= -1) {
					toDeleteServicesList.push(service.id);
				}
			});
			
			if (strictValidArrayWithLength(toAddServicesList)) {
				await api.post(`/services`, { data: { usersId: id, services: toAddServicesList } });
			}
			if (strictValidArrayWithLength(toDeleteServicesList)) {
				await api.post(`/services/delete`, { data: { serviceIds: toDeleteServicesList } });
			}
		} else if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.password)) {
		  const updatePasswordObj = {
		    email,
        password: formData.password.password
      };
		  
			await dispatch(updatePassword(updatePasswordObj, true));
			await dispatch(load(true));
		}
  
		dispatch({ type: LOAD_SUCCESS });
		dispatch({ type: UPDATED_PROFILE, message: 'Updated Successfully !!' });
		dispatch(internals.resetMessage());
	} catch (err) {
		dispatch({ type: ACCOUNT_FAIL, error: err.message || typeCastToString(err) });
		dispatch(internals.resetMessage());
	}
};

export const verifyToken = (inviteToken) => async (dispatch, getState, api) => {
  dispatch({ type: VERIFY_TOKEN });
  
  try {
    let res = await api.post('/account/verify/token', { data: {inviteToken} });
    dispatch({ type: VERIFY_TOKEN_SUCCESS, res: res });
    return res;
  } catch (err) {
    dispatch({ type: VERIFY_TOKEN_FAIL, error: err.message || typeCastToString(err) });
  }
};

export const updatePassword = (accountDetails, withoutTokenFlag = false) => async (dispatch, getState, api) => {
  dispatch({ type: UPDATE_PASSWORD });
  
  try {
    const putUrl = !withoutTokenFlag ? '/account/update/password' : '/account/update/passwordWithoutToken';
    let res = await api.put(putUrl, { data: accountDetails });
    dispatch({ type: UPDATE_PASSWORD_SUCCESS });
    return res;
  } catch (err) {
    dispatch({ type: UPDATE_PASSWORD_FAIL, error: err.message || typeCastToString(err) });
	  dispatch(internals.resetMessage());
  }
};

export const loadUserServices = () => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	try {
	  const { id } = getState().get('auth').get('user');
	  let serviceTypes = await api.get(`/serviceTypes`);
		let userServices = await api.get(`/services/byUser/${id}`);
		dispatch({ type: LOAD_SUCCESS });
		dispatch({
      type: LOAD_USER_SERVICES,
      serviceTypes: (strictValidObjectWithKeys(serviceTypes) && serviceTypes.rows) || [],
			userServices: (strictValidObjectWithKeys(userServices) && userServices.rows) || []
		});
		return {
			serviceTypes: (strictValidObjectWithKeys(serviceTypes) && serviceTypes.rows) || [],
			userServices: (strictValidObjectWithKeys(userServices) && userServices.rows) || []
		};
  } catch (error) {
		dispatch({ type: LOAD_FAIL, error });
		dispatch(internals.resetMessage());
  }
};

export const sortAccounts = (sortDir, sortCol) => async (dispatch, getState, api) => {
  const items = getState().get('account').get('items');
  const sortedList = orderBy(items,[`${sortCol}`],[`${sortDir}`]);
  
  dispatch({ type: LOAD_SUCCESS, items: sortedList, count: sortedList.length });
};

export const selectUser = (user) => async (dispatch) => {
  dispatch({ type: SELECT_USER, user });
};

export const flush = () => async (dispatch) => {
  dispatch({ type: FLUSH });
};

internals.resetMessage = (defaultTimeout = DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES) => {
	return dispatch => setTimeout(() => {
		dispatch({ type: RESET_MESSAGE });
	}, defaultTimeout || DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
};

internals.getFileContent = (accountDetails) => {
  const {
    firstName = '',
    lastName = '',
    title = '',
    image = '',
    featuredVideo = '',
    phone = '',
    address = '',
    active = false,
    description = '',
    services = []
  } = accountDetails;
  
  const { treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr } = services;
  const path = `/content/profile/${(firstName+lastName).trim()}.md`;
  
  let content = `---
title: "${title}"
featured_video: "${featuredVideo}"
image: ${image}
contact: ${phone}
address: "${address}"
active: ${active}
description: "${description}"
---


`;
  if (treatmentTypeArr) {
    content += '- ##### TREATMENT TYPE\n';
    treatmentTypeArr.map((val) => content += `\n* ${val}`);
    content += `

>

`;
  }
  
  if (typeOfServicesArr) {
    content += '- ##### TYPE OF SERVICES\n';
    typeOfServicesArr.map((val) => content += `\n* ${val}`);
    content += `

>

`;
  }
  
  if (levelOfCareArr) {
    content += '- ##### LEVEL OF CARE\n';
    levelOfCareArr.map((val) => content += `\n* ${val}`);
    content += `

>

`;
  }
  
  if (treatmentFocusArr) {
    content += '- ##### TREATMENT FOCUS\n';
    treatmentFocusArr.map((val) => content += `\n* ${val}`);
    content += `

>

`;
  }
  
  content += '<div class="row w100">' +
             '<h5 class="w100">TREATMENT FOCUS</h5>' +
              '<div class="clearfix"></div>' +
                '<p>Self Pay fee,  Financing Available,Private Insurance ,  State Financial Aid,Scholarships </p>' +
              '</div>';
  
  return { path, content } ;
};