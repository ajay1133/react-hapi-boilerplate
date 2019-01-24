import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Grid, Message, Loader } from  'semantic-ui-react';
import { getContactList, setContactPage } from '../../redux/modules/contact';
import Pagination from '../../components/Pagination';
import {
  strictValidArrayWithLength,
} from '../../utils/commonutils';
import { OFFSET } from '../../utils/constants';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

const TableRow = ({ row }) => (
  <Table.Row>
    <Table.Cell>{ row.name }</Table.Cell>
    <Table.Cell>{ row.email } </Table.Cell>
    <Table.Cell>{ row.message }</Table.Cell>
  </Table.Row>
);

@connect(state => ({
  user: state.get('auth').get('user'),
  contactList: state.get('contact').get('contactList'),
  sorting: state.get('contact').get('contactSortOrder'),
  contactCount: state.get('contact').get('contactCount'),
  currentPage: state.get('contact').get('contactCurrentPage'),
  error: state.get('contact').get('error')
}))
export default class ContactUs extends Component {
  static propTypes = {
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    dispatch: PropTypes.func,
    contactList: PropTypes.array,
    sorting: PropTypes.object,
    contactCount: PropTypes.number,
    currentPage: PropTypes.number,
    message: PropTypes.string
  };
  
  static defaultProps = {
    dispatch: null
  };
  
  state = {
    loading: true,
    showMessageFlag: true,
    offset: OFFSET,
    sorting: this.props.sorting,
    currentPage: this.props.currentPage,
  };
  
  componentDidMount = async () => {
    const { dispatch } = this.props;
    const { offset, sorting } = this.state;
    
    await dispatch(getContactList(1, offset, sorting));
    this.setState({ loading: false });
  };
  
  handleSort = async (clickedColumn) => {
    const { dispatch, sorting } = this.props;
    const { currentPage, offset } = this.state;
    const sort = {
      sortBy: clickedColumn,
      order: sorting.Order
    };
    this.setState({ sorting: sort, loading: true });
    await dispatch(getContactList(currentPage, offset, sort));
    this.setState({ loading: false });
  };
  
  navigatePage = async (pageNo) => {
    const { dispatch } = this.props;
    const { offset, sorting } = this.state;
    this.setState({ currentPage: pageNo, loading: true });
    await dispatch(setContactPage(pageNo));
    await dispatch(getContactList(pageNo, offset, sorting));
    this.setState({ loading: false });
  };
  
  render() {
    const { contactList, contactCount, message, error } = this.props;
    const { loading, showMessageFlag, currentPage } = this.state;
    
    return (
      <AuthenticatedUser>
        {
          message && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
          </Message>
        }
        {
          error && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ error }</span>
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
              <h3 className="mainHeading"> ContactUs</h3>
            </div>
            <Grid.Row>
              <Grid.Column  computer={16}>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        <a onClick={() => this.handleSort('name') }>Name
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <a onClick={() => this.handleSort('email') }>Email
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <a onClick={() => this.handleSort('message') }>Message
                        </a>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      strictValidArrayWithLength(contactList) &&
                      contactList.map((contact, idx) => (
                        <TableRow
                          key={idx}
                          row={contact}
                        />
                      ))
                    }
                    {
                      !strictValidArrayWithLength(contactList) &&
                      <Table.Row>
                        <Table.Cell colSpan="100%" style={{ color: 'red', textAlign: 'center' }}>
                          No contacts found
                        </Table.Cell>
                      </Table.Row>
                    }
                  </Table.Body>
                </Table>
                {
                  strictValidArrayWithLength(contactList) &&
                  <Pagination
                    totalEntries={contactCount}
                    offset={OFFSET}
                    currentPage={currentPage}
                    navigate={(page) => this.navigatePage(page)}
                  />
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        }
      </AuthenticatedUser>
    );
  }
}
