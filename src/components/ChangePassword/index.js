import React, { Component } from 'react';
import { Button, Form, Header, Grid, Segment, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { passwordValidator } from '../../utils/validations';
import { TextBox } from '../../components/Form';

class ChangePassword extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
	  isButtonLoading: PropTypes.bool,
	  submitting: PropTypes.bool,
    error: PropTypes.string
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null
  };

  constructor(props) {
    super(props);
    this.changePassword = this.changePassword.bind(this);
  };

  changePassword = async (data) => {
    const { savePassword } = this.props;
    const formData = data.toJS();
	  
    const validPasswordFlag = formData.password === formData.confirmPassword &&
	    !passwordValidator(formData.password);
    
	  if (!validPasswordFlag) {
		  throw new SubmissionError({
        _error: passwordValidator(formData.password) || 'Password & Confirm Password do not match' });
	  }
   
	  await savePassword(formData);
  };
  
  render() {
    const { handleSubmit, isButtonLoading, submitting, error } = this.props;
    
    return (
      <Segment className="mainLogin centered forgotNew">
        <Form className="login-form" onSubmit={handleSubmit(this.changePassword)}>
          <Header as='h3' className="side">
            Set Your Password
          </Header>
          <Grid>
	          {
		          error &&
              <Grid.Row>
                <Grid.Column>
                  <Message negative> <Message.Header> { error } </Message.Header> </Message>
                </Grid.Column>
              </Grid.Row>
	          }
            <Grid.Row>
              <Grid.Column>
                <Field
                  name="password"
                  placeholder="Enter Password"
                  type="password"
                  component={TextBox}
                  validate={passwordValidator}
                />
                <Field
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  component={TextBox}
                  validate={passwordValidator}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Button
                  className="ui large fluid button front centered forgotPwd"
                  type="submit"
                  primary
                  disabled={ isButtonLoading }
                  submitting={ submitting }
                >
                  Save
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

export default reduxForm({
  form: 'changePasswordForm'
})(ChangePassword)