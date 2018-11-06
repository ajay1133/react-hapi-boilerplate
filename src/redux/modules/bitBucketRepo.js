import Immutable from 'immutable';

const LOAD = 'bitBucketRepo/LOAD';
const LOAD_SUCCESS = 'bitBucketRepo/LOAD_SUCCESS';
const LOAD_FAIL = 'bitBucketRepo/LOAD_FAIL';

const BIT_BUCKET_LISTING = 'bitBucketRepo/BIT_BUCKET_LISTING';
const BIT_BUCKET_VIEW = 'bitBucketRepo/BIT_BUCKET_VIEW';

const FLUSH = 'bitBucketRepo/FLUSH';

const initialState = Immutable.fromJS({
	isLoad: false,
	loadErr: null,
	repositories: []
});

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case LOAD:
			return state
				.set('isLoad', true)
				.set('loadErr', null);
		
		case LOAD_SUCCESS:
			return state
				.set('isLoad', false);
		
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
