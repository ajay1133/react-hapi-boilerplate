import React, { Component } from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router';
import PropTypes from 'prop-types'
import { login, forgotPassword, load } from '../../redux/modules/auth'
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
  loginMsg: state.get('auth').get('loginMsg'),
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
	  passwordUpdatedMsg: PropTypes.string,
    loginMsg: PropTypes.string
  };
  
  state = {
    showForgot: false
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
    const { showForgot } = this.state;
    const { dispatch } = this.props;
    const { email, password } = formData.toJS() || {};
    
    if (showForgot) {
      await dispatch(forgotPassword(email));
    } else {
      await dispatch(login(email, password));
    }
  };
  
  showForgotPassword = () => {
    const { showForgot } = this.state;
    this.setState({
      showForgot: !showForgot
    });
  };
  
  render() {
    const { handleSubmit, isLoading, loginBusy, loginError, user, passwordUpdated, passwordUpdatedMsg, loginMsg } = this.props;
    const { showForgot } = this.state;
    
    if (!isLoading && validObjectWithParameterKeys(user, ['id', 'role'])) {
	    return <Redirect to = {DEFAULT_HOME_PAGE_ROUTES[user.role]} />;
    }
    
    return (
      <Segment className="centered loginOuter">
        {
          ((passwordUpdated && passwordUpdatedMsg) || loginMsg) &&
          <Message>
            <span style={{ color: 'green' }}>{ passwordUpdatedMsg || loginMsg }</span>
          </Message>
        }
        <Form className="login-form" onSubmit={handleSubmit(this._login)}>
          <Input
            className="username"
            name="email"
            placeholder="Email"
            type="text"
            size="large"
            validate={[required, email]}
          />
          {
            !showForgot &&
            <Input
              name="password"
              placeholder="Password"
              type="password"
              size="large"
              validate={[required]}
            />
          }
          <Button
            fluid
            primary
            type="submit"
            loading={isLoading || loginBusy}
            content={ !showForgot ? 'Login' : 'Forgot Password' }
          />
          {
            showForgot &&
            <Button
              fluid
              primary
              content='Cancel'
              onClick={ this.showForgotPassword }
            />
          }
        </Form>
        {
          loginError && <Message error content={loginError} />
        }
        {
          !showForgot &&
          <p className="pt-1 m-0 text-center">
            <a
              href="javascript:void(0)"
              onClick={ this.showForgotPassword }>
              Forgot your password ?
            </a>
          </p>
        }
      </Segment>
    );
  }
}