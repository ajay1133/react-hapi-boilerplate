import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { Button, List, Loader, Modal, Icon, Form, Message } from 'semantic-ui-react';
import config from '../../config';
import { getHashParams } from '../../utils/commonutils';
import TextBox from '../../components/Form/TextBox';
import TextArea from '../../components/Form/TextArea';
import { bitBucketListing, bitBucketView, updateBitBucketFile } from '../../redux/modules/bitBucketRepo';

const { bitBucket } = config;

const md = MarkDown({
  html: false,
  linkify: true,
  typographer: true
});

@connect(state => ({
  initialValues: state.get('bitBucketRepo').get('setFileFormInitialValues'),
  user: state.get('auth').get('user'),
  message: state.get('bitBucketRepo').get('message'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
  loadErr: state.get('bitBucketRepo').get('loadErr'),
  bitBucketList: state.get('bitBucketRepo').get('bitBucketList')
}))

@reduxForm({
  form: 'setFileForm',
  enableReinitialize: true
})

export default class Dashboard extends Component {
  state = {
    loading: false,
    hideRepoListingAreaFlag: false,
    modalOpenFlag: false,
    openRepoFile: false,
    fileName: null,
    fileContent: null,
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
	  initialValues: PropTypes.object
  };
  
  componentDidMount = () => {
    const { dispatch, location, history } = this.props;
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
    
    let res = null;
    const isLoadingDirectoryFlag = type === 'commit_directory';
    
    if (isLoadingDirectoryFlag) {
      res = await dispatch(bitBucketListing(listData));
    } else {
	    res = await dispatch(bitBucketView(listData));
    }
    
    this.setState({
      loading: false,
      modalOpenFlag: !isLoadingDirectoryFlag,
      fileName: !isLoadingDirectoryFlag ? displayName : null,
      fileContent: !isLoadingDirectoryFlag ? res.data :  null,
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
        />
      );
    }
  };
  
  setFile = values => {
    const { dispatch } = this.props;
    const { token, repoPath } = this.state;
    
    const fileName = values.get('fileName');
    const fileContent = values.get('fileContent');
    
    const dataObject = {
      token,
      fileName: fileName && repoPath ? repoPath + '/' + fileName : (fileName && !repoPath ? fileName : repoPath),
      fileContent
    };
    
    this.setState({ loading: true });
    
    dispatch(updateBitBucketFile(dataObject))
      .then(() => dispatch(bitBucketListing({ token })))
      .then(() => {
        this.setState({
          loading: false,
          modalOpenFlag: false,
          openRepoFile: false,
	        fileName: null,
	        fileContent: null
        });
      })
      .catch(() => this.setState({ loading: false }))
  };
	
	modalOpen = (addNewFileFlag = false) => {
	  const stateObject = { openRepoFile: true };
	  
	  if (addNewFileFlag) {
	    stateObject.modalOpenFlag = true;
    }
    
	  this.setState(stateObject);
	};
  
  modalClose = () => {
    const { modalOpenFlag } = this.state;
    
    this.setState({
      modalOpenFlag: !modalOpenFlag,
      openRepoFile: false,
	    fileName: null,
	    fileContent: null
    });
  };
  
  messageDismiss = () => this.setState({ showMessageFlag: false });
  
  render () {
    const { isLoad, loadErr, bitBucketList = [], handleSubmit, user, message, dispatch } = this.props;
    
    const {
      loading, hideRepoListingAreaFlag, fileName, fileContent, repoPath, modalOpenFlag, openRepoFile, token,
      showMessageFlag
    } = this.state;
    
    const errorOccurredFlag = !loading && (!user || (isLoad && loadErr));
    const loadingCompleteFlag = !isLoad && !loadErr;
    const validBitBucketListFlag = loadingCompleteFlag && bitBucketList && Array.isArray(bitBucketList);
    const isFileLoadedSuccessFlag = fileName;
    
    if (errorOccurredFlag) {
      return (
        <div>
	        { !user && dispatch(push('/')) }
          { user && <span style={{ color: 'red' }}>An Error Occurred : { loadErr }</span> }
        </div>
      );
    }
    
    return (
      <div>
        {
          message && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
          </Message>
        }
        
        {
          !token &&
          <Button
            color='facebook'
            onClick={ () => this.bitBucketConnect() }
          >
            <Icon name='bitbucket' /> Fetch Data From BitBucket
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
                  primary
                  style={{ float: 'right' }}
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
                        <span style={{ textAlign: 'center' }}>
                          { bitBucketList[0].path.split('/').slice(-2, -1)[0] || 'src' }
                        </span>
                        <Button
                          primary
                          style={{ float: 'right', marginTop: '-10px' }}
                          onClick={ () => this.modalOpen(true) }
                        >
                          Add File
                        </Button>
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
                                  name={ repo.type === 'commit_directory' ? 'folder' : 'file' }
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
              { fileName && <Icon name='file' size='large' /> }
              <span style={{ marginLeft: '5px' }}>{ fileName || 'Add File' }</span>
            </Modal.Header>
            <Modal.Content>
              <Modal.Description>
                {
                  !openRepoFile && isFileLoadedSuccessFlag &&
                  <Markup htmlString= { this.getMd(fileContent) } />
                }
                {
                  !openRepoFile && !isFileLoadedSuccessFlag &&
                  <span style={{ color: 'red' }}>Error fetching content</span>
                }
                {
                  openRepoFile && isFileLoadedSuccessFlag &&
                  <Form>
                    <Field
                      name="fileContent"
                      component={TextArea}
                      autoHeight
                    />
                  </Form>
                }
                {
	                openRepoFile && !isFileLoadedSuccessFlag &&
                  <Form>
                    <div className="field">
                      <div className="row">
                        <div className="col-4">
                          <strong>File Path</strong>
                        </div>
                        <div className="col-8">
				                  { repoPath ? `${repoPath}/` : '/' }
                        </div>
                      </div>
                    </div>
	                  <Field
                      name="fileName"
                      label="File Name"
                      component={TextBox}
                      placeholder="Enter File Name"
                    />
                    <Field
                      name="fileContent"
                      label="File Content"
                      component={TextArea}
                      placeholder="Enter File Content"
                      autoHeight
                    />
                  </Form>
                }
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              {
                openRepoFile &&
                <Button positive onClick={handleSubmit(this.setFile)}>
                  <i aria-hidden='true' className='save icon' />Save
                </Button>
              }
              {
                !openRepoFile &&
                <Button primary onClick={this.modalOpen}>
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
