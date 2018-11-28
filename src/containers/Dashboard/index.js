import React, { Component } from 'react';
import MarkDown from 'markdown-it';
import Markup from 'react-html-markup';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { Button, Table, Loader, Modal, Icon, Message, Grid } from 'semantic-ui-react';
import AddFile from '../../components/File/AddFile';
import EditFile from '../../components/File/EditFile';
import {
	bitBucketListing,
	bitBucketView,
	updateBitBucketFile,
	resetBitBucketFileForm
} from '../../redux/modules/bitBucketRepo';
import { strictValidObjectWithKeys } from '../../utils/commonutils';
import { ACCESSIBLE_ROOT_PATH, REPO_PATH } from '../../utils/constants';

const md = MarkDown({
  html: false,
  linkify: true,
  typographer: true
});

@connect(state => ({
	initialValues: state.get('bitBucketRepo').get('bitBucketInitialValues'),
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
    loading: true,
    modalOpenFlag: false,
    openRepoFile: false,
    fileName: null,
    fileContent: null,
    href: null,
    repoPath: null,
    showMessageFlag: true
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    user: PropTypes.oneOfType([
    	PropTypes.string,
	    PropTypes.object
    ]),
    message: PropTypes.string,
    isLoad: PropTypes.bool,
    loadErr: PropTypes.string,
    location: PropTypes.object,
	  bitBucketList: PropTypes.array
  };
	
	constructor(props) {
		super(props);
		this.saveAccount = this.getBitBucketData.bind(this);
	};
	
  componentDidMount = async () => {
    const { dispatch } = this.props;
    const params = { path: ACCESSIBLE_ROOT_PATH };
    await dispatch(bitBucketListing(params));
    this.setState({ loading: false });
  };
 
  
  getMd = (content) => {
  	try {
		  return md.render(content);
	  } catch (error) {
  		console.log('Error in rendering file: ', error);
  		return null;
	  }
  };
  
  getBitBucketData = async (e, href, type, displayName, repoPath) => {
    const { dispatch } = this.props;
	  
    const params = Object.assign({}, {
      path: (href && typeof href === 'string' && href.split('/src')[1]) || ACCESSIBLE_ROOT_PATH
    });
	  
    this.setState({ loading: true });
    
    let res = null;
    const isLoadingDirectoryFlag = type === 'commit_directory';
    
    if (isLoadingDirectoryFlag) {
      res = await dispatch(bitBucketListing(params));
    } else {
	    res = await dispatch(bitBucketView(params));
    }
    
    this.setState({
      loading: false,
      modalOpenFlag: !isLoadingDirectoryFlag,
      fileName: !isLoadingDirectoryFlag ? displayName : null,
      fileContent: !isLoadingDirectoryFlag && res.data ? res.data : null,
      href,
      repoPath
    });
  };
	
  setFile = values => {
    const { dispatch } = this.props;
    const { href, repoPath } = this.state;
    
    const formValues = values.toJSON();
    
    const { fileName = '' } = formValues;
    
    const basePath = repoPath || REPO_PATH;
    
    const dataObject = {
      path: fileName && basePath ? basePath + '/' + fileName : (fileName && !basePath ? fileName : basePath),
      content: this.compileFormFieldsToMarkDown(formValues),
      type: 2
    };
    
    this.setState({ loading: true });
		
    const params = Object.assign({}, {
			path: (href && typeof href === 'string' && href.split('/src')[1]) || ACCESSIBLE_ROOT_PATH
		});
    
    dispatch(updateBitBucketFile(dataObject))
	    .then(() => dispatch(bitBucketListing(params)))
      .then(async (resp) => {
	      const isLoadingDirectoryFlag = !!fileName;
	      let res = null;
	      
	      if (!isLoadingDirectoryFlag) {
		      res = await dispatch(bitBucketView(params));
	      }
	      
	      this.setState({
		      loading: false,
		      modalOpenFlag: !isLoadingDirectoryFlag,
		      fileName: !isLoadingDirectoryFlag ? this.state.fileName : null,
		      fileContent: !isLoadingDirectoryFlag && res.data ? res.data : null
	      });
      })
      .catch(() => this.setState({ loading: false }))
  };
	
	compileFormFieldsToMarkDown = (dataObj) => {
	  const metaDataVariablesList = ['title', 'image', 'description', 'draft'];
	
	  const extraMetaDataKeys = Object.keys(dataObj)
	                                  .filter(k => k !== 'content' && metaDataVariablesList.indexOf(k) <= -1);
    const validMetaDataKeys = Object.keys(dataObj)
                                    .filter(k => metaDataVariablesList.indexOf(k) > -1);
		
    let mdStr = '---\n';
	
	  validMetaDataKeys
		  .forEach(k => {
        mdStr += `${k} : ${dataObj[k].toString()}\n`;
      });
	  
	  extraMetaDataKeys.forEach(k => {
		  mdStr += `${k} : ${dataObj[k]}\n`;
	  });
	
	  mdStr += '---\n';
   
	  if (dataObj.content) {
		  mdStr += dataObj.content.trim();
	  }
	  
	  return mdStr;
  };
  
	modalOpen = async (addNewFileFlag) => {
		const { dispatch } = this.props;
		const stateObject = { openRepoFile: true };
		
	  if (addNewFileFlag) {
	    stateObject.modalOpenFlag = true;
		  this.setState({ loading: true });
		  await dispatch(resetBitBucketFileForm());
		  this.setState({ loading: false });
    }
    
	  this.setState(stateObject);
	};
  
  modalClose = () => {
    this.setState({
      modalOpenFlag: false,
      openRepoFile: false,
	    fileName: null,
	    fileContent: null,
	    href: null,
	    repoPath: null
    });
  };

  
  messageDismiss = () => this.setState({ showMessageFlag: false });
  
  render () {
    const { isLoad, loadErr, bitBucketList = [], handleSubmit, user, message, initialValues } = this.props;
    const { loading, fileName, fileContent, repoPath, modalOpenFlag, openRepoFile, showMessageFlag } = this.state;
	
	  const isValidUserFlag = strictValidObjectWithKeys(user) && !!user.id;
    const errorOccurredFlag = !loading && !isLoad && !isValidUserFlag;
    const loadingCompleteFlag = !isLoad;
    const validBitBucketListFlag = loadingCompleteFlag && Array.isArray(bitBucketList) && bitBucketList.length;
    const isFileLoadedSuccessFlag = !!fileName;
	  
    if (errorOccurredFlag) {
      return (
        <div>
          <span style={{ color: 'red' }}>Session Expired</span>
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
	        loadErr && showMessageFlag && !modalOpenFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr }</span>
          </Message>
        }
	
	      <div className="ui card fluid cardShadow">
		      <div className="content pageMainTitle">
			      <Grid>
				      <div className="ui left floated column innerAdjust">
					      <h3 className="mainHeading"> Dashboard</h3>
				      </div>
				      <Grid.Row>
					      <Grid.Column>
						      <h4>
							      { loadingCompleteFlag ? 'Listing' : 'Loading' } Files From BitBucket Repository
							      {
								      loadingCompleteFlag &&
								      <Button
									      primary
									      style={{ float: 'right', marginTop: '-10px' }}
									      onClick={ () => this.modalOpen(true) }
								      >
									      Add File
								      </Button>
							      }
						      </h4>
						
						      {
							      validBitBucketListFlag &&
							      <div className="content" style={{ marginTop: '10px' }}>
								      <Table celled>
									      <Table.Header>
										      <Table.Row>
											      <Table.HeaderCell>File Name</Table.HeaderCell>
											      <Table.HeaderCell><span style={{ float: 'right' }}>Action</span></Table.HeaderCell>
										      </Table.Row>
									      </Table.Header>
									      <Table.Body>
										      {
											      bitBucketList.map((repo, idx) => {
												      return (
													      <Table.Row
														      key={idx}
														      onClick={ (e) => this.getBitBucketData(
															      e,
															      repo.links.self.href,
															      repo.type,
															      repo.path.split('/').pop(),
															      repo.path
														      ) }
													      >
														      <Table.Cell>
															      { repo.path.split('/').pop() }
														      </Table.Cell>
														      <Table.Cell>
															      <Icon
																      name="eye"
																      style={{ float: 'right' }}
																      onClick={ (e) => this.getBitBucketData(
																	      e,
																	      repo.links.self.href,
																	      repo.type,
																	      repo.path.split('/').pop(),
																	      repo.path
																      ) }/>
														      </Table.Cell>
													      </Table.Row>
												      );
											      })
										      }
									      </Table.Body>
								      </Table>
							      </div>
						      }
						
						      {
							      loadingCompleteFlag && !validBitBucketListFlag &&
							      <div className="content">
								      <span style={{ color: 'red' }}>{ 'Error loading directory' }</span>
							      </div>
						      }
						
						      {
							      !loadingCompleteFlag &&
							      <div className="content">
								      <Loader active inline='centered'>Loading ...</Loader>
							      </div>
						      }
					      </Grid.Column>
				      </Grid.Row>
			      </Grid>
		      </div>
	      </div>
	      
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
	            {
		            loadErr && showMessageFlag &&
		            <Message onDismiss={this.messageDismiss}>
			            <span style={{ color: 'red' }}>{ loadErr }</span>
		            </Message>
	            }
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
                  <EditFile initialValues={initialValues.toJSON() || []} />
                }
                {
	                openRepoFile && !isFileLoadedSuccessFlag &&
                  <AddFile repoPath={repoPath} />
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
                <Button primary onClick={ () => this.modalOpen(false) }>
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

