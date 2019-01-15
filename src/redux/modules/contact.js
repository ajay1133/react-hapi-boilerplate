import Immutable from 'immutable';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
} from '../../utils/constants';

const FLUSH = 'contact/FLUSH';

const LOAD = 'contact/LOAD';
const LOAD_SUCCESS = 'contact/LOAD_SUCCESS';

const LIST_CONTACTS = 'contact/LIST_CONTACTS';
const LIST_CONTACTS_SORT_ORDER = 'contact/LIST_CONTACTS_SORT_ORDER';
const LIST_CONTACTS_COUNT = 'contact/LIST_CONTACTS_COUNT';
const LIST_CONTACTS_SET_PAGE = 'contact/LIST_CONTACTS_SET_PAGE';

const ERROR = 'contact/ERROR';
const RESET_MESSAGE = 'contact/RESET_MESSAGE';


const initialState = Immutable.fromJS({
  error: null,
  loading: false,
  message: null,
  contactList: [],
  contactCount: 0,
  contactCurrentPage: 1,
  contactSortOrder: {},
	contactMsg: null,
  contactErr: null
});

const internals = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return state
        .set('loading', true);

    case LOAD_SUCCESS:
      return state
        .set('loading', false);
  
    case LIST_CONTACTS:
      return state
        .set('contactList', action.result);
  
    case LIST_CONTACTS_SORT_ORDER:
      return state
        .set('contactSortOrder', action.result);
      
    case LIST_CONTACTS_COUNT:
      return state
        .set('contactCount', action.result);
      
    case LIST_CONTACTS_SET_PAGE:
      return state
        .set('contactCurrentPage', action.result);
    
    case ERROR:
      return state
        .set('error', action.error);
    
	  case RESET_MESSAGE:
		  return state
			  .set('contactMsg', null)
			  .set('loading', null)
			  .set('contactErr', null);
	
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

export const getContactList = (page, limit, sort) => async (dispatch, getState, api) => {
  dispatch({ type: LOAD });
  
  try {
    const params = {
      Page: page,
      Limit: limit,
      SortBy: sort.sortBy,
      Order: sort.order
    };
    const res = await api.get('/contactUs', { params });
    const { rows, count } = res;
    // return list of contacts
    dispatch({ type: LIST_CONTACTS, result: rows });
  
    // return count of contacts
    dispatch({ type: LIST_CONTACTS_COUNT, result: count });
  
    // return sorting of contacts
    dispatch({
      type: LIST_CONTACTS_SORT_ORDER,
      result: {
        SortBy: sort.sortBy,
        Order: sort.order === 'ASC' ? 'DESC' : 'ASC'
      }
    });
  
    // update contacts that the data has been loaded
    dispatch({ type: LOAD_SUCCESS });
  } catch (error) {
    dispatch({ type: ERROR, error: error.message });
	  dispatch(internals.resetMessage());
  }
};

export function setContactPage (PageNo) {
  return (dispatch) => {
    dispatch({
      type: LIST_CONTACTS_SET_PAGE,
      result: PageNo
    });
  };
}