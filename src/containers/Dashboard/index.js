import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form/immutable';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { Button, List, Loader, Modal, Icon, Form, Message } from 'semantic-ui-react';
import config from '../../config';
import { getHashParams } from '../../utils/commonutils';
import TextArea from '../../components/Form/TextArea'
import { bitBucketListing, bitBucketView, updateBitBucketFile } from '../../redux/modules/bitBucketRepo';

const { bitBucket } = config;

const md = MarkDown({
  html: false,
  linkify: true,
  typographer: true
});

@connect(state => ({
  initialValues: {
    editMDFile: state.get('bitBucketRepo').get('bitBucketView')
  },
  user: state.get('auth').get('user'),
	message: state.get('bitBucketRepo').get('message'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
  loadErr: state.get('bitBucketRepo').get('loadErr'),
  bitBucketList: state.get('bitBucketRepo').get('bitBucketList'),
  bitBucketView: state.get('bitBucketRepo').get('bitBucketView')
}))

@reduxForm({
  form: 'editRepo',
  enableReinitialize: true
})

export default class Dashboard extends Component {
  state = {
    loading: false,
    hideRepoListingAreaFlag: false,
    modalOpenFlag: false,
    openRepoFile: false,
	  editFileName: null,
    token: null,
    repoPath: null,
	  showMessageFlag: true
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
	  user: PropTypes.object,
	  message: PropTypes.string,
	  isLoad: PropTypes.bool,
	  loadErr: PropTypes.string,
    location: PropTypes.object,
    bitBucketList: PropTypes.array,
    bitBucketView: PropTypes.string
  };
  
  componentWillMount = () => {
    const { dispatch, location, user, history } = this.props;
    
    if (!user) {
	    dispatch(push('/'));
    }
    
    const params = getHashParams(location.hash);
    
    const validParamsFlag = params && Object.keys(params).length && params.access_token;
    
    if (validParamsFlag) {
      const token = params.access_token;
	
	    history.replace('/dashboard');
      
      this.setState({
        loading: true,
        token
      });
      
      dispatch(bitBucketListing({ token }))
        .then(() => this.setState({ loading: false }))
        .catch(() => this.setState({ loading: false }));
    }
    history.replace(`/dashboard`);
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
  
  getMd = (content) => md.render(content);
  
  getBitBucketData = async (e, href, type, displayName, repoPath) => {
    const { dispatch } = this.props;
    const { token } = this.state;
    
    const listData = Object.assign({}, {
      token,
      path: href.split('/src')[1]
    });
    
    this.setState({ loading: true });
    
    if (type === 'commit_directory') {
      await dispatch(bitBucketListing(listData));
    } else {
      await dispatch(bitBucketView(listData));
    }
    
    this.setState({
      loading: false,
      modalOpenFlag: type !== 'commit_directory',
      editFileName: type !== 'commit_directory' ? displayName : null,
      repoPath
    });
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
          onClick={ (e) => this.getBitBucketData(e, (href_1 + href_2), 'commit_directory', repo.path) }
        />);
    }
  };
  
  _editRepo = values => {
    const { dispatch } = this.props;
    const { token, editFileName } = this.state;
    
    const fileContent = values.get('editMDFile');
    
    const dataObject = {
	    token,
	    fileName: editFileName,
      fileContent
    };
    
	  this.setState({ loading: true });
    
    dispatch(updateBitBucketFile(dataObject))
	    .then(() => dispatch(bitBucketListing({ token })))
      .then(() => {
        this.setState({
		      loading: false,
		      modalOpenFlag: false,
		      openRepoFile: false
	      });
      })
      .catch(() => this.setState({ loading: false }))
  };
  
  isEditRepo = () => {
    this.setState({ openRepoFile: true });
  };
  
  modalClose = () => {
    const { modalOpenFlag } = this.state;
    
    this.setState({
      modalOpenFlag: !modalOpenFlag,
      openRepoFile: false
    });
  };
	
	modalDismiss = () => this.setState({ showMessageFlag: false });
	
  render () {
    const { isLoad, loadErr, bitBucketList = [], bitBucketView, handleSubmit, message } = this.props;
	  
    const {
	    loading, hideRepoListingAreaFlag, editFileName, modalOpenFlag, openRepoFile, token, showMessageFlag
	  } = this.state;
    
    const loadingCompleteFlag = !isLoad && !loadErr;
    const validBitBucketListFlag = loadingCompleteFlag && bitBucketList && Array.isArray(bitBucketList);
    
    if (isLoad && loadErr) {
      return (
        <div>
          <span style={{ color: 'red' }}>An Error Occurred : { loadErr }</span>
        </div>
      );
    }
    
    return (
      <div>
        {
	        message && showMessageFlag &&
          <Message onDismiss={this.modalDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
          </Message>
        }
        
        {
          !token &&
          <Button
            className='ui facebook button hand-pointer'
            style={{ marginTop: '-10px' }}
            role='button'
            onClick={ () => this.bitBucketConnect() }
          >
            <i aria-hidden='true' className='bitbucket icon' />Fetch Data From BitBucket
          </Button>
        }
        
        {
          !token &&
          <div className="row" style={{ marginTop: '20px' }}>
            Click on the "Fetch Data From BitBucket" button above to get access from BitBucket where you will
            need to login to grant access to "your" BitBucket repository
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
                  Click on the name/icon to view the contents. Click on the back icon to go back.
                </span>
              }
            </div>
            
            {
	            validBitBucketListFlag && !!bitBucketList.length && !hideRepoListingAreaFlag &&
              <div className="content">
                <List>
                  <List.Item as='a'>
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
                              <List.Item
                                as='a'
                                key={idx}
                                onClick={ (e) => this.getBitBucketData(
                                  e,
                                  repo.links.self.href,
                                  repo.type,
                                  repo.path.split('/').pop(),
                                  repo.path
                                ) }
                              >
                                <List.Icon
                                  size='large'
                                  verticalAlign='middle'
                                  name={ (repo.type === 'commit_directory') ? 'folder' : 'file' }
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
                <Loader active inline='centered'>Loading ...</Loader>
              </div>
            }
          </div>
        }
  
        {
	        !loading && loadingCompleteFlag &&
          <Modal
            open={ modalOpenFlag }
            dimmer="blurring"
            closeOnEscape={ true }
            closeOnDimmerClick={ false }
            onClose={this.modalClose}
            size="large"
            closeIcon
          >
            <Modal.Header>
              <Icon name='file' size='large' />
              <span style={{ marginLeft: '5px' }}>{ editFileName }</span>
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
              {
                !openRepoFile && bitBucketView &&
                <Markup htmlString= { this.getMd(bitBucketView) } />
              }
	            {
		            !openRepoFile && !bitBucketView &&
                <span style={{ color: 'red' }}>Error fetching content</span>
	            }
              {
                openRepoFile &&
                <Form>
                  <Field
                    name="editMDFile"
                    component={TextArea}
                    autoHeight
                  />
                </Form>
              }
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
	            {
		            openRepoFile &&
                <Button positive onClick={handleSubmit(this._editRepo)}>
                  <i aria-hidden='true' className='save icon' />Save
                </Button>
	            }
              {
                !openRepoFile &&
                <Button primary onClick={this.isEditRepo}>
                  <i aria-hidden='true' className='edit icon' />Edit
                </Button>
              }
              <Button
                primary
                content="Cancel"
                onClick={this.modalClose}
              />
            </Modal.Actions>
          </Modal>
        }
      </div>
    );
  }
}
