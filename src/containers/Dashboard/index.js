import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pullBitBucketRepositories } from '../../redux/modules/bitBucketRepo';

class Dashboard extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(pullBitBucketRepositories());
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
};

Dashboard.propTypes = {
	user: PropTypes.object
};

export default connect(state => ({
	user: state.get('auth').get('user'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
	loadErr: state.get('bitBucketRepo').get('loadErr'),
	repositories: state.get('bitBucketRepo').get('repositories')
}))(Dashboard);
