import Immutable from 'immutable';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidArrayWithLength,
	strictValidString,
	validObjectWithParameterKeys
} from '../../utils/commonutils';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
	OFFSET,
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
    
    if (accountDetails.status === 0) {
    	//Make the status = 3, same as of denied
      users = users.filter(user => user.id !== id);
	    selectedUser = strictValidArrayWithLength(users.filter(user => user.id === id)) &&
		    users.filter(user => user.id === id)[0];
    } else {
      users = users.map((user) => {
        if (user.id === id) {
          Object.assign(user, accountDetails);
        }
        return user;
      });
      selectedUser = strictValidArrayWithLength(users.filter(user => user.id === id)) &&
	      users.filter(user => user.id === id)[0];
    }
    
    delete accountDetails.active;
    await api.put(`/account/${id}`, { data: accountDetails });
    
    dispatch(loadAccounts());
    dispatch({
	    type: ACCOUNT_SUCCESS,
	    users,
	    selectedUser: accountDetails.status !== 0 ? selectedUser : {},
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
		const { id, email } = getState().get('auth').get('user');
		
		if (strictValidObjectWithKeys(formData) && strictValidObjectWithKeys(formData.profileDetails)) {
			await api.put(`/account/${id}`, { data: formData.profileDetails });
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