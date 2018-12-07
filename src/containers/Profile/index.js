import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { Grid, Message, Loader, Tab } from  'semantic-ui-react';
import { Button, Form } from 'semantic-ui-react';
import { TextBox, TextArea } from '../../components/Form';
import { required, email, normalizePhone, url } from '../../utils/validations';
import { updateAccount, selectUser } from '../../redux/modules/account';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

const selector = formValueSelector('profileForm');

@connect(state => ({
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
    this.account = this.account.bind(this);
  };
  
  componentDidMount() {
    const { dispatch, user } = this.props;
    dispatch(selectUser(user));
  };
  
  account = async details => {
    const { dispatch } = this.props;
    delete details.events;
    
    Object.keys(details).filter(k => !details[k]).forEach(k => delete details[k]);
    
    this.setState({ loading: true });
    await dispatch(updateAccount(details, true));
    this.setState({ loading: false });
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
  
  renderTabs = () => {
    const { handleSubmit, submitting, selectedUser } = this.props;
    const { treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr } = this.state;
  
    const tabContent = [];
    tabContent[1] = (
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
    tabContent[2] = (
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
    tabContent[3] = (
      <Form.Group>
        <Field
          name="password"
          placeholder="Password"
          component={TextBox}
        />
        <Field
          name="url"
          placeholder="confirm Password"
          component={TextBox}
        />
      </Form.Group>
    );
    const pane = (type) => {
      return (
        <Form onSubmit={ handleSubmit(this.handleProfile) }>
          <Tab.Pane attached={ false }>{ tabContent[type] }</Tab.Pane>
          <Button
            type="submit"
            primary >
            Update Profile
          </Button>
        </Form>
      );
    };
    
    const panes = [
      { menuItem: { key: 'profileDetails', icon: 'user', content: 'PROFILE DETAILS' }, render: () => pane(1) },
      { menuItem: { key: 'userServices', icon: 'sign language', content: 'USER SERVICES' }, render: () => pane(2) },
      { menuItem: { key: 'password', icon: 'key', content: 'PASSWORD' }, render: () => pane(3) },
    ];
    
    return (
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={ panes }
      />
    );
  };
  
  handleProfile = (data) => {
    console.log('here is form data --- ', data);
  };
  
  render() {
    const { isLoad, loadErr, accountMsg, accountErr } = this.props;
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
          (loadErr || accountErr) && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr || accountErr }</span>
          </Message>
        }
        
        <Grid>
          <div className="ui left floated column innerAdjust">
            <h3 className="mainHeading"> Profile</h3>
          </div>
          <Grid.Row>
            <Grid.Column>
              { !loadingCompleteFlag && <Loader>Loading...</Loader> }
              { this.renderTabs() }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </AuthenticatedUser>
    );
  }
}
