import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form/immutable';
import { Button, Form, Grid, Loader } from 'semantic-ui-react';
import { TextBox, TextArea } from '../Form';
import { required, email, normalizePhone, url } from '../../utils/validations';
import { validObjectWithParameterKeys } from '../../utils/commonutils';

@connect(state => ({
  initialValues: state.get('account').get('selectedUser')
}))
@reduxForm({
  form: 'accountForm',
  enableReinitialize: true
})
export default class AccountModal extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    account: PropTypes.func,
    selectedUser: PropTypes.object,
    error: PropTypes.string,
	  handleEditUserCancel: PropTypes.func
  };
  
  state = {
    loading: false
  };
  
  constructor(props) {
    super(props);
    this.account = this.account.bind(this);
  };
  
  account = async (formData) => {
    const { dispatch, account, selectedUser } = this.props;
    const accountData = formData.toJS();
    this.setState({ loading: true });
    await account(accountData);
    if (!validObjectWithParameterKeys(selectedUser, ['id'])) {
      dispatch(reset('accountForm'));
    }
	  this.setState({ loading: false });
  };
  
  handleEditUserCancel = async () => {
	  const { handleEditUserCancel } = this.props;
	  this.setState({ loading: true });
	  await handleEditUserCancel();
	  this.setState({ loading: false });
  };
  
  render() {
    const { handleSubmit, submitting, selectedUser } = this.props;
    
    if (this.state.loading) {
      return (
        <Loader active inline='centered'>Loading...</Loader>
      );
    }
    
    return (
      <Form className="mt-10" onSubmit={handleSubmit(this.account)}>
        <Field
          name="title"
          placeholder="Title"
          component={TextBox}
          validate={required}
        />
        <Form.Field>
          <Grid columns='equal'>
            <Grid.Column>
              <Field
                name="firstName"
                placeholder="First Name"
                component={TextBox}
                validate={required}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Field
                name="lastName"
                placeholder="Last Name"
                component={TextBox}
              />
            </Grid.Column>
          </Grid>
        </Form.Field>
        <Field
          name="email"
          placeholder="Email"
          component={TextBox}
          validate={email}
          readOnly={validObjectWithParameterKeys(selectedUser, ['id'])}
        />
        <Field
          name="phone"
          placeholder="Phone Number"
          component={TextBox}
          normalize={ normalizePhone }
        />
        <Field
          name="website"
          placeholder="Website Url"
          component={TextBox}
          validate={url}
        />
        <Field
          name="description"
          placeholder="Description"
          component={TextArea}
        />
        <Button
          type="submit"
          primary
          disabled={submitting}
          loading={submitting}
        >
          { validObjectWithParameterKeys(selectedUser, ['id']) ? 'Save Profile' : 'Add Profile' }
        </Button>
        {
	        validObjectWithParameterKeys(selectedUser, ['id']) &&
          <Button
            type="button"
            primary
            onClick={() => this.handleEditUserCancel()}
	        >
            Cancel
	        </Button>
        }
      </Form>
    );
  }
}
