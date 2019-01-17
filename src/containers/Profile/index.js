import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';
import { Grid, Message, Loader, Tab, Header, Button, Form, Image } from  'semantic-ui-react';
import { TextBox, TextArea, CheckBox, DropDown } from '../../components/Form';
import { required, email, normalizePhone, url, passwordValidator, isValidZip } from '../../utils/validations';
import {
	strictValidObjectWithKeys,
	typeCastToString,
	strictValidArrayWithLength,
	validObjectWithParameterKeys,
	getAbsoluteS3FileUrl,
	validFileName,
	strictValidString,
	getOptionsListFromArray
} from '../../utils/commonutils';
import {
	DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES,
	USER_PROFILE_TABS,
	USER_PROFILE_DETAILS_FORM_KEYS,
	USER_PASSWORD_SECTION_FORM_KEYS,
	VALID_ACCESSIBLE_IMAGE_FILE_FORMATS,
	DEFAULT_USER_PROFILE_IMAGE_URL,
	IMAGE_FILE_NAME_BEGIN_REG_EXP,
	USER_SERVICES_LIST,
	US_STATES_LIST
} from '../../utils/constants';
import { verifyUser } from '../../redux/modules/auth';
import { loadUserProfileRelatedData, updateUserProfile } from '../../redux/modules/account';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import S3FileUploader from '../../components/S3FileUploader';
import config from '../../config';
import _ from 'lodash';
import '../../style/css/style.css';

const selector = formValueSelector('profileForm');

@connect(state => ({
  initialValues: Object.assign(
  	{},
	  (validObjectWithParameterKeys(state.get('auth').get('user'), ['id']) && state.get('auth').get('user')) || {},
	  state.get('account').get('userDetails') || {}
  ),
	user: state.get('auth').get('user'),
	isLoad: state.get('auth').get('isLoad'),
	loadErr: state.get('auth').get('loadErr'),
	accountMsg: state.get('account').get('accountMsg'),
	accountErr: state.get('account').get('accountErr'),
	serviceTypes: state.get('account').get('serviceTypes'),
	userServices: state.get('account').get('userServices'),
	genderTypes: state.get('account').get('genderTypes'),
	userGenderGroups: state.get('account').get('userGenderGroups'),
	ageTypes: state.get('account').get('ageTypes'),
	userAgeGroups: state.get('account').get('userAgeGroups'),
	treatmentFocusTypes: state.get('account').get('treatmentFocusTypes'),
	userTreatmentFocusGroups: state.get('account').get('userTreatmentFocusGroups'),
	searchKeywordTypes: state.get('account').get('searchKeywordTypes'),
	userSearchKeywordGroups: state.get('account').get('userSearchKeywordGroups'),
	currentPassword: selector(state, 'currentPassword'),
	serviceTypesValuesList: (
		selector(state, 'serviceType') &&
		strictValidObjectWithKeys(selector(state, 'serviceType')) &&
		selector(state, 'serviceType').toJSON()) || [],
	genderTypesValuesList: (
		selector(state, 'genderType') &&
		strictValidObjectWithKeys(selector(state, 'genderType')) &&
		selector(state, 'genderType').toJSON()) || [],
	ageTypesValuesList: (
		selector(state, 'ageType') &&
		strictValidObjectWithKeys(selector(state, 'ageType')) &&
		selector(state, 'ageType').toJSON()) || [],
	treatmentFocusTypesValuesList: (
		selector(state, 'treatmentFocusType') &&
		strictValidObjectWithKeys(selector(state, 'treatmentFocusType')) &&
		selector(state, 'treatmentFocusType').toJSON()) || [],
	searchKeywordTypesValuesList: (
		selector(state, 'searchKeywordType') &&
		strictValidObjectWithKeys(selector(state, 'searchKeywordType')) &&
		selector(state, 'searchKeywordType').toJSON()) || [],
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
		serviceTypes: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		userServices: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		genderTypes: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		userGenderGroups: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		ageTypes: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		userAgeGroups: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		treatmentFocusTypes: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		userTreatmentFocusGroups: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		searchKeywordTypes: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		userSearchKeywordGroups: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
		serviceTypesValuesList: PropTypes.array,
		genderTypesValuesList: PropTypes.array,
		ageTypesValuesList: PropTypes.array,
		treatmentFocusTypesValuesList: PropTypes.array,
		searchKeywordTypesValuesList: PropTypes.array
	};
	
	static defaultProps = {
		dispatch: null,
		handleSubmit: null,
	};
	
	state = {
		loading: true,
		imageLoading: false,
		showMessageFlag: true,
		userVerifiedFlag: false,
		activeTab: USER_PROFILE_TABS[0] || null,
		serviceTypesFieldArray: [],
		serviceErrorStr: null,
		uploadProfileImageUrl: null,
		uploadProfileImageName: null,
		uploadProfileImageError: null
	};
	
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleProfileImageFinishedUpload = this.handleProfileImageFinishedUpload.bind(this);
		this.resetProfileImageOnComplete = this.resetProfileImageOnComplete.bind(this);
	};
	
	componentDidMount = async () => {
		const { dispatch, user } = this.props;
		try {
			this.setState({ uploadProfileImageUrl: user.image });
			const res = await dispatch(loadUserProfileRelatedData());
			if (strictValidObjectWithKeys(res) && strictValidArrayWithLength(res.serviceType)) {
				this.setState({ serviceTypesFieldArray: res.serviceType });
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
		const { genderTypes = [], ageTypes = [], treatmentFocusTypes = [] } = this.props;
		const { uploadProfileImageError, uploadProfileImageUrl, imageLoading } = this.state;
		
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
								    readOnly
								  />
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row >
							  <Grid.Column computer="8">
								  <Field
									  name="address"
									  placeholder="Street Address"
									  component={TextBox}
								  />
							  </Grid.Column>
							  <Grid.Column computer="8">
								  <Field
									  name="city"
									  placeholder="City"
									  component={TextBox}
								  />
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row >
							  <Grid.Column computer="8">
								  <Field
									  search
									  fluid
									  multiple={ false }
									  selection
									  selectOnBlur={ true }
									  noResultsMessage="No results found"
									  name="state"
									  placeholder="State"
									  options={ getOptionsListFromArray(US_STATES_LIST) }
									  component={DropDown}
								  />
							  </Grid.Column>
							  <Grid.Column computer="8">
								  <Field
									  name="zip"
									  placeholder="Zip"
									  component={TextBox}
									  validate={isValidZip}
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
									  name="website"
									  placeholder="Website Url"
									  component={TextBox}
									  validate={url}
								  />
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row celled="internally">
							  <Grid.Column width="16" className="mb-10">
								  <h4>Gender :</h4>
							  </Grid.Column>
							  <Grid.Column width="16">
								  <Grid columns="3">
									  <Grid.Row className="newServices">
										  {
											  genderTypes.map((genderType, idx) => (
												  <Grid.Column key={idx}>
													  <Field
														  name={ `genderType[${idx}]` }
														  component={CheckBox}
														  label={ genderType.name }
													  />
												  </Grid.Column>
											  ))
										  }
									  </Grid.Row>
								  </Grid>
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row>
							  <Grid.Column width="16" className="mb-10">
								  <h4>Age :</h4>
							  </Grid.Column>
							  <Grid.Column width="16">
								  <Grid columns="3">
									  <Grid.Row className="newServices">
										  {
											  ageTypes.map((ageType, idx) => (
											    <Grid.Column>
													  <Field
														  name={ `ageType[${idx}]` }
														  component={CheckBox}
														  label={ ageType.name }
													  />
												  </Grid.Column>
											  ))
										  }
									  </Grid.Row>
								  </Grid>
							  </Grid.Column>
						  </Grid.Row>
						  <Grid.Row>
							  <Grid.Column width="16" className="mb-10">
								  <h4>Insurance :</h4>
							  </Grid.Column>
							  <Grid.Column width="16">
								  <Grid columns="3">
									  <Grid.Row className="newServices">
										  {
											  treatmentFocusTypes.map((treatmentFocusType, idx) => (
												  <Grid.Column>
													  <Field
														  name={ `treatmentFocusType[${idx}]` }
														  component={CheckBox}
														  label={ treatmentFocusType.name }
													  />
												  </Grid.Column>
											  ))
										  }
									  </Grid.Row>
								  </Grid>
							  </Grid.Column>
						  </Grid.Row>
					  </Grid>
				  </Grid.Column>
				  <Grid.Column computer="6">
					  {
						  !!uploadProfileImageError &&
						  <Grid.Row columns="1" className="mb-10">
							  <Grid.Column>
								  <span style={{ color: 'red' }}>{ uploadProfileImageError }</span>
							  </Grid.Column>
						  </Grid.Row>
					  }
					  <Grid.Row>
						  <Grid.Column>
							  {
								  imageLoading &&
								  <Loader active inline='centered'>Loading...</Loader>
							  }
							  {
							  	!imageLoading &&
								  <Image
									  src={ getAbsoluteS3FileUrl(uploadProfileImageUrl) || DEFAULT_USER_PROFILE_IMAGE_URL }
									  size="medium"
									  rounded
									  alt="image"
									  centered
								  />
							  }
						  </Grid.Column>
					  </Grid.Row>
					  <Grid.Row>
						  <Grid.Column computer="4" className="profileUploader">
							  <S3FileUploader
								  signingUrl={`${config.apiHost}/aws/uploadFile/profileImages`}
								  onFileUpload={ this.handleProfileImageFinishedUpload }
								  resetOnComplete={ this.resetProfileImageOnComplete }
								  toShowContent={ ' Change Photo' }
							  />
						  </Grid.Column>
					  </Grid.Row>
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
							  search
							  fluid
							  multiple={ false }
							  selection
							  selectOnBlur={ true }
							  noResultsMessage="No results found"
							  label={ serviceType.name }
							  name={ `serviceType[${idx}]` }
							  placeholder={ `Add ${serviceType.name} Service` }
							  options={ getOptionsListFromArray(USER_SERVICES_LIST[idx + 1], true, 'SELECT TO ADD A SERVICE') }
							  component={ DropDown }
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
							!!serviceErrorStr &&
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
  
  getSearchSection = () => {
  	const { searchKeywordTypes } = this.props;
  	let tempIdx = 0;
  	let typesArrayObject = { otherTypes: [] };
	  
	  searchKeywordTypes.forEach((searchKeywordType, idx) => {
	  	if (searchKeywordType.type) {
	  		if (!strictValidArrayWithLength(typesArrayObject[searchKeywordType.type])) {
				  typesArrayObject[searchKeywordType.type] = [];
			  }
			  typesArrayObject[searchKeywordType.type].push(searchKeywordType);
		  } else {
			  typesArrayObject['otherTypes'].push(searchKeywordType);
		  }
	  });
	  
    return (
      <Grid>
        <Grid.Column computer="10">
          <Header size='medium'>Search Keyword (s)</Header>
          <Grid>
	          {
		          Object.keys(typesArrayObject).map(type => {
		          	const validTypeFlag = strictValidString(type) && type !== 'otherTypes';
			          return (
				          <Grid.Row columns="1" className="serviceListing">
					          <Grid.Column>
						          {
							          validTypeFlag && <Header size='small'>{ type }</Header>
						          }
						          {
							          strictValidArrayWithLength(typesArrayObject[type]) &&
							          typesArrayObject[type].map(searchKeywordType => {
								          tempIdx++;
								          return (
									          <Field
										          name={ `searchKeywordType[${tempIdx}]` }
										          component={CheckBox}
										          label={ searchKeywordType.name }
									          />
								          );
							          })
						          }
					          </Grid.Column>
				          </Grid.Row>
			          );
		          })
	          }
          </Grid>
        </Grid.Column>
      </Grid>
    );
  };
  
	renderTabs = () => {
		const { handleSubmit } = this.props;
  	const { activeTab, userVerifiedFlag } = this.state;
	  const activeIndex = USER_PROFILE_TABS.indexOf(activeTab) >= -1 ? USER_PROFILE_TABS.indexOf(activeTab) : 0;
	  
		const tabContent = {
			profileDetails: this.getProfileTabsSection(),
			userServices: this.getUserServicesSection(),
			password: this.getPasswordSection(),
			userSearch: this.getSearchSection(),
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
					
        case 'userSearch':
					contentSection = (
						<div className="editContent">
							<Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
						</div>
					);
					buttonContent = 'Update Search';
					break;
					
				default:
					contentSection = (<div></div>);
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
      {
        menuItem: {
        	key: 'userSearch',
	        icon: 'search',
	        content: 'SEARCH',
	        onClick: () => this.handleTabClick('userSearch')
        },
				render: () => pane('userSearch')
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
		const {
			dispatch, genderTypesValuesList, ageTypesValuesList, treatmentFocusTypesValuesList, searchKeywordTypesValuesList
		} = this.props;
	  const {
	  	userVerifiedFlag, activeTab, serviceTypesFieldArray, uploadProfileImageName, uploadProfileImageUrl
	  } = this.state;
		
		this.props.change('_error', null);
		
		const dataObj = (strictValidObjectWithKeys(data.toJSON()) && data.toJSON()) || {};
		
		const inValidImageFileFlag = uploadProfileImageName && uploadProfileImageUrl &&
			!validFileName(uploadProfileImageUrl, VALID_ACCESSIBLE_IMAGE_FILE_FORMATS, IMAGE_FILE_NAME_BEGIN_REG_EXP);
		if (inValidImageFileFlag) {
			throw new SubmissionError({ _error:
				'Invalid File Name, a valid image file should only have' +
				'\'.jpg\', \'.jpeg\', \'.png\' or \'.gif\'  extension(s)'
			});
		}
			
	  try {
		  if (strictValidObjectWithKeys(dataObj)) {
			  this.setState({ loading: true });
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
				
				  formData = { password: _.pick(dataObj, USER_PASSWORD_SECTION_FORM_KEYS) };
			  } else if (activeTab === 'profileDetails') {
				  formData = {
					  profileDetails: uploadProfileImageUrl
						  ? Object.assign({}, _.pick(dataObj, USER_PROFILE_DETAILS_FORM_KEYS), { image: uploadProfileImageUrl })
						  : _.pick(dataObj, USER_PROFILE_DETAILS_FORM_KEYS),
					  otherDetails: {
					  	genderType: genderTypesValuesList,
						  ageType: ageTypesValuesList,
						  treatmentFocusType: treatmentFocusTypesValuesList
					  }
				  };
			  } else if (activeTab === 'userServices') {
				  formData = {
					  userServices: serviceTypesFieldArray
				  };
			  } else if (activeTab === 'userSearch') {
			  	formData = {
			  		userSearch: searchKeywordTypesValuesList
				  }
			  }
			  
			  this.setState({ loading: true });
			  await dispatch(updateUserProfile(formData));
			  this.handleTabClick(activeTab);
			  this.setState({
				  loading: false,
				  uploadProfileImageName: null
			  });
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
	
	handleProfileImageFinishedUpload = async ({ name, s3Key }) => {
		if (!validFileName(name, VALID_ACCESSIBLE_IMAGE_FILE_FORMATS)) {
			this.setState({ uploadProfileImageError: 'Invalid File Name, a valid image file should only have' +
			'\'.jpg\', \'.jpeg\', \'.png\' or \'.gif\'  extension(s)' });
			setTimeout(() => this.setState({ uploadProfileImageError: null }), DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
			return;
		}
		
		this.setState({ uploadProfileImageUrl: s3Key });
	};
	
	resetProfileImageOnComplete = async ({ name }) => {
		const { dispatch } = this.props;
		const { activeTab, uploadProfileImageUrl } = this.state;
		
		try {
			if (validFileName(name, VALID_ACCESSIBLE_IMAGE_FILE_FORMATS)) {
				this.setState({ imageLoading: true });
				const formData = {
					profileDetails: { image: uploadProfileImageUrl }
				};
				await dispatch(updateUserProfile(formData));
				this.handleTabClick(activeTab);
				this.setState({
					imageLoading: false,
					uploadProfileImageName: name
				});
			}
		} catch (err) {
			throw new SubmissionError({
				_error: typeCastToString(err) || 'Error updating profile image'
			});
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
