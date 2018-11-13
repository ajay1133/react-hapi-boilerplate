import Immutable from 'immutable';
import { strictValidObject } from '../../utils/commonutils';
import { DEFAULT_SECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';

const LOAD = 'bitBucketRepo/LOAD';
const LOAD_SUCCESS = 'bitBucketRepo/LOAD_SUCCESS';
const LOAD_FAIL = 'bitBucketRepo/LOAD_FAIL';

const BIT_BUCKET_LISTING = 'bitBucketRepo/BIT_BUCKET_LISTING';
const BIT_BUCKET_VIEW = 'bitBucketRepo/BIT_BUCKET_VIEW';

const RESET_MESSAGE = 'bitBucketRepo/RESET_MESSAGE';
const FLUSH = 'bitBucketRepo/FLUSH';

const initialState = Immutable.fromJS({
	message: null,
	isLoad: false,
	loadErr: null,
	repositories: [],
	bitBucketView: null
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
				.set('message', action.message || null);
		
		case LOAD_FAIL:
			return state
				.set('isLoad', false)
				.set('loadErr', action.error);
		
		case BIT_BUCKET_LISTING:
			return state
				.set('bitBucketList', action.result);
		
		case BIT_BUCKET_VIEW:
			return state
				.set('bitBucketView', action.result);
		
		case RESET_MESSAGE:
			return state
				.set('message', action.message);
			
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
			return;
		}
		
		dispatch({ type: BIT_BUCKET_LISTING, result: res });
    dispatch({ type: LOAD_SUCCESS });
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	}
 
	return res;
};

export const bitBucketView = (params) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
 
	let res = {};
  
  try {
		res = await api.get('/bitBucket/view', { params });
		
    if (!res) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull file' });
			return;
		}
		
		dispatch({ type: BIT_BUCKET_VIEW, result: res.data });
    dispatch({ type: LOAD_SUCCESS });
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	}
 
	return res;
};

export const updateBitBucketFile = (data) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	let res = {};
	
	try {
		res = await api.post('/bitBucket/updateFile', { data });
		
		if (res && strictValidObject(res) && Object.keys(res).length) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to update file' });
			return;
		}
		
		dispatch({ type: BIT_BUCKET_VIEW, result: data.fileContent || '' });
		dispatch({ type: LOAD_SUCCESS, message: 'Successfully Updated To BitBucket' });
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	}
	
	return res;
};

/**
 * resetMessage
 * @param defaultTimeout
 * @return {function(*): number}
 */
export function resetMessage (defaultTimeout = DEFAULT_SECONDS_TO_SHOW_MESSAGES) {
	return dispatch => setTimeout(() => {
		dispatch({ type: RESET_MESSAGE, message: null });
	}, defaultTimeout);
}