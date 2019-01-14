import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Route, Switch } from 'react-router';
import Loadable from 'react-loadable';
import { reduxForm } from 'redux-form/immutable';

import Loading from  '../components/Loading';
import AuthRoute from  './AuthRoute';

const Home = Loadable({
    loader: () => import('../containers/Home'),
    loading: Loading,
});

const Dashboard = Loadable({
    loader: () => import('../containers/Dashboard'),
    loading: Loading,
});

const Accounts = Loadable({
    loader: () => import('../containers/Accounts'),
    loading: Loading,
});

const Profile = Loadable({
    loader: () => import('../containers/Profile'),
    loading: Loading,
});

const Confirmation = Loadable({
    loader: () => import('../containers/Confirmation'),
    loading: Loading,
});

@connect(state => ({
  user: state.get('auth').get('user')
}))
@reduxForm({
  enableReinitialize: true
})
class MainRoute extends React.Component {
  render () {
    const { history, user } = this.props;
    const checkAuth = { isAuthenticated: !!user };
    
    return (
      <ConnectedRouter history={ history }>
        <div>
          <Switch>
            <AuthRoute path="/accounts" component={ Accounts } checkAuth={ checkAuth } />
            <AuthRoute path="/dashboard" component={ Dashboard } checkAuth={ checkAuth } />
            <AuthRoute path="/profile" component={ Profile } checkAuth={ checkAuth } />
            
            <Route exact path="/" component={Home} />
            {/*<Route path="/dashboard" component={Dashboard} />*/}
            {/*<Route path="/accounts" component={Accounts} />*/}
            {/*<Route path="/profile" component={Profile} />*/}
            <Route path="/accept/invitation/:inviteToken" component={Confirmation} />
          </Switch>
        </div>
      </ConnectedRouter>
    );
  }
}

export default MainRoute;

MainRoute.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object
};
