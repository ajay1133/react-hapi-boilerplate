import Immutable from 'immutable';

const LOAD = 'bitBucketRepo/LOAD';
const LOAD_SUCCESS = 'bitBucketRepo/LOAD_SUCCESS';
const LOAD_FAIL = 'bitBucketRepo/LOAD_FAIL';

const BIT_BUCKET_LISTING = 'bitBucketRepo/BIT_BUCKET_LISTING';

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
				.set('bitBucketList', action.repositories);
		
		case FLUSH: {
			return initialState;
		}
		
		default:
			return state;
	}
}

export const bitBucketListing = (token) => async (dispatch, getState, api) => {
	dispatch({ type: LOAD });
	let params = { token };
	
	try {
		const res = await api.get('/repoListing', { params });
		
		if (!res) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull repositories' });
			return;
		}
		
		dispatch({ type: LOAD_SUCCESS });
		dispatch({ type: BIT_BUCKET_LISTING, bitBucketList: res });
		
		return res;
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	}
};
