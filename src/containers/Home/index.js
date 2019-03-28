import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Container, List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Login from '../../components/Login';
import '../../style/css/style.css';

const Home = withRouter(({ location, user, match }) => {
  return (
    <Container fluid>
      <Grid centered verticalAlign="middle">
        <Grid.Row className="mainLogin p-0">
          <Grid.Column width={16} style={{ padding: 0}}>
            <div className="loginForm">
              <Grid>
                <Grid.Row columns="equal">
                  <Grid.Column></Grid.Column>
                  <Grid.Column width computer={8}>
                    <Login location={ location } />
                  </Grid.Column> 
                  <Grid.Column></Grid.Column>
                </Grid.Row>
              </Grid>
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
