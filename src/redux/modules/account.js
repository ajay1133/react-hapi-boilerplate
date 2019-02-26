import Immutable from 'immutable';
import { updateBitBucketFile, bitBucketView } from './bitBucketRepo';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidArrayWithLength,
	getAbsoluteS3FileUrl,
	strictValidString,
	validObjectWithParameterKeys,
	strictValidArrayWithMinLength,
	addKeyValuePairAsString
} from '../../utils/commonutils';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
	MD_FILE_META_DATA_KEYS,
	KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS,
	USER_PROFILE_PATH,
	PROFILE_ROOT_PATH,
	PROFILE_MD_META_INITIAL_VALUES,
	DEFAULT_USER_PROFILE_IMAGE_URL,
	OFFSET,
	USER_SERVICES_LIST,
	RELATIONAL_MAPPING_INFO_LIST
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
	itemsFilters: {
  	status: '',
		keyword: '',
		page: 1,
		limit: OFFSET,
		order: [['firstName', 'ASC']]
	},
  columns: [],
  selectedUser: {},
	accountMsg: null,
	passwordUpdated: false,
	passwordUpdatedMsg: null,
  serviceTypes: [],
  userServiceGroups: [],
	userDetails: {},
	ageTypes: [],
	userAgeGroups: [],
	genderTypes: [],
	userGenderGroups: [],
	treatmentFocusTypes: [],
	userTreatmentFocusGroups: [],
	paymentTypes: [],
	userPaymentGroups: [],
	accreditationTypes: [],
	userAccreditationGroups: [],
	smokingPolicyTypes: [],
	userSmokingPolicyGroups: [],
	languageTypes: [],
	userLanguageGroups: []
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
        .set('itemsCount', action.count || state.itemsCount)
	      .set('itemsFilters',
		      (strictValidObjectWithKeys(action.itemsFilters) && action.itemsFilters) || state.itemsFilters);

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
        .set('selectedUser', (strictValidObjectWithKeys(action.selectedUser) && action.selectedUser) || {})
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
        .set('confirmationErr', action.res.tokenValid ? null : 'Invalid Token');

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
        .set('selectedUser', (strictValidObjectWithKeys(action.user) && action.user) || {});
      
    case UPDATED_PROFILE:
      return state
        .set('accountMsg', action.message);
	
    case LOAD_USER_PROFILE_RELATED_DATA:
      return state
        .set('serviceTypes', action.serviceTypes)
        .set('userServiceGroups', action.userServiceGroups)
        .set('genderTypes', action.genderTypes)
        .set('userGenderGroups', action.userGenderGroups)
        .set('ageTypes', action.ageTypes)
        .set('userAgeGroups', action.userAgeGroups)
        .set('treatmentFocusTypes', action.treatmentFocusTypes)
        .set('userTreatmentFocusGroups', action.userTreatmentFocusGroups)
        .set('paymentTypes', action.paymentTypes)
        .set('userPaymentGroups', action.userPaymentGroups)
        .set('accreditationTypes', action.accreditationTypes)
        .set('userAccreditationGroups', action.userAccreditationGroups)
        .set('smokingPolicyTypes', action.smokingPolicyTypes)
        .set('userSmokingPolicyGroups', action.userSmokingPolicyGroups)
        .set('languageTypes', action.languageTypes)
        .set('userLanguageGroups', action.userLanguageGroups)
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

export const loadAccounts = (filters) => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  
  try {
  	const itemsFilters = (strictValidObjectWithKeys(filters) && filters) ||
		  getState().get('account').get('itemsFilters');
  	if (strictValidArrayWithLength(itemsFilters.order)) {
  	  itemsFilters.order = JSON.stringify(itemsFilters.order);
	  }
    const res = await api.get('/account/all', { params: itemsFilters });
    
    if (validObjectWithParameterKeys(res, ['message'])) {
      dispatch({ type: LOAD_FAIL, error: res.message });
      return;
    }
	
	  if (validObjectWithParameterKeys(res, ['rows', 'count'])) {
		  if (itemsFilters.order) {
			  itemsFilters.order = JSON.parse(itemsFilters.order);
		  }
		  dispatch({
			  type: LOAD_SUCCESS,
			  items: res.rows,
			  count: res.count,
			  itemsFilters
		  });
		  return res.rows;
	  }
	  return getState().get('account').get('items');
  } catch (error) {
    let errorMessage = error.message || typeCastToString(error);
    if (validObjectWithParameterKeys(error, ['statusCode']) && error.statusCode === 403) {
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
    
    if (validObjectWithParameterKeys(res, ['id', 'status'])) {
	    await dispatch(internals.updateBitBucketFile(Object.assign(
	    	{},
		    res,
		    { active: res.status === 1 ? 'true' : 'false' }),
		    1
	    ));
	    dispatch(loadAccounts());
	    dispatch({ type: ACCOUNT_SUCCESS, message: 'Added Successfully' });
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
 */
export const updateAccount = (accountDetails) => async (dispatch, getState, api) => {
  dispatch({ type: ACCOUNT });
  
  try {
	  let users = getState().get('account').get('items');
	  let selectedUser = {};
    const { id } = accountDetails;
    
    delete accountDetails.id;
    
    if (accountDetails.isDeleted) {
    	//Make the status = 3, same as of denied
      users = users.filter(user => user.id !== id);
	    selectedUser = strictValidArrayWithLength(users.filter(user => user.id === id)) &&
		    users.filter(user => user.id === id)[0];
	    if (accountDetails.status === 3) {
		    accountDetails.active = false;
	    }
	    await dispatch(internals.updateBitBucketFile(Object.assign(selectedUser, accountDetails), 2));
    } else {
      users = users.map((user) => {
        if (user.id === id) {
          Object.assign(user, accountDetails);
        }
        return user;
      });
      selectedUser = strictValidArrayWithLength(users.filter(user => user.id === id)) &&
	      users.filter(user => user.id === id)[0];
      if (accountDetails.status === 1) {
        accountDetails.active = true;
      }
	    await dispatch(internals.updateBitBucketFile(Object.assign(selectedUser, accountDetails), 2));
    }
    
    delete accountDetails.active;
    await api.put(`/account/${id}`, { data: accountDetails });
    
    dispatch(loadAccounts());
    dispatch({
	    type: ACCOUNT_SUCCESS,
	    users,
	    selectedUser: !accountDetails.isDeleted ? selectedUser : {},
	    message: 'Updated Successfully'
    });
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
		const { id, email, status } = getState().get('auth').get('user');
		const userServiceGroups = getState().get('account').get('userServiceGroups');
		const serviceTypes = getState().get('account').get('serviceTypes');
		
		if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.profileDetails)) {
			const fileContentObj = Object.assign(
				{ active: status === 1 ? 'true' : 'false' },
				formData.profileDetails,
				{ id }
			);
			await dispatch(internals.updateBitBucketFile(fileContentObj, 2));
			await api.put(`/account/${id}`, { data: formData.profileDetails });
    } else if (strictValidObjectWithKeys(formData) && strictValidArrayWithLength(formData.userServices)) {
			const toAddServicesList = [];
			const toDeleteServicesList = [];
			
			formData.userServices.forEach((serviceList, indexOfServiceType) => {
				const servicetypeId = serviceTypes[indexOfServiceType].id;
				
				serviceList.forEach(service => {
					let isPresentFlag = false;
					userServiceGroups.forEach(serviceType => {
						if (serviceType.name === service && serviceType.servicetypeId === servicetypeId) {
							isPresentFlag = true;
						}
					});
					if (!isPresentFlag) {
						toAddServicesList.push({
							service,
							servicetypeId
						});
					}
				});
			});
			
			userServiceGroups.forEach(service => {
				let indexOfServiceType = -1;
				
				serviceTypes.forEach((serviceType, idx) => {
					if (serviceType.id === service.servicetypeId) {
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
				await api.post(`/services`, { data: { userId: id, services: toAddServicesList } });
			}
			if (strictValidArrayWithLength(toDeleteServicesList)) {
				await api.post(`/services/delete`, { data: { serviceIds: toDeleteServicesList } });
			}
			
			if (toUpdateBitBucketFlag) {
				const fileContentObj = Object.assign(
					{ active: true },
					{ id },
					{ userServices: formData.userServices },
				);
				await dispatch(internals.updateBitBucketFile(fileContentObj, 2));
			}
		} else if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.otherDetails)) {
			const fileContentObj = Object.assign(
				{ active: status === 1 ? 'true' : 'false' },
				{ otherDetails: formData.otherDetails || {} },
				{ id }
			);
			await dispatch(internals.updateBitBucketFile(fileContentObj, 2));
			await Promise.all(Object.keys(formData.otherDetails).map(detail =>
				dispatch(internals.addAndDeleteMultipleTypes(formData.otherDetails[detail], detail))
			));
		}
		
		// Update password if password field is present in formData object
		if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.password)) {
			const updatePasswordObj = {
				email,
				currentPassword: formData.password.currentPassword,
				newPassword: formData.password.password
			};
			await dispatch(updatePassword(updatePasswordObj, true));
		}
		
		await dispatch(loadUserProfileRelatedData());
		dispatch({ type: LOAD_SUCCESS });
		dispatch({ type: UPDATED_PROFILE, message: 'Updated Successfully' });
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
    dispatch({ type: VERIFY_TOKEN_SUCCESS, res });
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
		let relationalMappedData = await api.get('/common/relationalMappedData', { params: { userId: id } });
		const userDetailsObj = dispatch (internals.formatRelationalMappedData(relationalMappedData));
		// for user services do separate processing
		const serviceType = [];
		userDetailsObj.userServiceGroups.forEach(service => {
			const indexOfServiceType = service.servicetypeId - 1;
			if (!(indexOfServiceType in serviceType)) {
				serviceType[indexOfServiceType] = [];
			}
			serviceType[indexOfServiceType].push(service.name);
		});
		const formValueServiceType = [];
		USER_SERVICES_LIST.forEach((serviceValuesList, idx) => {
			if (strictValidArrayWithLength(serviceValuesList) && (idx - 1) in serviceType) {
				formValueServiceType[idx - 1] = serviceValuesList.map(v => serviceType[idx - 1].indexOf(v) > -1);
			}
		});
		// for other relational data process autonomously
		const formValuesObj = {};
		RELATIONAL_MAPPING_INFO_LIST.forEach(v => {
			// if valid object: v && is not related to serviceTypes
			const isValidEntryFlag = validObjectWithParameterKeys(
					v,
					['primaryTable', 'targetKey', 'formValuesKey', 'reduxStateKey']
				) && v.primaryTable !== 'serviceTypes';
			if (isValidEntryFlag) {
				formValuesObj[v.formValuesKey] = userDetailsObj[v.primaryTable]
					.map(r => !!userDetailsObj[v.reduxStateKey].filter(g => r.status && g[v.targetKey] === r.id).length);
			}
		});
		userDetailsObj.userDetails = Object.assign({}, { serviceType: formValueServiceType }, formValuesObj);
		dispatch(Object.assign({}, { type: LOAD_USER_PROFILE_RELATED_DATA }, userDetailsObj));
		return { serviceType };
  } catch (error) {
		dispatch({ type: LOAD_FAIL, error });
		dispatch(internals.resetMessage());
  }
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
	const mdFileData = await dispatch(internals.getFileContent(fileContentObj));
	let updateFileData = Object.assign({}, mdFileData, { type });
	updateFileData.message = `Updated: ${updateFileData.path}`;
	await dispatch(updateBitBucketFile(updateFileData));
};

internals.getFileContent = (fileContentObj) => async (dispatch, getState, api) => {
	let path = null;
	let content = '';
	let dataObj = {};
	
	const sessionUser = getState().get('auth').get('user') || {};
	
	const sameSessionUserFlag = validObjectWithParameterKeys(fileContentObj, ['id']) &&
		validObjectWithParameterKeys(sessionUser, ['id']) &&
		sessionUser.id === fileContentObj.id;
	
	if (!sameSessionUserFlag && validObjectWithParameterKeys(fileContentObj, ['id', 'active'])) {
		const { id, active } = fileContentObj;
		path = `${USER_PROFILE_PATH}/${id}.md`;
		content = await dispatch(internals.getBitBucketFileData(path));
		
		if (!strictValidString(content)) {
			//Create a new user profile md file
			dataObj = Object.assign(PROFILE_MD_META_INITIAL_VALUES, fileContentObj);
		
			// Transform relative image url to absolute path if relative url exists
			dataObj.image = dataObj.image
				? getAbsoluteS3FileUrl(dataObj.image)
				: DEFAULT_USER_PROFILE_IMAGE_URL;
		
			const extraMetaDataKeys = Object
				.keys(dataObj)
				.filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) <= -1 && KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS.indexOf(k) <= -1);
			const validMetaDataKeys = Object.keys(dataObj).filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) > -1);
			content = '---\n';
			validMetaDataKeys.forEach(k => {
				content += addKeyValuePairAsString(k, dataObj[k], '\n');
			});
			extraMetaDataKeys.forEach(k => {
				content += addKeyValuePairAsString(k, dataObj[k], '\n');
			});
			RELATIONAL_MAPPING_INFO_LIST.forEach(v => {
				// if valid object: v && is not related to serviceTypes
				const isValidEntryFlag = validObjectWithParameterKeys(v, ['primaryTable', 'secondaryTable']) &&
					['serviceTypes', 'treatmentFocusTypes'].indexOf(v.primaryTable) <= -1;
				if (isValidEntryFlag) {
					content += addKeyValuePairAsString(v.secondaryTable, '[]', '\n');
				}
			});
			content += '---\n\n\n\n';
		} else {
			//Replace old file with active true/false
			const toReplaceStr = active ? 'active: false' : 'active: true';
			content = content.replace(toReplaceStr, `active: ${active}`);
		}
	}
	
	if (sameSessionUserFlag) {
		dataObj = Object.assign(PROFILE_MD_META_INITIAL_VALUES, sessionUser, fileContentObj);
		let { id, userServices, otherDetails } = dataObj;
		path = `${USER_PROFILE_PATH}/${id}.md`;
		
		// Transform relative image url to absolute path if relative url exists
		dataObj.image = sessionUser.image
			? getAbsoluteS3FileUrl(sessionUser.image)
			: (fileContentObj.image ? getAbsoluteS3FileUrl(fileContentObj.image) : DEFAULT_USER_PROFILE_IMAGE_URL);
		
		// process serviceTypes & treatmentFocusTypes separately
		const serviceTypes = getState().get('account').get('serviceTypes');
		const treatmentFocusTypes = getState().get('account').get('treatmentFocusTypes');
		const userTreatmentFocusGroups = getState().get('account').get('userTreatmentFocusGroups');
		const userServicesValues = (strictValidArrayWithLength(userServices) && userServices) || [];
		const userTreatmentFocusValues = dispatch(internals.getTypeArrayValues('treatmentFocusType', otherDetails)) ||
			userTreatmentFocusGroups.map(g => Object.assign(
				g,
				{ checked: true },
				strictValidArrayWithLength(treatmentFocusTypes.filter(t => t.id === g.treatmentfocustypeId))
					? treatmentFocusTypes.filter(t => t.id === g.treatmentfocustypeId)[0] : {}
			));
		
		// save other fields autonomously
		const extraMetaDataKeys = Object.keys(dataObj)
			.filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) <= -1 && KEYS_TO_IGNORE_IN_EXTRA_META_FIELDS.indexOf(k) <= -1);
		const validMetaDataKeys = Object.keys(dataObj).filter(k => MD_FILE_META_DATA_KEYS.indexOf(k) > -1);
		
		content = '---\n';
		
		validMetaDataKeys.forEach(k => {
			content += addKeyValuePairAsString(k, dataObj[k], '\n');
		});
		extraMetaDataKeys.forEach(k => {
			content += addKeyValuePairAsString(k, dataObj[k], '\n');
		});
		RELATIONAL_MAPPING_INFO_LIST.forEach(v => {
			// if valid object: v && is not related to serviceTypes
			const isValidEntryFlag = validObjectWithParameterKeys(
					v,
					['primaryTable', 'secondaryTable', 'formValuesKey', 'reduxStateKey', 'targetKey']
				) && ['serviceTypes', 'treatmentFocusTypes'].indexOf(v.primaryTable) <= -1;
			if (isValidEntryFlag) {
				const reduxStateTypeValues = getState().get('account').toJSON()[v.primaryTable];
				const reduxStateGroupValues = getState().get('account').toJSON()[v.reduxStateKey];
				const typeValues = dispatch(internals.getTypeArrayValues(v.formValuesKey, otherDetails)) ||
					reduxStateGroupValues.map(g => Object.assign(
						g,
						{ checked: true },
						strictValidArrayWithLength(reduxStateTypeValues.filter(t => t.id === g[v.targetKey]))
							? reduxStateTypeValues.filter(t => t.id === g[v.targetKey])[0] : {}
					));
				content += addKeyValuePairAsString(
					v.secondaryTable,
					`[${typeValues.filter(v => v.checked).map(v => v.name).join(', ')}]`,
					'\n'
				);
			}
		});
		content += '---\n\n\n\n';
		
		if (strictValidArrayWithLength(serviceTypes)) {
			serviceTypes.forEach((service, idx) => {
				if (idx in userServicesValues && strictValidArrayWithLength(userServicesValues[idx])) {
					const serviceHeading = (validObjectWithParameterKeys(service, ['name']) && service.name) || '';
					content += `- ##### ${serviceHeading.toUpperCase()}\n\n`;
					userServicesValues[idx].forEach(userService => {
						content += `* ${userService || ''}\n`;
					});
					content += idx === serviceTypes.length - 1 ? '\n\n' : '\n\n>\n\n';
				}
			});
		}
		
		if (userTreatmentFocusValues) {
			content += `<div class="row w100"><h5 class="w100">INSURANCE</h5><div class="clearfix"></div>`;
			content += `<p>${userTreatmentFocusValues.filter(v => v.checked).map(v => v.name).join(', ')}</p></div>`;
		}
	}
	
	return {
		path,
		content
	};
};

internals.getBitBucketFileData = (path) => async (dispatch, getState, api) => {
	try {
		let content = '';
		let bitBucketListingParams = { path: PROFILE_ROOT_PATH, page: 1 };
		const bitBucketProfileListing = await api.get('/bitBucket/listing', { params: bitBucketListingParams });
		const bitBucketDemoFileData = (strictValidArrayWithLength(bitBucketProfileListing) &&
			validObjectWithParameterKeys(bitBucketProfileListing[0], ['links']) &&
			bitBucketProfileListing[0]) || {};
		const validHrefPresentFlag = bitBucketDemoFileData.links &&
			validObjectWithParameterKeys(bitBucketDemoFileData.links, ['self']) &&
			validObjectWithParameterKeys(bitBucketDemoFileData.links.self, ['href']) &&
			strictValidString(bitBucketDemoFileData.links.self.href) &&
			strictValidArrayWithMinLength(bitBucketDemoFileData.links.self.href.split('/src/'), 2) &&
			strictValidArrayWithLength(bitBucketDemoFileData.links.self.href.split('/src/')[1].split('/'));
		const uuId = (validHrefPresentFlag && bitBucketDemoFileData.links.self.href.split('/src/')[1].split('/')[0]) || '';
		if (strictValidString(uuId)) {
			const bitBucketExistingFileData = await dispatch(bitBucketView({
				path: `/${uuId}/${path}`
			}));
			content =
				(validObjectWithParameterKeys(bitBucketExistingFileData, ['data']) && bitBucketExistingFileData.data) || '';
		}
		return content;
	} catch (e) {
		console.log(typeCastToString(e));
		return '';
	}
};

internals.getTypeArrayValues = (type, dataObj) => (dispatch, getState) => (
	validObjectWithParameterKeys(dataObj, [type]) &&
	strictValidArrayWithLength(dataObj[type]) &&
	dataObj[type].map((v, k) => Object.assign(
		{ checked: v },
		getState().get('account').get(`${type}s`)[k]
	))
) || null;

internals.addAndDeleteMultipleTypes = (formTypeValuesList, type) => async (dispatch, getState, api) => {
	try {
	  const addList = [];
	  const deleteList = [];
	  const { id } = getState().get('auth').get('user');
		const typesList = getState().get('account').get(`${type}s`) || [];
		const isValidDataFlag = strictValidString(type) && strictValidArrayWithLength(typesList);
		
		if (isValidDataFlag) {
			const currentTypeValuesList = getState().get('account').get('userDetails')[type] || [];
			const indexOfRelation = RELATIONAL_MAPPING_INFO_LIST.findIndex(r => r.formValuesKey === type);
			const relation = RELATIONAL_MAPPING_INFO_LIST[indexOfRelation];
			
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
				const dataListOfObjects = addList.map(v => ({ userId: id, [relation.targetKey]: v }));
				await api.post(`/common/bulkInsert`, { data: { table: relation.secondaryTable, dataListOfObjects } });
			}
			if (strictValidArrayWithLength(deleteList)) {
				const whereObj = { userId: id, [relation.targetKey]: { $in: deleteList } };
				await api.post(`/common/bulkDelete`, { data: { table: relation.secondaryTable, whereObj } });
			}
			return true;
		}
	} catch (err) {
		return false;
	}
};

internals.formatRelationalMappedData = relationalMappedData => () => {
	let groupsKeyObject = {};
	let groupsValuesObject = {};
	
	if (strictValidArrayWithLength(relationalMappedData)) {
		relationalMappedData.forEach((v, k) => {
			const isValidEntryObjectFlag = validObjectWithParameterKeys(v, ['count', 'rows']) &&
				validObjectWithParameterKeys(
					RELATIONAL_MAPPING_INFO_LIST[k],
					['primaryTable', 'reduxStateKey', 'dataIncludeKey']
				);
			
			if (isValidEntryObjectFlag) {
				const { primaryTable, reduxStateKey, dataIncludeKey } = RELATIONAL_MAPPING_INFO_LIST[k];
				const uniqueValidIds = [...new Set(v
					.rows
					.filter((r, i) => validObjectWithParameterKeys(r, ['id', 'name']))
					.map(r => r.id)
				)];
				groupsKeyObject[primaryTable] = [];
				v.rows.forEach((r, i) => {
					if (uniqueValidIds.indexOf(r.id) > -1) {
						let toPushFlag = true;
						if (i && r.id === v.rows[i - 1].id) {
							toPushFlag = false;
						}
						if (toPushFlag) {
							const toPushObject = Object.assign({}, r);
							delete toPushObject[dataIncludeKey];
							groupsKeyObject[primaryTable].push(toPushObject);
						}
					}
				});
				groupsValuesObject[reduxStateKey] = [...new Set(v
					.rows
					.filter(r =>
						validObjectWithParameterKeys(r, ['id', dataIncludeKey]) &&
						validObjectWithParameterKeys(r[dataIncludeKey], ['id'])
					)
					.map(r => r[dataIncludeKey])
				)];
			}
		});
	}
	return Object.assign({}, groupsKeyObject, groupsValuesObject);
};