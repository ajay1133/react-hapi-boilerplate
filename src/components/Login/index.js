import React, { Component } from 'react';
import { Button, Form, Segment, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { login, forgotPassword } from '../../redux/modules/auth';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/immutable';
import { Input } from '../../components/Form';
import { validObjectWithParameterKeys } from '../../utils/commonutils';
import { required, email } from '../../utils/validations';
import '../../style/css/style.css';

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
    loginMsg: PropTypes.string,
	  match: PropTypes.object
  };
  
  state = {
    showForgotPasswordFlag: false
  };
  
  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    isLoading: false,
    loginBusy: false,
    loginError: ''
  };

  componentDidMount = async () => {
    const { dispatch, location } = this.props;
	  const { token } = (
	    validObjectWithParameterKeys(location, ['search']) && location.search &&
      queryString.parse(location.search)
    ) || {};
    if (token) {
	    await dispatch(login({ token }));
    }
  };
	
	handleLogin = async (formData) => {
    const { showForgotPasswordFlag } = this.state;
    const { dispatch } = this.props;
    const { email, password } = formData.toJS() || {};
    
    if (showForgotPasswordFlag) {
      await dispatch(forgotPassword(email));
    } else {
      await dispatch(login({ email, password }));
    }
  };
  
  showForgotPassword = () => {
    const { showForgotPasswordFlag } = this.state;
    this.setState({
	    showForgotPasswordFlag: !showForgotPasswordFlag
    });
  };
  
  render() {
    const {
      handleSubmit, isLoading, loginBusy, loginError, passwordUpdated, passwordUpdatedMsg, loginMsg, user
    } = this.props;
    const { showForgotPasswordFlag } = this.state;
    
    return (
      !validObjectWithParameterKeys(user, ['id']) &&
      <Segment className="centered loginOuter">
        {
          ((passwordUpdated && passwordUpdatedMsg) || loginMsg) &&
          <Message>
            <span style={{ color: 'green' }}>{ passwordUpdatedMsg || loginMsg }</span>
          </Message>
        }
        <Form className="login-form" onSubmit={handleSubmit(this.handleLogin)}>
          <Input
            className="username"
            name="email"
            placeholder="Enter Your Email"
            type="text"
            size="large"
            validate={[required, email]}
          />
          {
            !showForgotPasswordFlag &&
            <Input
              name="password"
              placeholder="Enter Your Password"
              type="password"
              size="large"
              validate={[required]}
            />
          }
          <Button
            fluid
            primary
            type="submit"
            className={ showForgotPasswordFlag ? 'mb-10' : '' }
            loading={isLoading || loginBusy}
            content={ !showForgotPasswordFlag ? 'Login' : 'Submit' }
          />
          {
	          showForgotPasswordFlag &&
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
          !showForgotPasswordFlag &&
          <p className="pt-1 m-0 text-center">
            <div className="hand-pointer" onClick={ this.showForgotPassword }>
              Forgot your password ?
            </div>
          </p>
        }
      </Segment>
    );
  }
}