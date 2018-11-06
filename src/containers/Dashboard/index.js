import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, List, Dimmer, Loader } from 'semantic-ui-react';
import config from '../../config';
import { bitBucketListing } from '../../redux/modules/bitBucketRepo';

const { bitBucket } = config;

const md = MarkDown({
  html: false,
  linkify: true,
  typographer: true
});

class Dashboard extends Component {
  state = {
    loading: false,
    hideRepoListingAreaFlag: false,
    token: null
  };
  
	static propTypes = {
		dispatch: PropTypes.func,
    location: PropTypes.object,
    bitBucketList: PropTypes.array
	};
 
	componentDidMount = () => {
		const { dispatch, location } = this.props;
		const params = this.getHashParams(location.hash);
		
		if (params) {
		  const token = params.access_token;
    
		  this.setState({
        loading: true,
        token
      });
		  
      dispatch(bitBucketListing({ token }))
        .then(() => this.setState({ loading: false }))
        .catch(() => this.setState({ loading: false }));
    }
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
  
  bitBucketConnect = () => {
    window.location =
      `https://bitbucket.org/site/oauth2/authorize?client_id=${bitBucket.key}&response_type=token`;
	};
	
	hideRepoListingArea = () => {
	  const { hideRepoListingAreaFlag } = this.state;
	  
	  this.setState({
		  hideRepoListingAreaFlag: !hideRepoListingAreaFlag
    })
  };
  
	getMd = () => md.render();
  
  getMdParse = () => {
    return (
      <Markup
        htmlString= { this.getMd() }
      />
    );
  };
  
  getBitBucketData = (e, href, type) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    
    if (type === 'commit_directory') {
      const listData = Object.assign({}, { token, path: href.split('/src')[1] });
      dispatch(bitBucketListing(listData));
    }
  };
  
  getLevelUp = (repo) => {
    let href_1 = '', href_2 = '';
    
    if (repo.path.split('/').length > 1) {
      href_2 = repo.path.split('/').slice(-4, -2)[0] || 'src';
      href_1 = repo.links.self.href.split(href_2)[0];
      
      return (
        <List.Icon
          size='large'
          name='reply'
          onClick={ (e) => this.getBitBucketData(e, (href_1+href_2), 'commit_directory') }
        />);
    }
  };
  
  render () {
	  const { user, isLoad, loadErr, bitBucketList } = this.props;
	  const { hideRepoListingAreaFlag, token } = this.state;
	  
	  const validUserNameFlag = user && user.firstName && user.lastName;
	  const loadingCompleteFlag = !isLoad && !loadErr;
	  const validBitBucketListFlag = loadingCompleteFlag && bitBucketList && Array.isArray(bitBucketList);
	  
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
        <div className="left aligned topAdujusting" style={{ marginBottom: '20px' }}>
          <h3 className="">
            Welcome
            {
              validUserNameFlag &&
              <u style={{ color: 'blue', marginLeft: '5px' }}>{ user.firstName + ' ' + user.lastName }</u>
            }
          </h3>
        </div>
        
        {
          !token &&
          <Button
            className='ui facebook button hand-pointer'
            style={{ marginLeft: '20px', marginTop: '-10px' }}
            role='button'
            onClick={ () => this.bitBucketConnect() }
          >
            <i aria-hidden='true' className='bitbucket icon' />Fetch Data From BitBucket
          </Button>
        }
  
        {
          !token &&
          <div className="row" style={{ marginTop: '20px' }}>
            Click on the "Fetch Data From BitBucket" button above to get access from BitBucket where you will need to login to grant access to "your" BitBucket repository
          </div>
        }
        
        {
          token &&
          <div className="ui card fluid cardShadow">
            <div className="content pageMainTitle">
              <h4>
                { loadingCompleteFlag ? 'Listing' : 'Loading' } Files From BitBucket Repository
                <Button
                  className='float-right button hand-pointer'
                  style={{ float: 'right' }}
                  role='button'
                  onClick={ () => this.hideRepoListingArea() }
                >
		              { hideRepoListingAreaFlag ? 'Expand' : 'Collapse' }
                </Button>
              </h4>
              {
	              loadingCompleteFlag && !hideRepoListingAreaFlag &&
                <span>
                  Click on the folder/file icon flag to view the contents. Click on the back icon to go back.
                </span>
              }
            </div>
  
            {
	            validBitBucketListFlag && !!bitBucketList.length && !hideRepoListingAreaFlag &&
              <div className="content">
                <List>
                  <List.Item>
				            { this.getLevelUp(bitBucketList[0]) }
                  </List.Item>
                  <List.Item>
				            { <List.Icon size='large' name='folder open'/> }
                    <List.Content>
                      <List.Header>
						            { bitBucketList[0].path.split('/').slice(-2, -1)[0] || 'src' }
                      </List.Header>
                      <List.List>
						            {
							            bitBucketList.map((repo, idx) => {
								            return (
                              <List.Item as='a' key={idx}>
                                <List.Icon
                                  size='large'
                                  verticalAlign='middle'
                                  name={ (repo.type === 'commit_directory') ? 'folder' : 'file' }
                                  onClick={ (e) => this.getBitBucketData(e, repo.links.self.href, repo.type) }
                                />
                                <List.Content>
                                  <List.Header>
                                    { repo.path.split('/').pop() }
                                  </List.Header>
                                </List.Content>
                              </List.Item>
								            );
							            })
						            }
                      </List.List>
                    </List.Content>
                  </List.Item>
                </List>
              </div>
            }
            
            {
	            loadingCompleteFlag && !bitBucketList.length && !hideRepoListingAreaFlag &&
              <div className="content">
                No files found
              </div>
            }
            
            {
	            !loadingCompleteFlag && !hideRepoListingAreaFlag &&
              <div className="content">
                <Loader active inline='centered'>Loading</Loader>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}

export default connect(state => ({
	user: state.get('auth').get('user'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
	loadErr: state.get('bitBucketRepo').get('loadErr'),
  bitBucketList: state.get('bitBucketRepo').get('bitBucketList')
}))(Dashboard);