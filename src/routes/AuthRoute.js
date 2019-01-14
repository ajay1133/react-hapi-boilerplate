import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom'; // eslint-disable-line

const AuthRoute = ({ component: Component, checkAuth, parent: Parent, ...rest }) => ( // eslint-disable-line
  <Route
    { ...rest }
    checkAuth={checkAuth}
    render={props => (
      checkAuth.isAuthenticated ? (
        Parent ? (
          <Parent { ...props }>
            <Component { ...props } />
          </Parent>
        ) : (
          <Component { ...props } />
        )
      ) : (
        <Redirect to={ {
          pathname: '/',
          state: { from: props.location }
        } } />
      )
    )}
  />
);

export default AuthRoute;

AuthRoute.propTypes = {
  location: PropTypes.object
};
