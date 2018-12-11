import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';
import { Grid, Message, Loader, Tab } from 'semantic-ui-react';
import { Button, Form } from 'semantic-ui-react';
import { TextBox, TextArea } from '../../components/Form';
import { required, email, normalizePhone, url, passwordValidator } from '../../utils/validations';
import { strictValidObjectWithKeys } from '../../utils/commonutils';
import { verifyUser } from '../../redux/modules/auth';
import { updateUserProfile } from '../../redux/modules/account';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import _ from 'lodash';
import '../../style/css/style.css';

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
    accountErr: PropTypes.string
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
	  userVerifiedFlag: false
  };
	
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	};
	
  messageDismiss = () => this.setState({ showMessageFlag: false });
  
  addRemoveInput = (e, action, type, idx) => {
    e.preventDefault();
    
    const { treatmentType, typeOfServices, levelOfCare, treatmentFocus } = this.props;
    const { treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr } = this.state;
    
    if (type === 1){
      (action === 'add' && treatmentType)
        ? treatmentTypeArr.push(treatmentType)
        : treatmentTypeArr.splice(idx, 1);
      this.setState({ treatmentTypeArr });
      this.props.change('treatmentType', '');
    } else if (type === 2) {
      (action === 'add' && typeOfServices)
        ? typeOfServicesArr.push(typeOfServices)
        : typeOfServicesArr.splice(idx, 1);
      this.setState({ typeOfServicesArr });
      this.props.change('typeOfServices', '');
    } else if (type === 3) {
      (action === 'add' && levelOfCare)
        ? levelOfCareArr.push(levelOfCare)
        : levelOfCareArr.splice(idx, 1);
      this.setState({ levelOfCareArr });
      this.props.change('levelOfCare', '');
    } else if (type === 4) {
      (action === 'add' && treatmentFocus)
        ? treatmentFocusArr.push(treatmentFocus)
        : treatmentFocusArr.splice(idx, 1);
      this.setState({ treatmentFocusArr });
      this.props.change('treatmentFocus', '');
    }
  };
  
  getProfileTabsSection = () => {
    return (
      <Form.Group>
        <Field
          name="title"
          placeholder="Title"
          component={TextBox}
          validate={required}
        />
        <Field
          name="firstName"
          placeholder="First Name"
          component={TextBox}
          validate={required}
        />
        <Field
          name="lastName"
          placeholder="Last Name"
          component={TextBox}
        />
        <Field
          name="email"
          placeholder="Email"
          component={TextBox}
          validate={email}
        />
        <Field
          name="phone"
          placeholder="Phone Number"
          component={TextBox}
          normalize={ normalizePhone }
        />
        <Field
          name="url"
          placeholder="Website Url"
          component={TextBox}
          validate={url}
        />
        <Field
          name="description"
          placeholder="Description"
          component={TextArea}
        />
      </Form.Group>
    );
  };
  
  getUserServicesSection = () => {
	  const { treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr } = this.state;
	  
    return (
      <div>
        <Form.Group>
          <Field
            label='Treatment Type'
            name="treatmentType"
            placeholder="add content"
            component={TextBox}
          />
          <Button
            icon='add'
            onClick={(e) => this.addRemoveInput(e, 'add', 1)}
          />
        </Form.Group>
		    {
			    treatmentTypeArr && treatmentTypeArr.map((val, idx) => {
				    return (
              <Form.Group key={idx}>
                <label className="m-10">{ val } </label>
                <Button icon='minus' onClick={(e) => this.addRemoveInput(e, 'remove', 1, idx)}/>
              </Form.Group>
				    );
			    })
		    }
        <Form.Group>
          <Field
            label='Type of Services'
            name="typeOfServices"
            placeholder="add content"
            component={TextBox}
          />
          <Button
            icon='add'
            onClick={(e) => this.addRemoveInput(e, 'add', 2)}
          />
        </Form.Group>
		    {
			    typeOfServicesArr && typeOfServicesArr.map((val, idx) => {
				    return (
              <Form.Group key={idx}>
                <label className="m-10">{ val } </label>
                <Button icon='minus' onClick={(e) => this.addRemoveInput(e, 'remove', 2, idx)}/>
              </Form.Group>
				    );
			    })
		    }
        <Form.Group>
          <Field
            label='Level of care'
            name="levelOfCare"
            placeholder="add content"
            component={TextBox}
          />
          <Button
            icon='add'
            onClick={(e) => this.addRemoveInput(e, 'add', 3)}
          />
        </Form.Group>
		    {
			    levelOfCareArr && levelOfCareArr.map((val, idx) => {
				    return (
              <Form.Group key={idx}>
                <label className="m-10">{ val } </label>
                <Button icon='minus' onClick={(e) => this.addRemoveInput(e, 'remove', 3, idx)}/>
              </Form.Group>
				    );
			    })
		    }
        <Form.Group>
          <Field
            label='Treatment Focus'
            name="treatmentFocus"
            placeholder="add content"
            component={TextBox}
          />
          <Button
            icon='add'
            onClick={(e) => this.addRemoveInput(e, 'add', 4)}
          />
        </Form.Group>
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
      </div>
    );
  };
  
  getPasswordSection = () => {
  	const { userVerifiedFlag } = this.state;
  	
    return (
      <Form.Group>
	      {
		      !userVerifiedFlag &&
			    <Field
				    name="currentPassword"
				    placeholder="Verify Your Password"
				    type="password"
				    component={TextBox}
				    validate={passwordValidator}
			    />
	      }
	      {
		      !userVerifiedFlag &&
		      <Button type="button" primary onClick={() => this.handleVerifyUser()} style={{ float: 'right' }}>
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
      </Form.Group>
    );
  };
  
  renderTabs = () => {
    const tabContent = {
	    profileDetails: this.getProfileTabsSection(),
      userServices: this.getUserServicesSection(),
      password: this.getPasswordSection()
    };
    
    const pane = (type) => {
    	return (
        <Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
      );
    };
    
    const panes = [
      {
        menuItem: {
        	key: 'profileDetails',
	        icon: 'user',
	        content: 'PROFILE DETAILS',
	        onClick: () => this.handleResetVerification()
        },
        render: () => pane('profileDetails')
      },
      {
        menuItem: {
        	key: 'userServices',
	        icon: 'sign language',
	        content: 'USER SERVICES',
	        onClick: () => this.handleResetVerification()
        },
        render: () => pane('userServices')
      },
      {
        menuItem: { key: 'password', icon: 'key', content: 'CHANGE PASSWORD' },
        render: () => pane('password')
      },
    ];
    
    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={ panes }
      />
    );
  };
	
  handleResetVerification = () => {
  	this.setState({ userVerifiedFlag: false });
  	this.props.change('currentPassword', '');
  };
  
	handleSubmit = async (data) => {
	  const { dispatch } = this.props;
	  const { userVerifiedFlag } = this.state;
	  
	  const dataObj = (strictValidObjectWithKeys(data.toJSON()) && data.toJSON()) || {};
	  
	  if (strictValidObjectWithKeys(dataObj)) {
		  const formData = {
			  profileDetails: _.pick(dataObj, profileDetailsFormKeys),
			  userServices: _.pick(dataObj, userServicesFormKeys),
			  password: _.pick(dataObj, passwordFormKeys)
		  };
		  
		  if (userVerifiedFlag) {
		    const validPasswordFlag = dataObj.password === dataObj.confirmPassword &&
			    !passwordValidator(dataObj.password);
		    
		    if (!validPasswordFlag) {
		      throw new SubmissionError({
			      _error: passwordValidator(dataObj.password) || 'Password & Confirm Password do not match'
		      });
		    }
		  }
		  
		  this.setState({ loading: true });
		  await dispatch(updateUserProfile(formData));
		  this.setState({
			  loading: false,
			  userVerifiedFlag: false
		  });
	  }
  };
	
	handleVerifyUser = async () => {
		const { dispatch, currentPassword, user } = this.props;
		const res = await dispatch(verifyUser(user.email, currentPassword));
		
		const areUsersSameFlag = strictValidObjectWithKeys(res) && strictValidObjectWithKeys(res.user) &&
			res.user.id === user.id;
		
		this.setState({
			userVerifiedFlag: areUsersSameFlag
		})
	};
	
  render() {
    const { isLoad, loadErr, accountMsg, handleSubmit } = this.props;
    const { loading, showMessageFlag } = this.state;
    
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
          loadErr && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr }</span>
          </Message>
        }
        
        <Grid>
          <div className="ui left floated column innerAdjust">
            <h3 className="mainHeading"> Profile</h3>
          </div>
          <Grid.Row>
            <Grid.Column>
              {
              	!loadingCompleteFlag &&
                <Loader active inline='centered'>Loading...</Loader>
              }
              {
                loadingCompleteFlag &&
                <Form onSubmit={ handleSubmit(this.handleSubmit) }>
                  { this.renderTabs() }
                  <Button type="submit" primary>Update Profile</Button>
                </Form>
              }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </AuthenticatedUser>
    );
  }
}
