import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'semantic-ui-react';
import { logout, load } from '../../redux/modules/auth';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { strictValidObjectWithKeys } from '../../utils/commonutils';

class NavBar extends Component {
  state = { activeItem: 'dashboard' };
  
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func
  };
  
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  };
  
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(load());
  };
  
  logOut = () => {
    const { dispatch } =  this.props;
    dispatch(logout());
  };
  
  loadRoute = (route) => {
		const { dispatch } =  this.props;
		dispatch(push(route));
	};
	
  render() {
    const { user, isShow, location } = this.props;
    
	  const validUserNameFlag = strictValidObjectWithKeys(user) && user.firstName && user.lastName;
	  const currentLocation = location && strictValidObjectWithKeys(location.toJSON()) && location.toJSON().pathname;
	  
    if (strictValidObjectWithKeys(user) && user.id && isShow) {
      return (
        <div className="topNavbar">
          <div className="col-8">
            <div className="ui right floated column">
              <Menu borderless>
                {
                  user.role === 1 &&
                  <Menu.Item active={ currentLocation === '/accounts' } onClick={ () => this.loadRoute('/accounts') }>
                    Accounts
                  </Menu.Item>
                }
                <Menu.Item active={ currentLocation === '/dashboard' } onClick={ () => this.loadRoute('/dashboard') }>
                  Dashboard
                </Menu.Item>
                <Menu.Menu position='right'>
                  <Dropdown item text= { (validUserNameFlag && (user.firstName + ' ' + user.lastName)) || user.email }>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={this.logOut}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Menu>
              </Menu>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }

  }
}

function mapStateToProps(state) {
  return {
    user: state.get('auth').get('user'),
	  location: state.get('router').get('location')
  };
}

export default connect(mapStateToProps)(NavBar)