import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Grid, Header, Message, Confirm, Icon, Segment, List, Form, Loader } from  'semantic-ui-react';
import { Field, reduxForm } from 'redux-form/immutable';
import { DropDown } from '../../components/Form';
import { loadAccounts, saveAccount, updateAccount, selectUser } from '../../redux/modules/account';
import AccountModal  from '../../components/AccountModal';
import Pagination from '../../components/Pagination';
import {
  strictValidArrayWithLength,
  validObjectWithParameterKeys,
  strictValidArrayWithMinLength
} from '../../utils/commonutils';
import { OFFSET } from '../../utils/constants';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

const rowBgColor = [];
rowBgColor[1] = 'bg-success';
rowBgColor[2] = 'bg-warning';
rowBgColor[3] = 'bg-danger';

const statusDropDownArr = [
  { key: 0, text: 'Please select', value: '' },
  { key: 2, text: 'Pending', value: 2, label: { color: 'yellow', empty: true, circular: true }, },
  { key: 3, text: 'Denied', value: 3, label: { color: 'red', empty: true, circular: true }, },
  { key: 1, text: 'Active', value: 1, label: { color: 'green', empty: true, circular: true } },
];
const TableRow = ({row, editAccount, typeAction}) => (
  <Table.Row className={(row.status) ? rowBgColor[row.status] : 'bg-warning'}>
    <Table.Cell>{ row.firstName } { row.lastName }</Table.Cell>
    <Table.Cell>{ row.email } </Table.Cell>
    <Table.Cell>{ row.phone }</Table.Cell>
    <Table.Cell>
      <a onClick={ () => editAccount(row) } >  <Icon name='edit outline' size='small' /> </a>
      <a onClick={() => typeAction('delete', row)} > <Icon name='trash alternate outline' size='small' /> </a>
      <a onClick={() => typeAction('active', row)} > <Icon name='check circle outline' size='small' /></a>
      <a onClick={() => typeAction('denied', row)} > <Icon name='eye slash outline' size='small' /> </a>
    </Table.Cell>
  </Table.Row>
);

@connect(state => ({
  items: state.get('account').get('items'),
	itemsFilters: (
	  validObjectWithParameterKeys(state.get('account').get('itemsFilters'), ['page']) &&
    state.get('account').get('itemsFilters')
  ) || state.get('account').get('itemsFilters').toJSON() || {},
	itemsCount: state.get('account').get('itemsCount'),
  loadErr: state.get('account').get('loadErr'),
  accountErr: state.get('account').get('accountErr'),
  message: state.get('bitBucketRepo').get('message') || state.get('account').get('accountMsg'),
  isLoad: state.get('bitBucketRepo').get('isLoad')
}))
@reduxForm({
  form: 'listAccountFiltersForm',
	enableReinitialize: true
})
export default class Accounts extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    message: PropTypes.string,
    isLoad: PropTypes.bool,
  };
  
  static defaultProps = {
    dispatch: null
  };
  
  state = {
    loading: true,
    selectedUser: null,
    openConfirmBox: false,
    type: null,
    showMessageFlag: true
  };
  
  constructor(props) {
    super(props);
    this.account = this.account.bind(this);
    this.editAccount = this.editAccount.bind(this);
    this.typeAction = this.typeAction.bind(this);
    this.closeConfirmBox = this.closeConfirmBox.bind(this);
  };
  
  componentDidMount = async () => {
	  const { dispatch, itemsFilters } = this.props;
	  await dispatch(loadAccounts(itemsFilters));
	  this.setState({ loading: false });
  };
  
  handleConfirm = async () => {
    const { selectedUser, type } = this.state;
    const { dispatch } = this.props;
    
    let accountDetail = {
      id: selectedUser.id,
      title: selectedUser.title,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      email: selectedUser.email,
      phone: selectedUser.phone,
      website: selectedUser.website,
      description: selectedUser.description,
      image: selectedUser.image,
      featuredVideo: selectedUser.featuredVideo
    };
    
    if (type === 'delete') {
      accountDetail.isDeleted = true;
    } else if (type === 'active'){
      accountDetail.status = 1;
    } else if (type === 'denied') {
      accountDetail.status = 3;
    }
    
    this.setState({ loading: true });
    await dispatch(updateAccount(accountDetail, false));
	  this.setState({
      loading: false,
      openConfirmBox: false,
      selectedUser: null
	  });
  };
  
  editAccount = async row => {
    const { dispatch } = this.props;
	  this.setState({ loading: true });
    await dispatch(selectUser(row));
    this.setState({
      loading: false,
      selectedUser: row
    });
  };
  
  typeAction = (type, row) => this.setState({ openConfirmBox: true, type, selectedUser: row });
  
  account = async details => {
    const { dispatch } = this.props;
    delete details.events;
    Object.keys(details).filter(key => !details[key]).forEach(key => delete details[key]);
	  this.setState({ loading: true });
	  const response = (details.id)
		  ? await dispatch(updateAccount(details, true))
		  : await dispatch(saveAccount(details));
	  this.setState({ loading: false });
	  return response;
  };
  
  handleSort = async sortCol => {
	  const { itemsFilters } = this.props;
	  const { dispatch } = this.props;
	  this.setState({ loading: true });
	  const initialColumnOrderList = validObjectWithParameterKeys(itemsFilters, ['order']) &&
      strictValidArrayWithLength(itemsFilters.order) && itemsFilters.order.filter(v => v[0] === sortCol);
	  const sortDir = strictValidArrayWithLength(initialColumnOrderList) &&
      strictValidArrayWithMinLength(initialColumnOrderList[0], 2) ? initialColumnOrderList[0][1] || 'ASC' : 'ASC';
	  const newSortDir = sortDir.toUpperCase() === 'ASC' ? 'DESC' : 'ASC';
	  const newOrderByList = [[sortCol, newSortDir]];
	  dispatch(loadAccounts(Object.assign(itemsFilters, { order: newOrderByList })));
	  this.setState({ loading: false });
  };
  
  handleStatus = async (e, status) => {
    let { itemsFilters } = this.props;
    const { dispatch } = this.props;
	  this.setState({ loading: true });
	  itemsFilters.page = 1;
    dispatch(loadAccounts(Object.assign(itemsFilters, { status })));
	  this.setState({ loading: false });
  };
	
	handleNavigatePage = (page) => {
		const { itemsFilters } = this.props;
		const { dispatch } = this.props;
		this.setState({ loading: true });
		dispatch(loadAccounts(Object.assign(itemsFilters, { page })));
		this.setState({ loading: false });
  };
	
	getSortClass = sortCol => {
	  let { itemsFilters } = this.props;
	  let sortClass = 'sortAsc';
	  let sortIconClass = 'down';
	  if (validObjectWithParameterKeys(itemsFilters, ['order'])) {
		  const colSortList = strictValidArrayWithLength(itemsFilters.order) &&
        itemsFilters.order.filter(v => v[0] === sortCol);
		  if (strictValidArrayWithLength(colSortList) && strictValidArrayWithMinLength(colSortList[0], 2)) {
			  sortClass = colSortList[0][1].toUpperCase() === 'ASC' ? 'active sortAsc' : 'active sortDesc';
			  sortIconClass = colSortList[0][1].toUpperCase() === 'ASC' ? 'down' : 'up';
		  }
    }
    return {
	    sortClass,
	    sortIconClass
    }
  };
	
  messageDismiss = () => this.setState({ showMessageFlag: false });
  
  closeConfirmBox = () => this.setState({ openConfirmBox: false, selectedUser: null });
  
  render() {
    const { items, itemsFilters, itemsCount, loadErr, accountErr, message } = this.props;
    const { loading, selectedUser, showMessageFlag, openConfirmBox, type } = this.state;
	
	  return (
      <AuthenticatedUser>
			  {
				  message && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
          </Message>
			  }
			  {
				  (loadErr || accountErr) && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr || accountErr }</span>
          </Message>
			  }
	      {
		      loading &&
          <Loader active inline='centered'>Loading...</Loader>
	      }
        {
          !loading &&
          <Grid>
            <div className="ui left floated column innerAdjust">
              <h3 className="mainHeading"> Accounts</h3>
            </div>
            <Grid.Row>
              <Grid.Column computer={12}>
                <List horizontal floated='right'>
                  <List.Item>
                    <span className="statusPending"/>
                    <List.Content floated='right'> Pending </List.Content>
                  </List.Item>
                  <List.Item>
                    <span className="statusDenied"/>
                    <List.Content floated='right'> Denied </List.Content>
                  </List.Item>
                  <List.Item>
                    <span className="statusActive"/>
                    <List.Content floated='right'> Active </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content floated='right'>
                      <Form className="mt-10">
                        <Field
                          className="minWidth130"
                          name="status"
                          component={ DropDown }
                          options={ statusDropDownArr }
                          inline={ true }
                          fluid={ true }
                          search={ true }
                          selectOnBlur={ true }
                          placeholder="Please select"
                          onChange={(e, v) => this.handleStatus(e, v)}
                        />
                      </Form>
                    </List.Content>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column  computer={12}>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell className={`${this.getSortClass('firstName').sortClass}` }>
                        <a onClick={() => this.handleSort('firstName') }>Name
                          <i className={`sort amount ${this.getSortClass('firstName').sortIconClass} icon ml-05`}></i>
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell className={`${this.getSortClass('email').sortClass}` }>
                        <a onClick={() => this.handleSort('email') }>Email
                          <i className={`sort amount ${this.getSortClass('email').sortIconClass} icon ml-05`}></i>
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell className={`${this.getSortClass('phone').sortClass}` }>
                        <a onClick={() => this.handleSort('phone') }>Phone
                          <i className={`sort amount ${this.getSortClass('phone').sortIconClass} icon ml-05`}></i>
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
					          {
						          strictValidArrayWithLength(items) &&
						          items.map(user => (
                        <TableRow
                          key={user.id}
                          row={user}
                          editAccount={this.editAccount}
                          typeAction={this.typeAction}
                        />
                      ))
					          }
	                  {
		                  !strictValidArrayWithLength(items) &&
		                  <Table.Row>
			                  <Table.Cell colSpan="100%" style={{ color: 'red', textAlign: 'center' }}>
				                  No users found
			                  </Table.Cell>
		                  </Table.Row>
	                  }
                  </Table.Body>
                </Table>
			          {
				          strictValidArrayWithLength(items) &&
                  <Pagination
                    totalEntries={itemsCount}
                    offset={OFFSET}
                    currentPage={itemsFilters.page}
                    navigate={(page) => this.handleNavigatePage(page)}
                  />
			          }
              </Grid.Column>
              <Grid.Column computer={4}>
                <Confirm
                  content={`Are you sure you want to ${type} this user ?`}
                  confirmButton="Confirm"
                  open={openConfirmBox}
                  onCancel={this.closeConfirmBox}
                  onConfirm={this.handleConfirm}
                />
                <Header as='h4' attached='top' className="Primary">
				          { selectedUser ? 'Edit Profile' : 'Add New Profile' }
                </Header>
                <Segment attached>
                  <AccountModal
                    account = {this.account}
                    selectedUser = {selectedUser}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </AuthenticatedUser>
	  );
  }
}
