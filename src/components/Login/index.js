import React, { Component } from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
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
      return <Redirect to= {'/accounts'} />;
    }
    return (
      <Segment className=" centered loginOuter">
        <Form className="login-form" onSubmit={handleSubmit(this._login)}>
          <Input
            className="username"
            name="email"
            placeholder="Username"
            type="text"
            size="large"
            validate={[required, email]}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            size="large"
            validate={[required]}
          />
          <Button fluid primary type="submit" loading={isLoading || loginBusy}>
            Login
          </Button>
        </Form>
        {
          loginError && (
            <Message error content={loginError} />
          )
        }
        <p className="pt-1 m-0 text-center"><a href="" >Forgot your password ?</a></p>
        <p className="m-0 text-center">Not a member?<a href=""> create account</a></p>
      </Segment>
    );
  }
}