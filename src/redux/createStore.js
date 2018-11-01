import { combineReducers } from 'redux-immutable';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form/immutable';
import Immutable from 'immutable';
import { routerMiddleware, connectRouter } from 'connected-react-router/immutable'
import moduleReducers from './reducers';
import ApiClient from './ApiClient';
import clientMiddleware from './clientMiddleware';
import routerReducer from './reactRouterReducer';

const api = new ApiClient();

export default function configureStore(history, preLoadedState) {
  const middlewares = [
    thunkMiddleware.withExtraArgument(api),
    clientMiddleware(api),
    routerMiddleware(history)
  ];

  if (process.env.NODE_ENV !== 'production') {
    if (!window.devToolsExtension) {
      const { logger } = require('redux-logger');
      middlewares.push(logger);
    }
  }

  const enhancer = compose(
    applyMiddleware(...middlewares),
    // other store enhancers if any,
    window.devToolsExtension ? window.devToolsExtension({
      name: 'Fan-Engagement', actionsBlacklist: ['REDUX_STORAGE_SAVE']
    }) : noop => noop
  );

  const reducers = combineReducers({
    router: routerReducer,
    form: formReducer,
    ...moduleReducers
  });

  const initialState = Immutable.fromJS(preLoadedState || {});
  return createStore(connectRouter(history)(reducers), initialState, enhancer);
}
