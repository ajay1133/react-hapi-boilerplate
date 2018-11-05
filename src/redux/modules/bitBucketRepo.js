import Immutable from 'immutable';

const LOAD = 'bitBucketRepo/LOAD';
const LOAD_SUCCESS = 'bitBucketRepo/LOAD_SUCCESS';
const LOAD_FAIL = 'bitBucketRepo/LOAD_FAIL';

const PULL_REPO = 'bitBucketRepo/PULL_REPO';

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
		
		case PULL_REPO:
			return state
				.set('repositories', action.repositories);
		
		case FLUSH: {
			return initialState;
		}
		
		default:
			return state;
	}
}

export const bitBucketListing = () => async (dispatch, getState, api) => {
	const user = getState().get('auth').get('user');
	
	dispatch({ type: LOAD });
	
	try {
		const res = await api.get('/repoListing');
		
		if (!res.values) {
			dispatch({ type: LOAD_FAIL, error: 'Unable to pull repositories' });
			return;
		}
		
		dispatch({ type: LOAD_SUCCESS });
		dispatch({ type: PULL_REPO, repositories: res.values });
		
		return res;
	} catch (error) {
		dispatch({ type: LOAD_FAIL, error });
	}
};
