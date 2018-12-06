import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Message, Loader } from  'semantic-ui-react';
import { updateAccount, selectUser } from '../../redux/modules/account';
import AccountModal  from '../../components/AccountModal';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

@connect(state => ({
	user: state.get('auth').get('user'),
	isLoad: state.get('auth').get('isLoad'),
	loadErr: state.get('auth').get('loadErr'),
	accountMsg: state.get('account').get('accountMsg'),
	accountErr: state.get('account').get('accountErr')
}))

export default class Profile extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
	  user: PropTypes.object,
	  loadErr: PropTypes.string,
    isLoad: PropTypes.bool,
	  accountMsg: PropTypes.string,
	  accountErr: PropTypes.string
  };

  state = {
    loading: false,
    showMessageFlag: true
  };
  
  constructor(props) {
    super(props);
    this.account = this.account.bind(this);
  };
  
  componentDidMount() {
	  const { dispatch, user } = this.props;
	  dispatch(selectUser(user));
  };
  
  account = async details => {
    const { dispatch } = this.props;
    delete details.events;
    
    Object.keys(details).filter(k => !details[k]).forEach(k => delete details[k]);
	  
    this.setState({ loading: true });
    await dispatch(updateAccount(details, true));
    this.setState({ loading: false });
  };
  
  messageDismiss = () => this.setState({ showMessageFlag: false });
  
  render() {
    const { isLoad, loadErr, user, accountMsg, accountErr } = this.props;
    const { loading, showMessageFlag } = this.state;
	
	  const loadingCompleteFlag = !isLoad && !loading;
	  
	  return (
      <AuthenticatedUser>
        {
	        accountMsg && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ accountMsg }</span>
          </Message>
			  }
			  {
          (loadErr || accountErr) && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr || accountErr }</span>
          </Message>
			  }
			  
        <Grid>
          <div className="ui left floated column innerAdjust">
            <h3 className="mainHeading"> Profile</h3>
          </div>
          <Grid.Row>
            <Grid.Column>
	            { !loadingCompleteFlag && <Loader>Loading...</Loader> }
	            {
	            	loadingCompleteFlag &&
		            <AccountModal
			            account = {this.account}
			            selectedUser = {user}
		            />
	            }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </AuthenticatedUser>
	  );
  }
}
