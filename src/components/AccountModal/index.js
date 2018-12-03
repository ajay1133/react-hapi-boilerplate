import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form/immutable';
import { Button, Form, Header } from 'semantic-ui-react';
import { TextBox, RichEditor } from '../Form';
import { required, email } from '../../utils/validations';

const selector = formValueSelector('accountForm');

@connect(state => ({
  initialValues: state.get('account').get('selectedUser'),
  treatmentType: selector(state, 'treatmentType'),
  typeOfServices: selector(state, 'typeOfServices'),
  levelOfCare: selector(state, 'levelOfCare'),
  treatmentFocus: selector(state, 'treatmentFocus'),
}))
@reduxForm({
  form: 'accountForm',
  enableReinitialize: true
})
export default class AccountModal extends Component {
  state = {
    treatmentTypeArr: [],
    typeOfServicesArr: [],
    levelOfCareArr: [],
    treatmentFocusArr: [],
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    change: PropTypes.func,
    isLoading: PropTypes.bool,
    selectedUser: PropTypes.object
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    isLoading: false
  };

  constructor(props) {
    super(props);
    this.account = this.account.bind(this);
  };
  
  account(formData) {
    const { saveAccount } = this.props;
    const account = formData.toJS();
    return saveAccount(account).then(data => {
      if (data) {
        console.log('Account Saved/Updated!');
      }
    }).catch(err => {
      console.log(err);
      if (err.statusCode === 400) {
        throw new SubmissionError({ number: err.message });
      }
    });
  };
  
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
  
  render() {
    const { handleSubmit, submitting, selectedUser } = this.props;
    const { treatmentTypeArr, typeOfServicesArr, levelOfCareArr, treatmentFocusArr } = this.state;
    return (
      <Form className="login-form" onSubmit={handleSubmit(this.account)}>
        <Header as='h3' className="side">Account Details</Header>
        <Form.Group widths="equal">
          <Field
            name="title"
            placeholder="Title"
            component={TextBox}
            validate={required}
          />
          {
            !selectedUser
            &&
            <Field
              name="firstName"
              placeholder="First Name"
              component={TextBox}
              validate={required}
            />
          }
          {
            !selectedUser
            &&
            <Field
              name="lastName"
              placeholder="Last Name"
              component={TextBox}
              validate={required}
            />
          }
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            name="email"
            placeholder="Email"
            component={TextBox}
            validate={email}
          />
          <Field
            name="phone"
            placeholder="Phone"
            component={TextBox}
          />
          <Field
            name="url"
            placeholder="Website Url"
            component={TextBox}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            name="address"
            placeholder="address"
            component={TextBox}
          />
          <Field
            name="image"
            placeholder="image"
            component={TextBox}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Field
            name="description"
            placeholder="Description"
            style={{ width:'100%' }}
            component={RichEditor}
          />
        </Form.Group>
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
        <Button
          className="ui large fluid button front"
          type="submit"
          primary
          disabled={submitting}
          loading={submitting}>
          Save
        </Button>
      </Form>
    );
  }
}
