import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';
import {Grid, Message, Loader, Tab, Card, Header} from  'semantic-ui-react';
import {Button, Form} from 'semantic-ui-react';
import {TextBox, TextArea} from '../../components/Form';
import { required, email, normalizePhone, url, passwordValidator } from '../../utils/validations';
import { strictValidObjectWithKeys, typeCastToString } from '../../utils/commonutils';
import { verifyUser } from '../../redux/modules/auth';
import {updateUserProfile} from '../../redux/modules/account';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import _ from 'lodash';
import '../../style/css/style.css';

const tabs = [
	'profileDetails',
	'userServices',
	'password'
];

const profileDetailsFormKeys = [
	'title',
	'firstName',
	'lastName',
	'email',
	'phone',
	'url',
	'description'
];

const userServicesFormKeys = [
	'treatmentType',
	'typeOfServices',
	'levelOfCare',
	'treatmentFocus'
];

const passwordFormKeys = [
	'password',
	'confirmPassword'
];

const selector = formValueSelector('profileForm');

@connect(state => ({
  initialValues: (strictValidObjectWithKeys(state.get('auth').get('user')) && state.get('auth').get('user')) || {},
	user: state.get('auth').get('user'),
	isLoad: state.get('auth').get('isLoad'),
	loadErr: state.get('auth').get('loadErr'),
	accountMsg: state.get('account').get('accountMsg'),
	accountErr: state.get('account').get('accountErr'),
	treatmentType: selector(state, 'treatmentType'),
	typeOfServices: selector(state, 'typeOfServices'),
	levelOfCare: selector(state, 'levelOfCare'),
	treatmentFocus: selector(state, 'treatmentFocus'),
	currentPassword: selector(state, 'currentPassword'),
}))
@reduxForm({
	form: 'profileForm',
	enableReinitialize: true
})
export default class Profile extends Component {
	static propTypes = {
		dispatch: PropTypes.func,
		handleSubmit: PropTypes.func,
		user: PropTypes.object,
		loadErr: PropTypes.string,
		isLoad: PropTypes.bool,
		accountMsg: PropTypes.string,
		accountErr: PropTypes.string,
		error: PropTypes.string
	};
	
	static defaultProps = {
		dispatch: null,
		handleSubmit: null,
	};
	
	state = {
		loading: false,
		showMessageFlag: true,
		treatmentTypeArr: [],
		typeOfServicesArr: [],
		levelOfCareArr: [],
		treatmentFocusArr: [],
		userVerifiedFlag: false,
		activeTab: 'profileDetails'
	};
	
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	};
	
	messageDismiss = () => this.setState({showMessageFlag: false});
	
	addRemoveInput = (e, action, type, idx) => {
		e.preventDefault();
		
		const {treatmentType, typeOfServices, levelOfCare, treatmentFocus} = this.props;
		const {treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr} = this.state;
		
		if (type === 1) {
			(action === 'add' && treatmentType)
				? treatmentTypeArr.push(treatmentType)
				: treatmentTypeArr.splice(idx, 1);
			this.setState({treatmentTypeArr});
			this.props.change('treatmentType', '');
		} else if (type === 2) {
			(action === 'add' && typeOfServices)
				? typeOfServicesArr.push(typeOfServices)
				: typeOfServicesArr.splice(idx, 1);
			this.setState({typeOfServicesArr});
			this.props.change('typeOfServices', '');
		} else if (type === 3) {
			(action === 'add' && levelOfCare)
				? levelOfCareArr.push(levelOfCare)
				: levelOfCareArr.splice(idx, 1);
			this.setState({levelOfCareArr});
			this.props.change('levelOfCare', '');
		} else if (type === 4) {
			(action === 'add' && treatmentFocus)
				? treatmentFocusArr.push(treatmentFocus)
				: treatmentFocusArr.splice(idx, 1);
			this.setState({treatmentFocusArr});
			this.props.change('treatmentFocus', '');
		}
	};

	getProfileTabsSection = () => {
  	return (
		  <Grid>
			  <Grid.Row>
				  <Grid.Column computer="10">
					  <Header size='medium'>Profile Details</Header>
					  <Grid>
						  <Grid.Row columns={2}>
							  <Grid.Column>
								  <Field
									  name="title"
									  placeholder="Title"
									  component={TextBox}
									  validate={required}
								  />
							  </Grid.Column>
							  <Grid.Column>
								  <Field
									  name="firstName"
									  placeholder="First Name"
									  component={TextBox}
									  validate={required}
								  />
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row columns={2}>
							  <Grid.Column>
								  <Field
									  name="lastName"
									  placeholder="Last Name"
									  component={TextBox}
								  />
							  </Grid.Column>
							  <Grid.Column>
								  <Field
									  name="email"
									  placeholder="Email"
									  component={TextBox}
									  validate={email}
								  />
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row >
							  <Grid.Column computer="8">
								  <Field
									  name="phone"
									  placeholder="Phone Number"
									  component={TextBox}
									  normalize={ normalizePhone }
								  />
							  </Grid.Column>
							  <Grid.Column computer="8">
								  <Field
									  name="url"
									  placeholder="Website Url"
									  component={TextBox}
									  validate={url}
								  />
							  </Grid.Column>
						  </Grid.Row>
					  </Grid>
				  </Grid.Column>
			  </Grid.Row>
		  </Grid>
		);
	};
	
	getUserServicesSection = () => {
  	const { handleSubmit } = this.props;
		const {treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr} = this.state;
		
		return (
	    <Form onSubmit={ handleSubmit(this.handleSubmit) }>
		    <Grid>
			    <Grid.Row columns={2} className="serviceListing">
				    <Grid.Column className="mb-20">
					    <Form.Group>
						    <Field
							    label='Treatment Type'
							    name="treatmentType"
							    placeholder="add content"
							    component={TextBox}
						    />
					    </Form.Group>
					    <Button
						    icon='add'
						    onClick={(e) => this.addRemoveInput(e, 'add', 1)}
					    />
					    {
						    treatmentTypeArr && treatmentTypeArr.map((val, idx) => {
							    return (
								    <Form.Group className="deleteContent" key={idx}>
									    <label className="m-10">{ val } </label>
									    <Button icon='minus'
									            onClick={(e) => this.addRemoveInput(e, 'remove', 1, idx)}/>
								    </Form.Group>
							    );
						    })
					    }
				    </Grid.Column>
				    <Grid.Column>
					    <Form.Group>
						    <Field
							    label='Type of Services'
							    name="typeOfServices"
							    placeholder="add content"
							    component={TextBox}
						    />
					
					    </Form.Group>
					    <Button
						    icon='add'
						    onClick={(e) => this.addRemoveInput(e, 'add', 2)}
					    />
					    {
						    typeOfServicesArr && typeOfServicesArr.map((val, idx) => {
							    return (
								    <Form.Group key={idx}>
									    <label className="m-10">{ val } </label>
									    <Button icon='minus'
									            onClick={(e) => this.addRemoveInput(e, 'remove', 2, idx)}/>
								    </Form.Group>
							    );
						    })
					    }
				    </Grid.Column>
				    <Grid.Column>
					    <Form.Group>
						    <Field
							    label='Level of care'
							    name="levelOfCare"
							    placeholder="add content"
							    component={TextBox}
						    />
					    </Form.Group>
					    <Button
						    icon='add'
						    onClick={(e) => this.addRemoveInput(e, 'add', 3)}
					    />
					    {
						    levelOfCareArr && levelOfCareArr.map((val, idx) => {
							    return (
								    <Form.Group key={idx}>
									    <label className="m-10">{ val } </label>
									    <Button icon='minus'
									            onClick={(e) => this.addRemoveInput(e, 'remove', 3, idx)}/>
								    </Form.Group>
							    );
						    })
					    }
				    </Grid.Column>
				    <Grid.Column>
					    <Form.Group>
						    <Field
							    label='Treatment Focus'
							    name="treatmentFocus"
							    placeholder="add content"
							    component={TextBox}
						    />
					
					    </Form.Group>
					    <Button
						    icon='add'
						    onClick={(e) => this.addRemoveInput(e, 'add', 4)}
					    />
					    {
						    treatmentFocusArr && treatmentFocusArr.map((val, idx) => {
							    return (
								    <Form.Group key={idx}>
									    <label className="m-10">{ val } </label>
									    <Button icon='minus' onClick={(e) => this.addRemoveInput(e, 'remove', 4, idx)}/>
								    </Form.Group>
							    );
						    })
					    }
				    </Grid.Column>
			    </Grid.Row>
	      </Grid>
		    <Button type="submit" primary className="updated">Update Services</Button>
	    </Form>
		);
	};
	
	getPasswordSection = () => {
  	const { handleSubmit } = this.props;
  	const { userVerifiedFlag } = this.state;
  	
		return (
	    <Form onSubmit={ handleSubmit(this.handleSubmit) }>
		    <Form.Group>
		      {
			      !userVerifiedFlag &&
				    <Field
					    name="currentPassword"
					    placeholder="Verify Your Password"
					    type="password"
					    component={TextBox}
				    />
		      }
		      {
			      !userVerifiedFlag &&
			      <Button type="submit" primary style={{ float: 'right', backgroundColor: '#356afa' }}>
				      Verify
			      </Button>
		      }
		      {
			      userVerifiedFlag &&
			      <Field
				      name="password"
				      placeholder="Enter New Password"
				      type="password"
				      component={TextBox}
				      validate={passwordValidator}
			      />
		      }
		      {
			      userVerifiedFlag &&
			      <Field
				      name="confirmPassword"
				      placeholder="Confirm New Password"
				      type="password"
				      component={TextBox}
				      validate={passwordValidator}
			      />
		      }
		      {
			      userVerifiedFlag &&
			      <Button type="submit" primary style={{ float: 'right', backgroundColor: '#356afa' }}>
				      Change Password
			      </Button>
		      }
	      </Form.Group>
	    </Form>
		);
	};
	
	renderTabs = () => {
		const { handleSubmit } = this.props;
  	const { activeTab } = this.state;
	  const activeIndex = tabs.indexOf(activeTab) >= -1 ? tabs.indexOf(activeTab) : 0;
	  
		const tabContent = {
			profileDetails: this.getProfileTabsSection(),
			userServices: this.getUserServicesSection(),
			password: this.getPasswordSection()
		};

		const descContent = (
			<Grid>
				<Grid.Row >
					<Grid.Column computer="16">
						<Header size='medium'>Description About me</Header>
						<Field
							name="description"
							placeholder="Description"
							component={TextArea}
							autoHeight
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
  
		const pane = (type) => {
			if (type === 'profileDetails') {
				return (
					<Form onSubmit={ handleSubmit(this.handleSubmit) }>
						<div className="editContent">
							<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
							<Tab.Pane attached={ false }>{ descContent }</Tab.Pane>
						</div>
						<Button type="submit" primary className='updated'>Update Profile</Button>
					</Form>
				);
			} else {
				return (
					<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
				);
			}
		};
		
		const panes = [
			{
        menuItem: {
        	key: 'profileDetails',
	        icon: 'user',
	        content: 'PROFILE DETAILS',
	        onClick: () => this.handleTabClick('profileDetails')
        },
				render: () => pane('profileDetails')
			},
			{
        menuItem: {
        	key: 'userServices',
	        icon: 'sign language',
	        content: 'USER SERVICES',
	        onClick: () => this.handleTabClick('userServices')
        },
				render: () => pane('userServices')
			},
			{
        menuItem: {
        	key: 'password',
	        icon: 'key',
	        content: 'CHANGE PASSWORD',
	        onClick: () => this.handleTabClick('password')
        },
				render: () => pane('password')
			},
		];

		return (
			<Tab
				menu={{secondary: true, pointing: true}}
				panes={ panes }
        activeIndex={activeIndex}
			/>
		);
	};

  handleTabClick = (activeTab) => {
  	this.setState({ activeTab });
  	
  	if (activeTab === 'password') {
		  this.setState({ userVerifiedFlag: false });
		  this.props.change('currentPassword', '');
	  }
  };
  
	handleSubmit = async(data) => {
		const {dispatch} = this.props;
	  const { userVerifiedFlag, activeTab } = this.state;
		
		this.setState({ loading: true });
		this.props.change('_error', null);
		
		const dataObj = (strictValidObjectWithKeys(data.toJSON()) && data.toJSON()) || {};
		
	  try {
		  if (strictValidObjectWithKeys(dataObj)) {
			  let formData = {};
			
			  if (activeTab === 'password' && !userVerifiedFlag) {
				  const res = await this.handleVerifyUser();
				  if (!res) {
					  throw new SubmissionError({
						  _error: 'User verification failed'
					  });
				  }
				  this.setState({ loading: false });
				  return;
			  } else if (activeTab === 'password' && userVerifiedFlag) {
				  const validPasswordFlag = dataObj.password === dataObj.confirmPassword &&
					  !passwordValidator(dataObj.password);
				
				  if (!validPasswordFlag) {
					  throw new SubmissionError({
						  _error: passwordValidator(dataObj.password) || 'Password & Confirm Password do not match'
					  });
				  }
				
				  formData = { password: _.pick(dataObj, passwordFormKeys) };
			  } else if (activeTab === 'profileDetails') {
				  formData = {
					  profileDetails: _.pick(dataObj, profileDetailsFormKeys)
				  };
			  } else if (activeTab === 'userServices') {
				  formData = {
					  userServices: _.pick(dataObj, userServicesFormKeys)
				  };
			  }
			
			  this.setState({ loading: true });
			  await dispatch(updateUserProfile(formData));
			  this.handleTabClick(activeTab);
			  this.setState({ loading: false });
		  } else {
			  throw new SubmissionError({ _error: 'Invalid data object' });
		  }
	  } catch (e) {
		  if (!userVerifiedFlag) {
		  	this.handleTabClick(activeTab);
		  } else {
		  	this.setState({ activeTab });
		  }
		  
	  	this.setState({ loading: false });
		  
		  throw new SubmissionError({
			  _error: activeTab === 'password'
				  ? (userVerifiedFlag ? (passwordValidator(dataObj.password) || 'Password & Confirm Password do not match')
						  : 'User verification failed')
				  : typeCastToString(e) || 'Error updating profile'
		  });
	  }
  };
	
	handleVerifyUser = async () => {
		const { dispatch, currentPassword, user } = this.props;
		
		try {
			const res = await dispatch(verifyUser(user.email, currentPassword));
			const areUsersSameFlag = strictValidObjectWithKeys(res) && strictValidObjectWithKeys(res.user) &&
				res.user.id === user.id;
			this.setState({ userVerifiedFlag: areUsersSameFlag });
			return areUsersSameFlag;
		} catch (e) {
			return false;
		}
	};
	
	render() {
    const { isLoad, loadErr, accountMsg, error } = this.props;
		const {loading, showMessageFlag} = this.state;

		const loadingCompleteFlag = !isLoad && !loading;

		return (
			<AuthenticatedUser>
				{
	        accountMsg && showMessageFlag &&
	        <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ accountMsg }</span>
	        </Message>
				}
				{
	        (loadErr || error) && showMessageFlag &&
	        <Message onDismiss={this.messageDismiss}>
		        <span style={{ color: 'red' }}>{ loadErr || typeCastToString(error) }</span>
	        </Message>
				}

				<Grid>
					<div className="ui left floated column innerAdjust">
						<h3 className="mainHeading"> Profile</h3>
					</div>
					<Grid.Row>
						<Grid.Column mobile={16} tablet={8} computer={12}>
              { !loadingCompleteFlag && <Loader active inline='centered'>Loading...</Loader> }
              { loadingCompleteFlag && this.renderTabs() }
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</AuthenticatedUser>
		);
	}
}
