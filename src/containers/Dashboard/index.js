import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { List, Grid } from 'semantic-ui-react';
import { bitBucketListing } from '../../redux/modules/bitBucketRepo';

@connect(state => ({
	initialValues: state.get('bitBucketRepo').get('bitBucketInitialValues'),
	message: state.get('bitBucketRepo').get('message'),
  isLoad: state.get('bitBucketRepo').get('isLoad'),
  loadErr: state.get('bitBucketRepo').get('loadErr'),
  bitBucketList: state.get('bitBucketRepo').get('bitBucketList')
}))
@reduxForm({
  form: 'bitBucketForm',
  enableReinitialize: true
})
export default class Dashboard extends Component {
  state = {
    loading: true
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    message: PropTypes.string,
    isLoad: PropTypes.bool,
    loadErr: PropTypes.string,
    bitBucketList: PropTypes.array
  };
	
  componentDidMount = () => {
    const { dispatch } = this.props;
    const params = {
      path: '/master/content/blog'
    };
    return dispatch(bitBucketListing(params));
  };
 
  render () {
    const { bitBucketList = [] } = this.props;
    
    return (
      <div>
		      <div className="ui card fluid cardShadow">
			      <div className="content pageMainTitle">
				      <Grid>
					      <div className="ui left floated column innerAdjust">
						      <h3 className="mainHeading"> Dashboard</h3>
					      </div>
					      <Grid.Row>
							      <Grid.Column>
									      <div className="content">
										      <List>
											      <List.Item>
												      <List.Content>
													      <List.List>
														      {
															      bitBucketList.map((repo, idx) => {
																      return (
																	      <List.Item
																		      as='a'
																		      key={idx}
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
							      </Grid.Column>
					      </Grid.Row>
				      </Grid>
			      </div>
		      </div>
      </div>
    );
  }
}
