import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { Button, Form } from 'semantic-ui-react';
import { TextBox, TextArea } from '../Form';
import { required, email, normalizePhone, url } from '../../utils/validations';

@connect(state => ({
  initialValues: state.get('account').get('selectedUser')
}))
@reduxForm({
  form: 'accountForm',
  enableReinitialize: true
})
export default class AccountModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    account: PropTypes.func,
    selectedUser: PropTypes.object
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
  };

  constructor(props) {
    super(props);
    this.account = this.account.bind(this);
  };
  
  account(formData) {
    const { account } = this.props;
    const accountData = formData.toJS();
    
    return account(accountData).then(data => {
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
  
  render() {
    const { handleSubmit, submitting, selectedUser } = this.props;
    return (
      <Form className="mt-10" onSubmit={handleSubmit(this.account)}>
        {
          !selectedUser
          &&
          <Form.Group widths="equal">
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
          </Form.Group>
        }
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
        <Button
          type="submit"
          primary
          disabled={submitting}
          loading={submitting}>
          { selectedUser ? 'Edit Profile' : 'Add Profile' }
        </Button>
      </Form>
    );
  }
}
