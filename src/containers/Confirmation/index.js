import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Message, Container } from  'semantic-ui-react'
import { verifyToken, updatePassword } from '../../redux/modules/account'
import ChangePassword from '../../components/ChangePassword'
import { push } from 'react-router-redux'

class Confirmation extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    dispatch: null,
    isLoading: false
  };
  constructor(props) {
    super(props);
    
    this.savePassword = this.savePassword.bind(this);
  }

  savePassword (details) {
    const { dispatch } = this.props;
    const accountDetail = {
      password: details.password,
      confirmPassword : details.confirmPassword,
      inviteToken: this.props.match.params.inviteToken
    }
    dispatch(updatePassword(accountDetail)).then(response => {
      setTimeout(function() {
        dispatch(push('/'));
      }, 3000);
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(verifyToken(this.props.match.params.inviteToken));
  }


  render() {
    const { tokenValid, confirmationErr, passUpdated } = this.props;

    return (
    <Container>
      <Grid centered  verticalAlign="middle">
        <Grid.Column   mobile={16} tablet={8} computer={8}>
          { passUpdated ? <Message negative> <Message.Header>Your password updated. Please login using new password.</Message.Header> </Message> : null }
          { tokenValid ? <ChangePassword savePassword = {this.savePassword} /> : <Message negative> <Message.Header> { confirmationErr } </Message.Header> </Message> }
        </Grid.Column>
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
