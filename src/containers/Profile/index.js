import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form/immutable';
import { Grid, Message, Loader, Tab } from  'semantic-ui-react';
import { Button, Form } from 'semantic-ui-react';
import { TextBox, TextArea } from '../../components/Form';
import { required, email, normalizePhone, url } from '../../utils/validations';
import { updateUserProfile } from '../../redux/modules/account';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

const selector = formValueSelector('profileForm');

@connect(state => ({
  initialValues: {
    title: state.get('auth').get('user') && state.get('auth').get('user').title,
    firstName: state.get('auth').get('user') && state.get('auth').get('user').firstName,
    lastName: state.get('auth').get('user') && state.get('auth').get('user').lastName,
    phone: state.get('auth').get('user') && state.get('auth').get('user').phone,
    url: state.get('auth').get('user') && state.get('auth').get('user').url,
    description: state.get('auth').get('user') && state.get('auth').get('user').description
  },
  user: state.get('auth').get('user'),
  isLoad: state.get('auth').get('isLoad'),
  loadErr: state.get('auth').get('loadErr'),
  accountMsg: state.get('account').get('accountMsg'),
  accountErr: state.get('account').get('accountErr'),
  treatmentType: selector(state, 'treatmentType'),
  typeOfServices: selector(state, 'typeOfServices'),
  levelOfCare: selector(state, 'levelOfCare'),
  treatmentFocus: selector(state, 'treatmentFocus'),
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
    return (
      <Form.Group>
        <Field
          name="oldPassword"
          placeholder="Enter Old Password"
          component={TextBox}
        />
        <Field
          name="password"
          placeholder="Enter New Password"
          component={TextBox}
        />
        <Field
          name="confirmPassword"
          placeholder="Confirm New Password"
          component={TextBox}
        />
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
        menuItem: { key: 'profileDetails', icon: 'user', content: 'PROFILE DETAILS' },
        render: () => pane('profileDetails')
      },
      {
        menuItem: { key: 'userServices', icon: 'sign language', content: 'USER SERVICES' },
        render: () => pane('userServices')
      },
      {
        menuItem: { key: 'password', icon: 'key', content: 'PASSWORD' },
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
	
	handleSubmit = async (data) => {
	  const { dispatch } = this.props;
	  
	  const formData = {
	    profileDetails: data.toJSON()
    };
    
    this.setState({ loading: true });
    await dispatch(updateUserProfile(formData));
	  this.setState({ loading: false });
  };
  
  render() {
    const { isLoad, loadErr, message, handleSubmit } = this.props;
    const { loading, showMessageFlag } = this.state;
    
    const loadingCompleteFlag = !isLoad && !loading;
    
    return (
      <AuthenticatedUser>
        {
	        message && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
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
              { !loadingCompleteFlag && <Loader>Loading...</Loader> }
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
