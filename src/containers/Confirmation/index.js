import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Message, Container, Loader } from  'semantic-ui-react';
import { verifyInviteToken, updatePassword } from '../../redux/modules/account';
import ChangePassword from '../../components/ChangePassword';
import { validObjectWithParameterKeys, typeCastToString } from '../../utils/commonutils';
import { DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';
import { push } from 'react-router-redux';

class Confirmation extends Component {
  state = {
    loading: true
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    isLoading: PropTypes.bool,
	  tokenValid: PropTypes.bool,
	  passwordUpdated: PropTypes.bool,
    confirmationErr: PropTypes.string
  };

  static defaultProps = {
    dispatch: null,
    isLoading: false
  };
  
  savePassword = async (details) => {
    const { dispatch, match } = this.props;
    const accountDetail = {
		  password: details.password,
		  confirmPassword : details.confirmPassword,
      token: (
        validObjectWithParameterKeys(match, ['params']) && 
        validObjectWithParameterKeys(match.params, ['inviteToken']) && 
        typeCastToString(match.params.inviteToken)
      ) || ''  
	  };
	  this.setState({ loading: true });
    await dispatch(updatePassword(accountDetail, true));
	  this.setState({ loading: false });
    setTimeout(() => dispatch(push('/')), DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
  };

  componentDidMount = async () => {
    const { dispatch, match } = this.props;
    if (
      validObjectWithParameterKeys(match, ['params']) && 
      validObjectWithParameterKeys(match.params, ['inviteToken'])
    ) {
      await dispatch(verifyInviteToken(typeCastToString(match.params.inviteToken)));
	    this.setState({ loading: false });
    }
  };
  
  render() {
    const { tokenValid, confirmationErr, passwordUpdated, isLoading } = this.props;
    const { loading } = this.state;
    return (
      <Container>
        <Grid centered verticalAlign="middle">
          <Grid.Column mobile={16} tablet={8} computer={8}>
	          {
		          loading &&
              <Loader active inline='centered'>Loading...</Loader>
	          }
            {
	            !loading && passwordUpdated &&
              <Message>
                <span style={{ color: 'green' }}>Successfully updated account password</span>
              </Message>
            }
            {
	            !loading && passwordUpdated &&
              <Loader active inline='centered'>Redirecting to login page.</Loader>
            }
            {
              !loading && !passwordUpdated && tokenValid &&
              <ChangePassword
                savePassword = {this.savePassword}
                isButtonLoading = {isLoading}
              />
            }
            {
              !loading && !passwordUpdated && !tokenValid &&
              <Message negative> <Message.Header> { confirmationErr } </Message.Header> </Message>
            }
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default connect(state => ({
  tokenValid: state.get('account').get('tokenValid'),
  confirmationErr: state.get('account').get('confirmationErr'),
  passwordUpdated: state.get('account').get('passwordUpdated'),
  isLoading: state.get('account').get('isLoading'),
}))(Confirmation);
