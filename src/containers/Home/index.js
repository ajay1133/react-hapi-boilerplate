import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Container, Image, List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from '../../components/Login';
import '../../style/css/style.css';

const Home = withRouter(({ location, user }) => {
  return (
    <Container fluid>
      <Grid centered verticalAlign="middle">
        <Grid.Row className="mainLogin p-0">
          <Grid.Column mobile={16} tablet={8} computer={9} style={{ padding: 0}}>
            <div className="blueBg">
              <Image src='images/logo.png' size='medium' as="a" href="/"/>
              <h1 className="pt-15  text-white">Welcome To</h1>
              <p>Compass Recovery Network</p>
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={7} style={{ padding: 0}}>
            <div className="loginForm">
              <Login />
            </div>
            <div className="footer">
              <List horizontal>
                <List.Item>
                  <List.Content>
                    <List.Header as="a" href="/terms-of-use">Term of Use</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="a" href="/privacy-policy">Privacy Policy</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
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
