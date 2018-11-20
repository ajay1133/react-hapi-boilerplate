import Immutable from 'immutable';
import { strictValidObjectWithKeys } from '../../utils/commonutils';
import { DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';
import markdownObject from 'markdown';

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
	setFileFormInitialValues: {}
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
				.set('loadErr', JSON.stringify(action.error));
		
		case BIT_BUCKET_LISTING:
			return state
				.set('bitBucketList', action.result);
		
		case BIT_BUCKET_VIEW:
			return state
				.set('setFileFormInitialValues', action.result);
		
		case ADD_ACCESS_TOKEN:
			return state
				.set('accessToken', action.result);
			
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
	dispatch({ type: ADD_ACCESS_TOKEN, result: params.accessToken || '' });
	
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
		
    if (!(strictValidObjectWithKeys(res) && res.data)) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull file' });
			return;
		}
	 
		const result = await dispatch(convertMd2Json(res.data));
    
    dispatch({ type: BIT_BUCKET_VIEW, result });
    dispatch({ type: LOAD_SUCCESS });
	} catch (error) {
	  dispatch({ type: BIT_BUCKET_VIEW, result: {} });
		dispatch({ type: LOAD_FAIL, error });
	}
 
	return res;
};

export const updateBitBucketFile = (data) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	
	let res = {};
	
	try {
		res = await api.post('/bitBucket/updateFile', { data });
		
		if (strictValidObjectWithKeys(res)) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to update file' });
			return;
		}
		
		dispatch({ type: LOAD_SUCCESS, message: 'Successfully Updated To BitBucket. Loading updated file' });
		
		dispatch(internals.resetMessage());
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
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
		const md = markdownObject.markdown;
		
		res = await md.parse(fileContent);
		
		if (!Array.isArray(res) || !res.length) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to parse file' });
			return {};
		}
		
		console.log(res);
		
		let details = {};
		let content = {};
		let indexOfContent = -1;
		let lastParsedIndex = -1;
		
		res.forEach((item, index) => {
			const result = internals.parseDetails(res, index);
			
			if (strictValidObjectWithKeys(result)) {
				lastParsedIndex = index;
				details = Object.assign({}, details, result);
			}
		});
		
		for (let i = lastParsedIndex + 1; i < res.length - 1; i++) {
			if (Array.isArray(res[i]) && res[i].length > 1) {
				indexOfContent = i;
				break;
			}
		}
		
		console.log(indexOfContent);
		
		content = indexOfContent > -1
			? md.renderJsonML(md.toHTMLTree(res.slice(indexOfContent - 1))) : md.renderJsonML(md.toHTMLTree(res));
		
		res = Object.assign({}, details, { content });
	} catch (error) {
		console.log('Error parsing file: ', error);
		dispatch({ type: LOAD_FAIL, error: JSON.stringify(error) });
		return {};
	}
	
	return res;
};

internals.resetMessage = (defaultTimeout = DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES) => {
	return dispatch => setTimeout(() => {
		dispatch({ type: RESET_MESSAGE, message: null });
	}, defaultTimeout);
};

internals.parseDetails = (fileContent, atIndex) => {
	let details = {};
	
	const isValidDetailFlag = fileContent[atIndex] && Array.isArray(fileContent[atIndex]);
	
	if (isValidDetailFlag) {
		details = internals.parseFieldsBetweenDetails(fileContent[atIndex]);
	}
	
	return details;
};

internals.parseFieldsBetweenDetails = (detailsTree) => {
	const fields = {};
	
	detailsTree.forEach(detailItem => {
		const isParsableStringFlag = typeof detailItem === 'string' && detailItem.split(':').length > 1;
		const isParsableArrayFlag = Array.isArray(detailItem) && Object.keys(fields).length &&
			!fields[Object.keys(fields)[Object.keys(fields).length - 1]];
		
		if (isParsableStringFlag) {
			detailItem.split('\r\n').forEach(v => {
				if (v) {
					const val = v.split(':').map((item, key) => key && typeof item === 'string' ? item.trim() : item);
					fields[val[0]] = val.length > 1 ? val.slice(1).join(':') : '';
				}
			});
		}
		
		if (isParsableArrayFlag) {
			fields[Object.keys(fields)[Object.keys(fields).length - 1]] = detailItem.length && detailItem[1].ref &&
				typeof detailItem[1].ref === 'string' ? detailItem[1].ref : '';
		}
	});
	
	return fields;
};