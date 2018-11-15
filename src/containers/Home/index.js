import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {  withRouter } from 'react-router-dom';
import Login from '../../components/Login';
import '../../style/css/style.css';

const Home = withRouter(({ location, user }) => {
  return (
    <div>
      <Container>
        <Grid centered verticalAlign="middle">
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <Login />
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
});

Home.propTypes = {
  user: PropTypes.object,
};

Home.defaultProps = {
  user: null
};

export default connect(state => ({
  user: state.get('auth').get('user'),
}))(Home);
