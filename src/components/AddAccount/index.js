import React, { Component } from 'react'
import { Button, Form, Header, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form/immutable'
import Input from '../Form/Input'
import { required, email } from '../../utils/validations'
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form/immutable'

class AddAccount extends Component {

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
    return saveAccount(account).then(data => {
      console.log('Account Saved!');
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
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button className="ui large fluid button front" type="submit"  primary disabled={submitting} loading={submitting}>
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

export default connect(
  state => ({
    initialValues: state.get('account').get('selectedUser')
  }))(reduxForm({
  form: 'accountForm'
})(AddAccount));
