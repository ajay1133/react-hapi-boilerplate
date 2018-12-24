import Immutable from 'immutable';
import orderBy from 'lodash/orderBy';
import { load } from './auth';
import { updateBitBucketFile, deleteBitBucketFile } from './bitBucketRepo';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidArrayWithLength,
	getAbsoluteS3FileUrl,
	strictValidString,
	validObjectWithParameterKeys
} from '../../utils/commonutils';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
	MD_FILE_META_DATA_KEYS,
	KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS
} from '../../utils/constants';

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

const LOAD_USER_PROFILE_RELATED_DATA = 'account/LOAD_USER_PROFILE_RELATED_DATA';

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
  userServices: [],
	genderTypes: [],
	userDetails: {},
	userGenderGroups: [],
	ageTypes: [],
	userAgeGroups: [],
	treatmentFocusTypes: [],
	userTreatmentFocusGroups: []
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
	
    case LOAD_USER_PROFILE_RELATED_DATA:
      return state
        .set('serviceTypes', action.serviceTypes)
        .set('userServices', action.userServices)
        .set('genderTypes', action.genderTypes)
        .set('userGenderGroups', action.userGenderGroups)
        .set('ageTypes', action.ageTypes)
        .set('userAgeGroups', action.userAgeGroups)
        .set('treatmentFocusTypes', action.treatmentFocusTypes)
        .set('userTreatmentFocusGroups', action.userTreatmentFocusGroups)
        .set('userDetails', action.userDetails);
      
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
    
    if (validObjectWithParameterKeys(res, ['message'])) {
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
	  accountDetails.status = 2;
    const res = await api.post('/account', { data: accountDetails });
    
    if (validObjectWithParameterKeys(res, ['id'])) {
	    await dispatch(internals.updateBitBucketFile(res, 1));
	    dispatch(loadAccounts());
	    dispatch({ type: ACCOUNT_SUCCESS, message: 'Added Successfully !!' });
	    dispatch(internals.resetMessage());
    }
	  
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
      users = users.filter(user => user.id !== id);
      
      // Delete file on BitBucket
      const deleteFileData = {
        files: `/content/profile/${(id).trim()}.md`
      };
      
      deleteFileData.message = `Deleted: ${deleteFileData.files}`;
      await dispatch(deleteBitBucketFile(deleteFileData));
    } else {
      users.map((user) => {
        if (user.id === id) {
          Object.assign(user, accountDetails);
        }
        return user;
      });
      
      if (accountDetails.status === 1) {
        accountDetails.active = true;
      }
	
	    await dispatch(internals.updateBitBucketFile(Object.assign({ id }, accountDetails), 2));
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
			const fileContentObj = Object.assign({ active: true }, formData.profileDetails, { id });
			await dispatch(internals.updateBitBucketFile(fileContentObj, 2));
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
			
			const toUpdateBitBucketFlag = strictValidArrayWithLength(toAddServicesList) ||
				strictValidArrayWithLength(toDeleteServicesList);
			
			if (strictValidArrayWithLength(toAddServicesList)) {
				await api.post(`/services`, { data: { usersId: id, services: toAddServicesList } });
			}
			if (strictValidArrayWithLength(toDeleteServicesList)) {
				await api.post(`/services/delete`, { data: { serviceIds: toDeleteServicesList } });
			}
			
			if (toUpdateBitBucketFlag) {
				const fileContentObj = Object.assign({ active: true }, { id }, formData.userServices);
				await dispatch(internals.updateBitBucketFile(fileContentObj, 2));
			}
		} else if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.password)) {
		  const updatePasswordObj = {
		    email,
        password: formData.password.password
      };
		  
			await dispatch(updatePassword(updatePasswordObj, true));
			await dispatch(load(true));
		}
		
		if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.otherDetails)) {
			await Promise.all(Object.keys(formData.otherDetails).map(detail =>
				dispatch(internals.addAndDeleteMultipleTypes(formData.otherDetails[detail], detail))
			));
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

export const loadUserProfileRelatedData = () => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	try {
	  const { id } = getState().get('auth').get('user');
	  
	  const serviceTypes = await api.get(`/serviceTypes`);
		const userServices = await api.get(`/services/byUser/${id}`);
		const genderTypes = await api.get(`/genderTypes`);
		const userGenderGroups = await api.get(`/genderGroup/byUser/${id}`);
		const ageTypes = await api.get(`/ageTypes`);
		const userAgeGroups = await api.get(`/ageGroup/byUser/${id}`);
		const treatmentFocusTypes = await api.get(`/treatmentFocusTypes`);
		const userTreatmentFocusGroups = await api.get(`/treatmentFocusGroup/byUser/${id}`);
		
		dispatch({ type: LOAD_SUCCESS });
		
		const userDetailsObj = {
			serviceTypes: (strictValidObjectWithKeys(serviceTypes) && serviceTypes.rows) || [],
			userServices: (strictValidObjectWithKeys(userServices) && userServices.rows) || [],
			genderTypes: (strictValidObjectWithKeys(genderTypes) && genderTypes.rows) || [],
			userGenderGroups: (strictValidObjectWithKeys(userGenderGroups) && userGenderGroups.rows) || [],
			ageTypes: (strictValidObjectWithKeys(ageTypes) && ageTypes.rows) || [],
			userAgeGroups: (strictValidObjectWithKeys(userAgeGroups) && userAgeGroups.rows) || [],
			treatmentFocusTypes: (strictValidObjectWithKeys(treatmentFocusTypes) && treatmentFocusTypes.rows) || [],
			userTreatmentFocusGroups:
			  (strictValidObjectWithKeys(userTreatmentFocusGroups) && userTreatmentFocusGroups.rows) || []
		};
		
		const serviceType = [];
		
		userDetailsObj.userServices.forEach(service => {
			const indexOfServiceType = service.serviceTypesId - 1;
			if (!(indexOfServiceType in serviceType)) {
				serviceType[indexOfServiceType] = [];
			}
			serviceType[indexOfServiceType].push(service.name);
		});
		
		const genderType = userDetailsObj.genderTypes
			.map(v => !!userDetailsObj.userGenderGroups.filter(g => v.status && g.gendertypeId === v.id).length);
		const ageType = userDetailsObj.ageTypes
			.map(v => !!userDetailsObj.userAgeGroups.filter(g => v.status && g.agetypeId === v.id).length);
		const treatmentFocusType = userDetailsObj.treatmentFocusTypes
			.map(v =>
				!!userDetailsObj.userTreatmentFocusGroups.filter(g => v.status && g.treatmentfocustypeId === v.id).length
			);
		
		userDetailsObj.userDetails = Object.assign({}, {
			serviceType: [],
			genderType,
			ageType,
			treatmentFocusType
		});
		
		dispatch(Object.assign({}, { type: LOAD_USER_PROFILE_RELATED_DATA }, userDetailsObj));
		return { serviceType };
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

internals.updateBitBucketFile = (fileContentObj, type) => async (dispatch) => {
	if (fileContentObj.image) {
		fileContentObj.image = getAbsoluteS3FileUrl(fileContentObj.image);
	}
	
	const mdFileData = await dispatch(internals.getFileContent(fileContentObj));
	let updateFileData = Object.assign({}, mdFileData, { type });
	updateFileData.message = `Updated: ${updateFileData.path}`;
	
	await dispatch(updateBitBucketFile(updateFileData));
};

internals.getFileContent = (fileContentObj) => async (dispatch, getState) => {
	let path = null;
	let content = '';
	
	if (validObjectWithParameterKeys(fileContentObj, ['id'])) {
		const serviceTypes = getState().get('account').get('serviceTypes');
		const { id, serviceType = [] } = fileContentObj;
		path = `/content/profile/${id}.md`;
		
		const extraMetaDataKeys = Object.keys(fileContentObj)
			.filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) <= -1 && KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS.indexOf(k) <= -1);
		const validMetaDataKeys = Object.keys(fileContentObj).filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) > -1);
		
		content = '---\n';
		
		validMetaDataKeys.forEach(k => {
			content += internals.addKeyValuePairAsString(k, fileContentObj[k], '\n');
		});
		
		extraMetaDataKeys.forEach(k => {
			content += internals.addKeyValuePairAsString(k, fileContentObj[k], '\n');
		});
		
		content += '---\n';
		
		if (strictValidArrayWithLength(serviceType)) {
			serviceType.forEach((serviceValuesList, idx) => {
				content += `- ##### ${serviceTypes[idx].name.toUpperCase()}\n`;
				serviceValuesList.forEach(serviceValue => {
					content += `\n* ${serviceValue}`;
					content += '\n>\n';
				})
			});
		}
	}
	
	return {
		path,
		content
	};
};

internals.addKeyValuePairAsString = (k, v, append) => {
	let str = '';
	
	if (!!v) {
		if (['string', 'number', 'boolean'].indexOf(typeof v) > - 1) {
			str = `${k} : ${v.toString()}`;
			str += append ? `${append}` : '';
		} else if (strictValidArrayWithLength(v)) {
			str = `${k} : [${v.join(', ')}]`;
		} else {
			str = `${k} : [${JSON.stringify(v)}]`;
		}
	} else {
		str = `${k} : `;
	}
	
	str += append ? `${append}` : '';
	return str;
};

internals.addAndDeleteMultipleTypes = (formTypeValuesList, type) => async (dispatch, getState, api) => {
	try {
	  const addList = [];
	  const deleteList = [];
	  const { id } = getState().get('auth').get('user') || {};
		const typesList = getState().get('account').get(`${type}s`) || [];
		const isValidDataFlag = strictValidString(type) && strictValidArrayWithLength(typesList);
		
		if (isValidDataFlag) {
			const currentTypeValuesList = getState().get('account').get('userDetails')[type] || [];
			const urlFragment = type.substr(0, type.length - 4) + 'Group';
			
			formTypeValuesList.forEach((formTypeValue, idx) => {
				const typeId = (strictValidObjectWithKeys(typesList[idx]) && typesList[idx].id) || -1;
				if (typeId >= -1) {
					if (formTypeValue && !currentTypeValuesList[idx]) {
						addList.push(typeId);
					} else if (!formTypeValue && currentTypeValuesList[idx]) {
						deleteList.push(typeId);
					}
				}
			});
			
			if (strictValidArrayWithLength(addList)) {
				await api.post(`/${urlFragment}`, { data: { userId: id, ids: addList } });
			}
			if (strictValidArrayWithLength(deleteList)) {
				await api.post(`/${urlFragment}/delete`, { data: { ids: deleteList } });
			}
			
			return true;
		}
	} catch (err) {
		console.log(err);
		return false;
	}
};