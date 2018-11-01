
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Dropdown } from 'semantic-ui-react'
import { logout, load } from '../../redux/modules/auth'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'


class NavBar extends Component {
  state = { activeItem: 'dashboard' }
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.logOut = this.logOut.bind(this)
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(load());
  }
  logOut = () => {
    const { dispatch } =  this.props
    dispatch(logout());
  }
  loadAccounts = () => {
    const { dispatch } =  this.props
    dispatch(push('/accounts'));
  }
  render() {
    const { user, isShow } = this.props
    if (user && user.id && isShow) {
      return (
        <div className="ui right floated column">
          <Menu borderless>
            <Menu.Menu position='right'>
              <Dropdown item text= { user.email }>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.logOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </Menu>
        </div>
      )
    } else {
      return null;
    }

  }
}

function mapStateToProps(state) {
  return {
    user: state.get('auth').get('user')
  };
}

export default connect(mapStateToProps)(NavBar)