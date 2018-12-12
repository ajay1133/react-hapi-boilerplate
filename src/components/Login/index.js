import React, { Component } from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router';
import PropTypes from 'prop-types'
import { login, load } from '../../redux/modules/auth'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/immutable'
import { Input } from '../../components/Form'
import { required, email } from '../../utils/validations';
import { validObjectWithParameterKeys } from '../../utils/commonutils';
import { DEFAULT_HOME_PAGE_ROUTES } from '../../utils/constants';

@connect(state => ({
  user: state.get('auth').get('user'),
  isLoading: state.get('auth').get('isLoad'),
  loginBusy: state.get('auth').get('isLogin'),
  loginError: state.get('auth').get('loginErr'),
	passwordUpdated: state.get('account').get('passwordUpdated'),
	passwordUpdatedMsg: state.get('account').get('passwordUpdatedMsg'),
}))
@reduxForm({
  form: 'loginForm',
})
export default class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    loginBusy: PropTypes.bool,
    loginError: PropTypes.string,
	  passwordUpdated: PropTypes.bool,
	  passwordUpdatedMsg: PropTypes.string
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    isLoading: false,
    loginBusy: false,
    loginError: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(load());
  };

  _login = async (formData) => {
    const { dispatch } = this.props;
    const { email, password } = formData.toJS() || {};
    await dispatch(login(email, password));
  };

  render() {
    const { handleSubmit, isLoading, loginBusy, loginError, user, passwordUpdated, passwordUpdatedMsg } = this.props;
    
    if (!isLoading && validObjectWithParameterKeys(user, ['id', 'role'])) {
	    return <Redirect to = {DEFAULT_HOME_PAGE_ROUTES[user.role]} />;
    }
    
    return (
      <Segment className=" centered loginOuter">
        {
	        passwordUpdated && passwordUpdatedMsg &&
          <Message>
            <span style={{ color: 'green' }}>{ passwordUpdatedMsg }</span>
          </Message>
        }
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
          loginError &&
          <Message error content={loginError} />
        }
        <p className="pt-1 m-0 text-center"><a href="" >Forgot your password ?</a></p>
        <p className="m-0 text-center">Not a member?<a href=""> create account</a></p>
      </Segment>
    );
  }
}