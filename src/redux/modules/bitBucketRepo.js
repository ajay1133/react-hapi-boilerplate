import Immutable from 'immutable';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidSplittableStringWithMinLength,
	validObjectWithParameterKeys
} from '../../utils/commonutils';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
	BLOG_MD_META_INITIAL_VALUES,
	DEFAULT_BITBUCKET_LIST_FILTERS,
} from '../../utils/constants';

const LOAD = 'bitBucketRepo/LOAD';
const LOAD_SUCCESS = 'bitBucketRepo/LOAD_SUCCESS';
const LOAD_FAIL = 'bitBucketRepo/LOAD_FAIL';

const ADD_ACCESS_TOKEN = 'bitBucketRepo/ADD_ACCESS_TOKEN';
const BIT_BUCKET_LISTING = 'bitBucketRepo/BIT_BUCKET_LISTING';
const BIT_BUCKET_VIEW = 'bitBucketRepo/BIT_BUCKET_VIEW';

const RESET_MESSAGE = 'bitBucketRepo/RESET_MESSAGE';
const FLUSH = 'bitBucketRepo/FLUSH';

const initialState = Immutable.fromJS({
	message: null,
	isLoad: false,
	loadErr: null,
	accessToken: null,
	repositories: [],
  bitBucketInitialValues: BLOG_MD_META_INITIAL_VALUES,
	bitBucketListFilters: DEFAULT_BITBUCKET_LIST_FILTERS
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
				.set('message', action.message || null);
		
		case LOAD_FAIL:
			return state
				.set('isLoad', false)
				.set('loadErr', typeCastToString(action.error));
		
		case BIT_BUCKET_LISTING:
			return state
				.set('bitBucketList', action.result)
				.set('bitBucketListFilters', Object.assign({}, state.bitBucketListFilters, action.bitBucketListFilters));
		
		case BIT_BUCKET_VIEW:
			return state
				.set('bitBucketInitialValues', (strictValidObjectWithKeys(action.result) && action.result) || {});
		
		case ADD_ACCESS_TOKEN:
			return state
				.set('accessToken', action.result);
			
		case RESET_MESSAGE:
			return state
				.set('message', typeCastToString(action.message))
				.set('loadErr', typeCastToString(action.error));
			
		case FLUSH: {
			return initialState;
		}
		
		default:
			return state;
	}
}

export const bitBucketListing = (params) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	let res = {};
	
	if (!validObjectWithParameterKeys(params, Object.keys(DEFAULT_BITBUCKET_LIST_FILTERS))) {
		return res;
	}
	
  try {
		res = await api.get('/bitBucket/listing', { params });
		
		if (!res) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull repositories' });
			dispatch(internals.resetMessage());
			return;
		}
	 
		dispatch({ type: BIT_BUCKET_LISTING, result: res, bitBucketListFilters: params });
    dispatch({ type: LOAD_SUCCESS });
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	  dispatch(internals.resetMessage());
	}
	
	return res;
};

export const bitBucketView = (params) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
 
	let res = {};
  
  try {
		res = await api.get('/bitBucket/view', { params });
		
    if (!(strictValidObjectWithKeys(res) && res.data)) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull file' });
	    dispatch(internals.resetMessage());
			return;
		}
	 
		const result = await dispatch(convertMd2Json(res.data));
    
    dispatch({ type: BIT_BUCKET_VIEW, result });
    dispatch({ type: LOAD_SUCCESS });
    return result;
	} catch (error) {
	  dispatch({ type: BIT_BUCKET_VIEW, result: {} });
		dispatch({ type: LOAD_FAIL, error });
	  dispatch(internals.resetMessage());
	  return res;
	}
};

export const updateBitBucketFile = (data) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	let res = {};
	const errorMsg = [], successMsg = [];
	
	errorMsg[1] = 'Unable to add file';
	errorMsg[2] = 'Unable to update file';
  
  successMsg[1] = 'Successfully Added';
  successMsg[2] = 'Successfully Updated';
  
  const type = data.type;
  delete data.type;
  
	try {
		res = await api.post('/bitBucket/updateFile', { data });
		
		if (strictValidObjectWithKeys(res)) {
			dispatch({ type: LOAD_FAIL, error: (type && type in errorMsg && errorMsg[type]) || '' });
			dispatch(internals.resetMessage());
			return;
		}
		
		dispatch({ type: LOAD_SUCCESS, message: (type && type in successMsg && successMsg[type]) || '' });
		dispatch(internals.resetMessage());
		return await dispatch(convertMd2Json(data.content));
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
		dispatch(internals.resetMessage());
		return {};
	}
};

/**
 * deleteBitBucketFile: used to delete file on Bitbucket
 * @param data
 */
export const deleteBitBucketFile = (data) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	let res = {};
	
	try {
		res = await api.post('/bitBucket/deleteFile', { data });
		if (strictValidObjectWithKeys(res)) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to delete file' });
			dispatch(internals.resetMessage());
			return;
		}
		dispatch({ type: LOAD_SUCCESS, message: 'Successfully Deleted To BitBucket. Loading file' });
		dispatch(internals.resetMessage());
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
		dispatch(internals.resetMessage());
	}
	return res;
};

/**
 * convertMd2Json
 * @param content
 */
export const convertMd2Json = (fileContent) => async (dispatch) => {
	dispatch({ type: LOAD });
	
	let res = {};
	
	try {
		const delimiterToDiffDetailsWithContent = '---';
		const delimiterToDiffDetails = '\n';
		const delimiterToDiffEachDetail = ':';
		
		res = (strictValidSplittableStringWithMinLength(fileContent, delimiterToDiffDetailsWithContent, 2) &&
			fileContent.split(delimiterToDiffDetailsWithContent)) || [];
		
		if (!res.length) {
			dispatch({
				type: LOAD_FAIL,
				error: `Invalid file. The '---' are not wrapping the meta-data fields. You can only view the file.
				 If opened in edit mode the data won't be fetched.`
			});
			return {};
		}
		
		let details = {};
		
		if (strictValidSplittableStringWithMinLength(res[1], delimiterToDiffDetails, 1)) {
			res[1]
				.split(delimiterToDiffDetails)
				.filter(v => strictValidSplittableStringWithMinLength(v, delimiterToDiffEachDetail, 2))
				.forEach(v => {
					const termList = v.split(delimiterToDiffEachDetail);
					const detailKey = termList[0].trim();
					const detailValue = termList
						.slice(1)
						.join(delimiterToDiffEachDetail)
						.trim();
					
					details[detailKey] = detailValue;
				});
		}
		
		const content = res.slice(2).join(delimiterToDiffDetailsWithContent).trim();
		res = Object.assign({}, details, { content });
	} catch (error) {
		console.log('Error parsing file: ', error);
		dispatch({ type: LOAD_FAIL, error: error });
		dispatch(internals.resetMessage());
		return {};
	}
	
	return res;
};

export const resetBitBucketFileForm = () => async (dispatch) => {
	dispatch({ type: LOAD });
	dispatch({ type: BIT_BUCKET_VIEW, result: BLOG_MD_META_INITIAL_VALUES });
	dispatch({ type: LOAD_SUCCESS });
};

export const flush = () => async (dispatch) => {
	dispatch({ type: FLUSH });
};

internals.resetMessage = (defaultTimeout = DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES) => {
	return dispatch => setTimeout(() => {
		dispatch({
			type: RESET_MESSAGE,
			message: null,
			error: null
		});
	}, defaultTimeout || DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
};