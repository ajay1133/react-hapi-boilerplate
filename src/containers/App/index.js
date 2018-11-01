import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Segment, Sidebar, Grid } from 'semantic-ui-react'
import { ConnectedRouter } from 'connected-react-router/immutable'
import { connect } from 'react-redux';
import NavBar from '../../components/NavBar'
import routes from '../../routes'
import 'semantic-ui-css/semantic.css'

import '../../style/css/style.css';

class App extends Component {
  render () {
    const { history, isShow } = this.props;
    return (
      <div className="full-height">
        <Sidebar.Pushable as={Segment}>
          <Sidebar.Pusher>
            <Segment basic>
              {
                isShow &&
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16} className="pt-20 pb-30">
                      <NavBar isShow={isShow} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
              <ConnectedRouter history={history}>{ routes }</ConnectedRouter>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}
App.propTypes = {
  history: PropTypes.object,
  user: PropTypes.object
};

export default connect(state => ({
  user: state.get('auth').get('user')
}))(App);
