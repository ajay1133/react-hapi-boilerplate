import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
//import { stateToHTML } from 'draft-js-export-html';
import { Button, Form, Header, Grid } from 'semantic-ui-react';
import Input from '../Form/Input';
import TextArea from '../Form/TextArea';
import RichEditor from '../Form/RichEditor';
import { required, email } from '../../utils/validations';

@connect(state => ({
  initialValues: state.get('account').get('selectedUser')
}))
@reduxForm({
  form: 'accountForm',
//  enableReinitialize: true
})
export default class AddAccount extends Component {
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
    this.addAccount = this.addAccount.bind(this);
  }
  
  addAccount(formData) {
    const { saveAccount } = this.props;
    const account = formData.toJS();
//    const editorState = this.state.editorState;
//    const contentState = editorState.getCurrentContent();
//    const html = stateToHTML(contentState);
    
    return saveAccount(account).then(data => {
      if (data) {
        console.log('Account Saved!');
      }
    }).catch(err => {
      console.log(err);
      if (err.statusCode === 400) {
        throw new SubmissionError({ number: err.message });
      }
  });
  }
  
  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Form className="login-form" onSubmit={handleSubmit(this.addAccount)}>
        <Header as='h3' className="side">Account Details</Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
            <Input
              className="firstName"
              name="firstName"
              placeholder="First Name"
              type="text"
              size="small"
              validate={[required]}
            />
            <Input
                name="email"
                placeholder="Email"
                type="text"
                size="small"
                validate={[required, email]}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                name="lastName"
                placeholder="Last Name"
                type="text"
                size="small"
                validate={[required]}
              />
              <Input
                name="phone"
                placeholder="Phone"
                type="text"
                size="small"
                validate={[required]}
              />
            </Grid.Column>
            <Grid.Column>
              <Input
                name="url"
                placeholder="Website Url"
                type="text"
                size="small"
              />
              <RichEditor />
              <Field
                name="description"
                placeholder="Description"
                component={TextArea}
                autoHeight
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button
                className="ui large fluid button front"
                type="submit"
                primary
                disabled={submitting}
                loading={submitting}>
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
