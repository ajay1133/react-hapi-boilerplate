import Immutable from 'immutable';
import {
	strictValidObjectWithKeys,
	strictValidString,
	strictValidSplittableStringWithMinLength
} from '../../utils/commonutils';
import { DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';

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
  bitBucketInitialValues: {}
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
				.set('loadErr', (strictValidString(action.error) && action.error) || JSON.stringify(action.error));
		
		case BIT_BUCKET_LISTING:
			return state
				.set('bitBucketList', action.result);
		
		case BIT_BUCKET_VIEW:
			return state
				.set('bitBucketInitialValues', action.result);
		
		case ADD_ACCESS_TOKEN:
			return state
				.set('accessToken', action.result);
			
		case RESET_MESSAGE:
			return state
				.set('message', action.message)
				.set('loadErr', action.error);
			
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
  try {
		res = await api.get('/bitBucket/listing', { params });
		
		if (!res) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull repositories' });
			dispatch(internals.resetMessage());
			return;
		}
		
		dispatch({ type: BIT_BUCKET_LISTING, result: res });
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
	} catch (error) {
	  dispatch({ type: BIT_BUCKET_VIEW, result: {} });
		dispatch({ type: LOAD_FAIL, error });
	  dispatch(internals.resetMessage());
	}
	return res;
};

export const updateBitBucketFile = (data) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	let res = {};
	const errorMsg = [], successMsg = [];
	
	errorMsg[1] = 'Unable to add file';
	errorMsg[2] = 'Unable to update file';
  
  successMsg[1] = 'Successfully Added To BitBucket. Loading added file';
  successMsg[2] = 'Successfully Updated To BitBucket. Loading updated file';
  
  const type = data.type;
  delete data.type;
  
	try {
		res = await api.post('/bitBucket/updateFile', { data });
		
		if (strictValidObjectWithKeys(res)) {
			dispatch({ type: LOAD_FAIL, error: errorMsg[type] });
			dispatch(internals.resetMessage());
			return;
		}
		dispatch({ type: LOAD_SUCCESS, message: successMsg[type] });
		dispatch(internals.resetMessage());
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
		dispatch(internals.resetMessage());
	}
	
	return res;
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
export const convertMd2Json = (fileContent) => async (dispatch, getState, api) => {
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
			dispatch(internals.resetMessage());
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

export const resetBitBucketFileForm = () => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	dispatch({ type: BIT_BUCKET_VIEW, result: {} });
	dispatch({ type: LOAD_SUCCESS });
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