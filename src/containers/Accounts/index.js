import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Modal, Grid, Button, Header, Message, Confirm } from  'semantic-ui-react'
import { loadAccounts, saveAccount, sortAccounts, selectUser } from '../../redux/modules/account'
import AddAccount from '../../components/AddAccount'
import Pagination from '../../components/Pagination';
import { OFFSET } from '../../utils/constants';
import AuthenticatedUser from '../../components/AuthenticatedUser';
//import {Link} from  'react-router-dom'

const TableRow = ({row, editAccount, deleteAccount}) => (
  <Table.Row>
    <Table.Cell>{ row.firstName } { row.lastName }</Table.Cell>
    <Table.Cell>{ row.email } </Table.Cell>
    <Table.Cell>{ row.phone }</Table.Cell>
    <Table.Cell>
      <a onClick={ () => editAccount(row) } > Edit </a> |
      <a onClick={() => deleteAccount(row)} > Delete </a>
    </Table.Cell>
  </Table.Row>
  )


class Accounts extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    dispatch: null,
    isLoading: false
  };
  state = {
    modalOpen: false,
    currentPage: 1,
    sortDir: 'asc',
    sortCol: 'firstName',
    selectedUser: null,
    openConfirmBox: false
  }
  constructor(props) {
    super(props);
    this.saveAccount = this.saveAccount.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.editAccount = this.editAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.closeConfirmBox = this.closeConfirmBox.bind(this);
  }

  handleOpen = () => {
    const { dispatch } = this.props;
    dispatch(selectUser(undefined));
    this.setState({ modalOpen: true })
  }

  handleClose = () => this.setState({ modalOpen: false, selectedUser: null })

  closeConfirmBox = () => this.setState({ openConfirmBox: false, selectedUser: null })

  handleConfirm = () => {
    const { selectedUser } = this.state;
    const { dispatch } = this.props;
    let accountDetail = {
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      phone: selectedUser.phone,
      email: selectedUser.email,
      id: selectedUser.id,
      isDeleted: true
    }
    dispatch(saveAccount(accountDetail)).then(response => {
      this.setState({openConfirmBox: false, selectedUser: null});
    });
  }

  editAccount = (row) => {
    const { dispatch } = this.props;
    dispatch(selectUser(row));
    this.setState({ modalOpen: true, selectedUser: row })
  }

  deleteAccount = (row) => {
    this.setState({ openConfirmBox: true, selectedUser: row })
  }

  saveAccount (details) {
    const { dispatch } = this.props;
    const { selectedUser } = this.state;
    const elem = this;
    let accountDetail = {
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phone: details.phone
    }
    if (selectedUser) {
      accountDetail.id = selectedUser.id;
      accountDetail.isDeleted =false;
    }
    return new Promise((resolve, reject) => {
      dispatch(saveAccount(accountDetail)).then(response => {
        if (response && response.id) {
          elem.setState({modalOpen: false, selectedUser: null});
          resolve(response);
        } else {
          elem.setState({modalOpen: false, selectedUser: null});
          reject(response)
        }
      });
    });

  
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(loadAccounts());
  }
  handleSort = clickedColumn => {
    const { dispatch } = this.props;
    const { sortDir } = this.state;

    dispatch(sortAccounts(sortDir === 'asc' ? 'desc' : 'asc',clickedColumn));
    this.setState({ sortDir : sortDir === 'asc' ? 'desc' : 'asc', sortCol : clickedColumn });
  };
  render() {
    const { items, loadErr, itemsCount } = this.props;
    const { sortCol, sortDir, selectedUser } = this.state;
    const sortDirClass = sortDir === 'asc' ? 'active sortAsc' : 'active sortDesc';
    let users = [];
    if (items && items.length > 0) {

        let begin = (this.state.currentPage - 1) * OFFSET;
        let end = OFFSET * this.state.currentPage;
        users = items.slice(begin, end)
    }
    if (loadErr) {
      return <Message negative> <Message.Header> {loadErr} </Message.Header> </Message>
    } else if (items) {
      return (
        <AuthenticatedUser>
          <Grid>
            <div className="ui left floated column innerAdjust">
              <h3 className="mainHeading"> Accounts</h3>
            </div>
            <Grid.Row>
              <Grid.Column>
                <Confirm
                  content="Are you sure you want to delete this user?"
                  confirmButton="Confirm"
                  open={this.state.openConfirmBox}
                  onCancel={this.closeConfirmBox}
                  onConfirm={this.handleConfirm}
                />
                <Modal className="innerModal" trigger={<Button icon='add' onClick={this.handleOpen} />}
                      open={this.state.modalOpen}
                      onClose={this.handleClose}
                      closeIcon>
                  <Header content= {selectedUser ? 'Edit Account' : 'Add New Account'} />
                  <Modal.Content>
                    <AddAccount
                      saveAccount = {this.saveAccount}
                      selectedUser = {selectedUser}
                    />
                  </Modal.Content>
                </Modal>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell
                        className={`${sortCol === 'firstName' ? sortDirClass : 'sortAsc'}` }>
                        <a onClick={() => this.handleSort('firstName') }>Name<i className="sort amount down icon ml-05"></i></a>
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        className={`${sortCol === 'email' ? sortDirClass : 'sortAsc'}` }>
                        <a onClick={() => this.handleSort('email') }>Email<i className="sort amount down icon ml-05"></i></a>
                      </Table.HeaderCell>
                      <Table.HeaderCell
                        className={`${sortCol==='phone' ? sortDirClass : 'sortAsc'}` }>
                        <a onClick={() => this.handleSort('phone') }>Phone<i className="sort amount down icon ml-05"></i></a>
                      </Table.HeaderCell>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { users.length > 0 &&
                      users.map(row => {
                        return <TableRow
                          key = {row.id}
                          row={row}
                          editAccount={this.editAccount}
                          deleteAccount={this.deleteAccount}
                        />
                      })
                    }
                  </Table.Body>
                  <Table.Footer>
                    <Table.Row>
                      <Table.HeaderCell colSpan='5'>
                        <Pagination
                          totalEntries={itemsCount}
                          offset={OFFSET}
                          currentPage={this.state.currentPage}
                          navigate={(page) => this.setState({ currentPage: page })}
                        />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Footer>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </AuthenticatedUser>
      );
    } else {
      return;
    }
  }
}

export default connect(state => ({
  items: state.get('account').get('items'),
  loadErr: state.get('account').get('loadErr'),
  itemsCount: state.get('account').get('itemsCount')
}))(Accounts);
