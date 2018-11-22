import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
//import { stateToHTML } from 'draft-js-export-html';
import { Button, Form, Header } from 'semantic-ui-react';
import TextBox from '../Form/TextBox';
import TextArea from '../Form/TextArea';
import { required, email } from '../../utils/validations';

@connect(state => ({
  initialValues: state.get('account').get('selectedUser')
}))
@reduxForm({
  form: 'accountForm',
//  enableReinitialize: true
})
export default class AccountModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
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
  }
  
  account(formData) {
    const { saveAccount } = this.props;
    const account = formData.toJS();
//    const editorState = this.state.editorState;
//    const contentState = editorState.getCurrentContent();
//    const html = stateToHTML(contentState);
    
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
  }
  
  render() {
    const { handleSubmit, submitting, selectedUser } = this.props;
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
            component={TextArea}
            autoHeight
          />
        </Form.Group>
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
