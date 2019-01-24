import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import App from './containers/App';
import createStore from './redux/createStore';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

Moment.locale('en');
momentLocalizer();

const history = createHistory();
const store = createStore(history, {});

ReactDOM.render(
  <Provider store={store} >
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);

