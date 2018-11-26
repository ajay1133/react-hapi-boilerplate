import React, { Component } from 'react'
import { Button, Form, Header, Grid, Segment } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form/immutable'
import { Input } from '../Form'
import { required } from '../../utils/validations'



class ChangePassword extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    isLoading: false
  };

  constructor(props) {
    super(props);
    this.changePassword = this.changePassword.bind(this);
  }

  changePassword(formData) {
    const { savePassword } = this.props;
    const account = formData.toJS();
    savePassword(account);
  }


  render() {
    const { handleSubmit } = this.props;
    return (
      <Segment className="mainLogin centered forgotNew">
      <Form className="login-form" onSubmit={handleSubmit(this.changePassword)}>
        <Header as='h3' className="side">Set Account Password</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column>
            <Input
              name="password"
              placeholder="Enter New Password"
              type="password"
              size="small"
              validate={[required]}

            />
            <Input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                size="small"
                validate={[required]}
  
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button className="ui large fluid button front centered forgotPwd" type="submit"  primary>
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