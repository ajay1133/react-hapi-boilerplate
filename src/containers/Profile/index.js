import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';
import {Grid, Message, Loader, Tab, Header} from  'semantic-ui-react';
import {Button, Form} from 'semantic-ui-react';
import {TextBox, TextArea} from '../../components/Form';
import { required, email, normalizePhone, url, passwordValidator } from '../../utils/validations';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidArrayWithLength,
	validObjectWithParameterKeys
} from '../../utils/commonutils';
import {DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES} from '../../utils/constants';
import { verifyUser } from '../../redux/modules/auth';
import { loadUserServices, updateUserProfile } from '../../redux/modules/account';
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

const passwordFormKeys = [
	'password',
	'confirmPassword'
];

const selector = formValueSelector('profileForm');

@connect(state => ({
  initialValues: Object.assign(
  	{},
	  (strictValidObjectWithKeys(state.get('auth').get('user')) && state.get('auth').get('user')) || {},
	  state.get('account').get('userServices') || {}
  ),
	user: state.get('auth').get('user'),
	isLoad: state.get('auth').get('isLoad'),
	loadErr: state.get('auth').get('loadErr'),
	accountMsg: state.get('account').get('accountMsg'),
	accountErr: state.get('account').get('accountErr'),
	serviceTypes: state.get('account').get('serviceTypes'),
	userServices: state.get('account').get('userServices'),
	currentPassword: selector(state, 'currentPassword'),
	serviceTypesValuesList: (
		selector(state, 'serviceType') &&
		strictValidObjectWithKeys(selector(state, 'serviceType')) &&
		selector(state, 'serviceType').toJSON()) || []
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
		error: PropTypes.string,
		serviceTypes: PropTypes.array,
		userServices: PropTypes.array,
		serviceTypesValuesList: PropTypes.array
	};
	
	static defaultProps = {
		dispatch: null,
		handleSubmit: null,
	};
	
	state = {
		loading: true,
		showMessageFlag: true,
		userVerifiedFlag: false,
		activeTab: 'profileDetails',
		serviceTypesFieldArray: [],
		serviceErrorStr: null
	};
	
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	};
	
	componentDidMount = async () => {
		const { dispatch } = this.props;
		try {
			const res = await dispatch(loadUserServices());
			
			if (strictValidObjectWithKeys(res)) {
				const { userServices } = res;
				const serviceTypesValuesList = [];
				
				userServices.forEach(service => {
					const indexOfServiceType = service.serviceTypesId - 1;
					if (!(indexOfServiceType in serviceTypesValuesList)) {
						serviceTypesValuesList[indexOfServiceType] = [];
					}
					serviceTypesValuesList[indexOfServiceType].push(service.name);
				});
				
				this.props.change('serviceType', serviceTypesValuesList);
				this.setState({ serviceTypesFieldArray: serviceTypesValuesList });
			}
			
			this.setState({ loading: false });
		} catch (e) {
			this.setState({ loading: false });
		}
	};
	
	messageDismiss = () => this.setState({showMessageFlag: false});
	
	addRemoveInput = async (e, action, serviceTypeIndex, idx) => {
		const { serviceTypes = [], serviceTypesValuesList } = this.props;
		let { serviceTypesFieldArray } = this.state;
		
		if (!(serviceTypeIndex in serviceTypes)) {
			return false;
		}
		
		let serviceErrorStr = null;
		
		if (action === 'add') {
			const newServiceToAdd = serviceTypesValuesList[serviceTypeIndex];
			if (!(serviceTypeIndex in serviceTypesFieldArray)) {
				serviceTypesFieldArray[serviceTypeIndex] = [];
			}
			
			const servicesData = strictValidArrayWithLength(serviceTypesFieldArray) &&
			serviceTypeIndex in serviceTypesFieldArray ? serviceTypesFieldArray[serviceTypeIndex] : [];
			
			const isValidNewServiceFlag = !!newServiceToAdd && !servicesData.filter(s => s === newServiceToAdd).length;
			
			if (isValidNewServiceFlag) {
				serviceTypesFieldArray[serviceTypeIndex].push(newServiceToAdd);
			} else {
				if (!newServiceToAdd) {
					serviceErrorStr = 'Service cannot be empty';
				} else if (!!servicesData.filter(s => s === newServiceToAdd).length) {
					serviceErrorStr = 'Service already exists';
				}
			}
		} else if (action === 'remove') {
			if (!(idx in serviceTypesFieldArray[serviceTypeIndex])) {
				return false;
			}
			serviceTypesFieldArray[serviceTypeIndex].splice(idx, 1);
		}
		
		this.setState({
			serviceTypesFieldArray,
			serviceErrorStr
		});
		
		setTimeout(() => this.setState({ serviceErrorStr: null }), DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
		this.props.change('serviceType', []);
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
  	const { serviceTypes = [] } = this.props;
  	const { serviceTypesFieldArray, serviceErrorStr } = this.state;
		
  	const renderServiceTypesSection = strictValidArrayWithLength(serviceTypes) &&
		  serviceTypes.map((serviceType, idx) => {
			  const secondLastOrLastIdx = (!(serviceTypes.length % 2) && idx >= serviceTypes.length - 2) ||
				  (!!(serviceTypes.length % 2) && idx === serviceTypes.length - 1);
			
			  if (!validObjectWithParameterKeys(serviceType, ['name'])) {
			  	return (
			  		<Grid.Column></Grid.Column>
				  );
			  }
			  
			  const validServiceFlag = strictValidArrayWithLength(serviceTypesFieldArray) &&
				  idx in serviceTypesFieldArray && strictValidArrayWithLength(serviceTypesFieldArray[idx]);
			  
			  return (
				  <Grid.Column className={ secondLastOrLastIdx ? 'mb-20' : '' }>
					  <Form.Group>
						  <Field
							  label={ serviceType.name }
							  name={ `serviceType[${idx}]` }
							  placeholder="Add Service"
							  component={TextBox}
						  />
					  </Form.Group>
					  <Button type="button" icon='add' onClick={(e) => this.addRemoveInput(e, 'add', idx)} />
					  {
						  validServiceFlag &&
						  serviceTypesFieldArray[idx].map((v, k) => {
							  return (
								  <Form.Group className="deleteContent" key={k}>
									  <label className="m-10">{v}</label>
									  <Button type="button" icon='minus' onClick={(e) => this.addRemoveInput(e, 'remove', idx, k)}/>
								  </Form.Group>
							  );
						  })
					  }
				  </Grid.Column>
			  );
	  });
  	
		return (
			<Grid>
				<Grid.Column computer="10">
					<Header size='medium'>User Services</Header>
					<Grid>
						{
							!strictValidArrayWithLength(serviceTypes) &&
							<Grid.Row columns={1} className="serviceListing">
								<Grid.Column>
									<span style={{ color: 'red' }}>No Service Types Found</span>
								</Grid.Column>
							</Grid.Row>
						}
						{
							serviceErrorStr &&
							<Grid.Row columns={1} className="serviceListing">
								<Grid.Column>
									<span style={{ color: 'red' }}>{ serviceErrorStr }</span>
								</Grid.Column>
							</Grid.Row>
						}
						{
							strictValidArrayWithLength(serviceTypes) &&
							<Grid.Row columns={2} className="serviceListing">
								{ renderServiceTypesSection }
							</Grid.Row>
						}
					</Grid>
				</Grid.Column>
			</Grid>
		);
	};
	
	getPasswordSection = () => {
  	const { userVerifiedFlag } = this.state;
  	
		return (
			<Grid>
				<Grid.Column computer="10">
					<Header size='medium'>Password</Header>
					<Grid>
						<Grid.Row columns={ userVerifiedFlag ? 2 : 1 } className="serviceListing">
							{
								!userVerifiedFlag &&
								<Grid.Column>
									<Field
										name="currentPassword"
										placeholder="Verify Your Current Password"
										type="password"
										component={TextBox}
									/>
								</Grid.Column>
							}
							{
								userVerifiedFlag &&
								<Grid.Column>
									<Field
										name="password"
										placeholder="Enter New Password"
										type="password"
										component={TextBox}
										validate={passwordValidator}
									/>
								</Grid.Column>
							}
							{
								userVerifiedFlag &&
								<Grid.Column>
									<Field
										name="confirmPassword"
										placeholder="Confirm New Password"
										type="password"
										component={TextBox}
										validate={required}
									/>
								</Grid.Column>
							}
						</Grid.Row>
					</Grid>
				</Grid.Column>
			</Grid>
		);
	};
	
	renderTabs = () => {
		const { handleSubmit } = this.props;
  	const { activeTab, userVerifiedFlag } = this.state;
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
			let contentSection = <div></div>;
			let buttonContent = null;
			
			switch (type) {
				case 'profileDetails':
					contentSection = (
						<div className="editContent">
							<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
							<Tab.Pane attached={ false }>{ descContent }</Tab.Pane>
						</div>
					);
					buttonContent = 'Update Profile';
					break;
				
				case 'userServices':
					contentSection = (
						<div className="editContent">
							<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
						</div>
					);
					buttonContent = 'Update Services';
					break;
				
				case 'password':
					contentSection = (
						<div className="editContent">
							<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
						</div>
					);
					buttonContent = !userVerifiedFlag ? 'Verify Password' : 'Update Password';
					break;
			}
			
			return (
				<Form onSubmit={ handleSubmit(this.handleSubmit) }>
					{ contentSection }
					<Button type="submit" primary className='updated'>{ buttonContent }</Button>
				</Form>
			);
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
	        content: 'PASSWORD',
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
	  const { userVerifiedFlag, activeTab, serviceTypesFieldArray } = this.state;
		
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
					  userServices: serviceTypesFieldArray
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
