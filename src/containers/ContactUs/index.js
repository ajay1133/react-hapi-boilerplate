import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Grid, Message, Loader } from  'semantic-ui-react';
import { getContactList } from '../../redux/modules/contact';
import Pagination from '../../components/Pagination';
import {
  strictValidArrayWithLength,
  validObjectWithParameterKeys,
  strictValidArrayWithMinLength,
  typeCastToKeyValueObject
} from '../../utils/commonutils';
import AuthenticatedUser from '../../components/AuthenticatedUser';
import '../../style/css/style.css';

const TableRow = ({ row }) => (
  validObjectWithParameterKeys(row, ['name', 'email', 'message']) && 
  (
    <Table.Row>
      <Table.Cell>{ row.name }</Table.Cell>
      <Table.Cell>{ row.email } </Table.Cell>
      <Table.Cell>{ row.message }</Table.Cell>
    </Table.Row>
  )
);

@connect(state => ({
  user: state.get('auth').get('user'),
  items: state.get('contact').get('items'),
  itemsFilters: typeCastToKeyValueObject(state.get('contact').get('itemsFilters'), ['page']),
  itemsCount: state.get('contact').get('itemsCount'),
  isLoad: state.get('contact').get('isLoad'),
  message: state.get('contact').get('message'),
  error: state.get('contact').get('error')
}))
export default class ContactUs extends Component {
  static propTypes = {
    user: PropTypes.object,
    dispatch: PropTypes.func,
    items: PropTypes.array,
    itemsFilters: PropTypes.object,
    itemsCount: PropTypes.number,
    isLoad: PropTypes.bool,
    message: PropTypes.string,
    loadErr: PropTypes.string
  };
  
  static defaultProps = {
    dispatch: null,
    items: PropTypes.object
  };
  
  state = {
    loading: true,
    showMessageFlag: true
  };
  
  componentDidMount = async () => {
    const { dispatch, itemsFilters } = this.props;
    await dispatch(getContactList(itemsFilters));
    this.setState({ loading: false });
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
	  await dispatch(getContactList(Object.assign(itemsFilters, { order: newOrderByList })));
	  this.setState({ loading: false });
  };
  
  handleNavigatePage = async page => {
		const { itemsFilters } = this.props;
		const { dispatch } = this.props;
    this.setState({ loading: true });
    await dispatch(getContactList(Object.assign(itemsFilters, { page })));
		this.setState({ loading: false });
  };
  
  render() {
    const { items, itemsFilters, itemsCount, isLoad, message, loadErr } = this.props;
    const { loading, showMessageFlag } = this.state;
    
    return (
      <AuthenticatedUser>
        {
          message && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'green' }}>{ message }</span>
          </Message>
        }
        {
          loadErr && showMessageFlag &&
          <Message onDismiss={this.messageDismiss}>
            <span style={{ color: 'red' }}>{ loadErr }</span>
          </Message>
        }
        {
		      (loading || isLoad) &&
          <Loader active inline='centered'>Loading...</Loader>
	      }
        {
          !loading && !isLoad &&
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
                        <a onClick={() => this.handleSort('name') }>
                          Name
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <a onClick={() => this.handleSort('email') }>
                          Email
                        </a>
                      </Table.HeaderCell>
                      <Table.HeaderCell>
                        <a onClick={() => this.handleSort('message') }>
                          Message
                        </a>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      strictValidArrayWithLength(items) &&
                      items.map((contact, idx) => (
                        <TableRow
                          key={idx}
                          row={contact}
                        />
                      ))
                    }
                    {
                      !strictValidArrayWithLength(items) &&
                      <Table.Row>
                        <Table.Cell colSpan="100%" style={{ color: 'red', textAlign: 'center' }}>
                          No contacts found
                        </Table.Cell>
                      </Table.Row>
                    }
                  </Table.Body>
                </Table>
                {
                  strictValidArrayWithLength(items) &&
                  <Pagination
                    totalEntries={itemsCount}
                    offset={itemsFilters.limit}
                    currentPage={itemsFilters.page}
                    navigate={page => this.navigatePage(page)}
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
