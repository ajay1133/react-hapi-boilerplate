import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import config from '../../config';
import { logout } from '../../redux/modules/auth'

const { bitBucket } = config;

class Dashboard extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };
  
  constructor (props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }
  
  getHashParams = (hash) => {
    let hashParams = {};
    let e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, " "));
      },
      q = hash.toString().substring(1);
    
    while ((e = r.exec(q)))
      hashParams[d(e[1])] = d(e[2]);
    
    return hashParams;
  };

  componentDidMount = () => {
    const { location } = this.props;
    const params = this.getHashParams(location.hash);
    console.log('Here are params --- ', params);
  };
  
  logOut = () => {
    const { dispatch } = this.props;
    dispatch(logout());
  };
  
  getAccessToken = () => {
    console.log('I am here');
    window.location =
      `https://bitbucket.org/site/oauth2/authorize?client_id=${bitBucket.key}&response_type=token`;
  };
  
  render () {
    return (
      <div>
        <h1>Welcome to Dashboard</h1>
        
        <Button className='ui facebook button' role='button'
                onClick={ this.getAccessToken }>
          <i aria-hidden='true' className='bitbucket icon' /> Bitbucket
        </Button>
  
        <Button className='ui negative button' role='button'
                onClick={ this.logOut }>
          <i aria-hidden='true' className='sign out icon' /> Logout
        </Button>
        
      </div>
    );
  }
}

export default connect(state => ({
  user: state.get('auth').get('user')
}))(Dashboard);

