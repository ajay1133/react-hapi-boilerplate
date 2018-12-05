import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Button,
  Grid,
  Header,
  Image,
  Menu,
  Segment,
  Sidebar, } from 'semantic-ui-react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { connect } from 'react-redux';
import NavBar from '../../components/NavBar';
import routes from '../../routes';
import 'semantic-ui-css/semantic.css';

import '../../style/css/style.css';

const HorizontalSidebar = ({ animation, direction, visible }) => (
  <Sidebar as={Segment} animation={animation} direction={direction} visible={visible}>
    <Grid textAlign='center'>
      <Grid.Row columns={1}>
        <Grid.Column>
          <Header as='h3'>New Content Awaits</Header>
        </Grid.Column>
      </Grid.Row>
      <Grid columns={3} divided>
        <Grid.Column>
          <Image src='/images/wireframe/media-paragraph.png' />
        </Grid.Column>
        <Grid.Column>
          <Image src='/images/wireframe/media-paragraph.png' />
        </Grid.Column>
        <Grid.Column>
          <Image src='/images/wireframe/media-paragraph.png' />
        </Grid.Column>
      </Grid>
    </Grid>
  </Sidebar>
);

HorizontalSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool,
};

const VerticalSidebar = ({ animation, direction, visible }) => (
  <Sidebar
    as={Menu}
    animation={animation}
    direction={direction}
    icon='labeled'
    inverted
    vertical
    visible
    width='thin'
  >
    <Menu.Item as='a'>
      <Image src='/images/logo.png' size='' centered />
    </Menu.Item>
  
  </Sidebar>
);

VerticalSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool,
};

class App extends Component {
  state = {
    animation: '',
    direction: 'left',
    dimmed: false,
    visible: false,
  };
  handleAnimationChange = animation => () =>
    this.setState({ animation, visible: !this.state.visible });
  
  render () {
    const { history, isShow = true, user } = this.props;
    const { animation, dimmed, direction, visible } = this.state;
    // const vertical = direction === 'bottom' || direction === 'top'
    
    return (
      <div className="full-height">
        <Button className="hide" onClick={this.handleAnimationChange('push')}>Push</Button>
        <Sidebar.Pushable as={Segment}>
          {
            user && <VerticalSidebar animation={animation} direction={direction} visible={visible} />
          }
          <Sidebar.Pusher dimmed={dimmed && visible} >
            <Segment basic>
              {
                isShow &&
                <Grid className="innerData">
                  <Grid.Row>
                    <Grid.Column width={16} className="mainContent">
                      <NavBar isShow={isShow}/>
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
