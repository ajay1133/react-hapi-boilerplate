import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import config from '../../config';
import { pullBitBucketRepositories } from '../../redux/modules/bitBucketRepo';

const { bitBucket } = config;

class Dashboard extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
    location: PropTypes.object
	};
 
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
		const { dispatch, location } = this.props;
		const params = this.getHashParams(location.hash);
		console.log('Here are params --- ', params);
		
		dispatch(pullBitBucketRepositories());
	};
 
	getAccessToken = () => {
		console.log('I am here');
		window.location =
			`https://bitbucket.org/site/oauth2/authorize?client_id=${bitBucket.key}&response_type=token`;
	};
  
  render () {
	  const { user, isLoad, loadErr, repositories } = this.props;
    
    if (!user || (isLoad && loadErr)) {
      return (
        <div>
          {
            user && <h3>An Error Occurred : { loadErr }</h3>
          }
        </div>
      );
    }
    
    return (
      <div>
        <div className="left aligned topAdujusting">
          <h3 className="">WELCOME {user.firstName + ' ' + user.lastName}</h3>
        </div>
  
        <Button className='ui facebook button' style={{ marginLeft: '20px' }} role='button' onClick={ this.getAccessToken }>
          <i aria-hidden='true' className='bitbucket icon' /> Bitbucket
        </Button>
  
        <div className="ui card fluid cardShadow mb20">
          <div className="content pageMainTitle">
            <h4>LISTING FILES FROM BITBUCKET REPOSITORY</h4>
          </div>
  
          <div className="content">
            {
	            repositories.map(repo => {
	              return (
                  <div>repo.description</div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
	user: state.get('auth').get('user'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
	loadErr: state.get('bitBucketRepo').get('loadErr'),
	repositories: state.get('bitBucketRepo').get('repositories')
}))(Dashboard);