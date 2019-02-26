import Immutable from 'immutable';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
} from '../../utils/constants';

const FLUSH = 'blog/FLUSH';

const LOAD = 'blog/LOAD';
const LOAD_SUCCESS = 'blog/LOAD_SUCCESS';

const ERROR = 'blog/ERROR';
const RESET_MESSAGE = 'blog/RESET_MESSAGE';


const initialState = Immutable.fromJS({
  error: null,
  loading: false,
  message: null,
});

const internals = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state
        .set('loading', true);

    case LOAD_SUCCESS:
      return state
        .set('loading', false)
        .set('message', action.message);
    
    case ERROR:
      return state
        .set('loading', false)
        .set('error', action.error);
    
	  case RESET_MESSAGE:
		  return state
			  .set('loading', null);
	
	  case FLUSH: {
		  return initialState;
	  }
	  
    default:
      return state;
  }
}

export const flush = () => async (dispatch) => {
  dispatch({ type: FLUSH });
};

internals.resetMessage = (defaultTimeout = DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES) => {
  return dispatch => setTimeout(() => {
    dispatch({ type: RESET_MESSAGE });
  }, defaultTimeout || DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
};

/**
 * saveBlog: used to add blog details
 * @param blogDetails
 */
export const saveBlog = (blogDetails) => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  
  try {
    await api.post('/blog', { data: blogDetails });
    dispatch({ type: LOAD_SUCCESS, message: 'Added Successfully' });
    dispatch(internals.resetMessage());
  } catch (err) {
    dispatch({ type: ERROR, error: err.message });
    dispatch(internals.resetMessage());
  }
};

/**
 * updateBlog: used to update blog details
 * @param fileName
 * @param blogDetails
 */
export const updateBlog = (fileName, blogDetails) => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  
  try {
    await api.put(`/blog/${fileName}`, { data: blogDetails });
    dispatch({ type: LOAD_SUCCESS, message: 'Updated Successfully' });
    dispatch(internals.resetMessage());
  } catch (err) {
    dispatch({ type: ERROR, error: err.message });
    dispatch(internals.resetMessage());
  }
};
