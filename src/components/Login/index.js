import React, { Component } from 'react'
import { Button, Form, Segment, Message, Header } from 'semantic-ui-react'
import { Redirect } from 'react-router';
import PropTypes from 'prop-types'
import { login, load } from '../../redux/modules/auth'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'
import Input from '../../components/Form/Input'
import { required, email } from '../../utils/validations';

@connect(state => ({
  me: state.get('auth').get('user'),
  isLoading: state.get('auth').get('isLoad'),
  loginBusy: state.get('auth').get('isLogin'),
  loginError: state.get('auth').get('loginErr'),
}))

@reduxForm({
  form: 'login',
})

export default class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    loginBusy: PropTypes.bool,
    loginError: PropTypes.string,
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    isLoading: false,
    loginBusy: false,
    loginError: ''
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(load());
  }

  _login = (formData) => {
    const { dispatch } = this.props;
    const user = formData.toJS();
    dispatch(login(user.email, user.password));
  }

  render() {
    const { handleSubmit, isLoading, loginBusy, loginError, me } = this.props;
    if (me && me.id) {
      return <Redirect to= {'/dashboard'} />;
    }
    return (
      <Segment className="mainLogin centered">
        <Form className="login-form" onSubmit={handleSubmit(this._login)}>
          <Header as='h3' className="side">LOGIN</Header>
          <Input
            className="username"
            name="email"
            icon="user"
            iconPosition="left"
            placeholder="Username"
            type="text"
            size="large"
            validate={[required, email]}

          />
          <Input
            name="password"
            icon="key"
            iconPosition="left"
            placeholder="Password"
            type="password"
            size="large"
            validate={[required]}
          />
          <Button className="ui large primary button front" type="submit"  primary loading={isLoading || loginBusy}>
            Login
            <i aria-hidden="true" className="chevron right icon"></i>
          </Button>
        </Form>
        {
          loginError && (
            <Message error content={loginError} />
          )
        }
      </Segment>
    );
  }
}