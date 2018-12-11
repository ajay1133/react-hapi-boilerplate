import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Message, Container, Loader } from  'semantic-ui-react';
import { verifyToken, updatePassword } from '../../redux/modules/account';
import ChangePassword from '../../components/ChangePassword';
import { push } from 'react-router-redux';
import { DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES } from '../../utils/constants';

class Confirmation extends Component {
  state = {
    loading: true
  };
  
  static propTypes = {
    dispatch: PropTypes.func,
    isLoading: PropTypes.bool,
	  tokenValid: PropTypes.bool,
	  passUpdated: PropTypes.bool,
    confirmationErr: PropTypes.string
  };

  static defaultProps = {
    dispatch: null,
    isLoading: false
  };
  
  constructor(props) {
    super(props);
    this.savePassword = this.savePassword.bind(this);
  }

  savePassword = async (details) => {
    const { dispatch } = this.props;
    
    const accountDetail = {
      password: details.password,
      confirmPassword : details.confirmPassword,
      inviteToken: this.props.match.params.inviteToken
    };
	
	  this.setState({ loading: true });
    await dispatch(updatePassword(accountDetail));
	  this.setState({ loading: false });
   
	  setTimeout(function() {
		  dispatch(push('/'));
	  }, DEFAULT_MILLISECONDS_TO_SHOW_MESSAGES);
  };

  componentDidMount = async () => {
    const { dispatch } = this.props;
    await dispatch(verifyToken(this.props.match.params.inviteToken));
	  this.setState({ loading: false });
  };
  
  render() {
    const { tokenValid, confirmationErr, passUpdated, isLoading } = this.props;
    const { loading } = this.state;
    
    return (
      <Container>
        <Grid centered verticalAlign="middle">
          {
            loading &&
            <Loader>Loading...</Loader>
          }
          {
            !loading &&
            <Grid.Column mobile={16} tablet={8} computer={8}>
	            {
		            passUpdated &&
                <Message negative>
                  <Message.Header>Your password is updated. Please login using your new password.</Message.Header>
                </Message>
	            }
	            {
		            tokenValid &&
                <ChangePassword
                  savePassword = {this.savePassword}
                  isButtonLoading={isLoading}
                />
	            }
	            {
		            !tokenValid &&
                <Message negative> <Message.Header> { confirmationErr } </Message.Header> </Message>
	            }
            </Grid.Column>
          }
        </Grid>
      </Container>
    );
  }
}

export default connect(state => ({
  tokenValid: state.get('account').get('tokenValid'),
  passUpdated: state.get('account').get('passUpdated'),
  confirmationErr: state.get('account').get('confirmationErr')
}))(Confirmation);
