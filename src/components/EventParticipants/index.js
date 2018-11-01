import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Header } from  'semantic-ui-react';
import EditScore from '../../components/EditParticipantScore';
import { selectEventParticipant } from '../../redux/modules/event';

const TableRow = ({row, deleteParticipant, editParticipant,onSubmit, dispatch, loading, event }) =>{
  return(    
        <Table.Row>
        <Table.Cell>
          { row.name } { row.status === 1 ? <font color="#00EE76">(Active)</font>:''}
        </Table.Cell>
        <Table.Cell>{ row.score } </Table.Cell>
        <Table.Cell className="right aligned">
        { 
          row.status === 0 ? 
          <a onClick={() => deleteParticipant(row)}>Delete</a> : 
          <a onClick={() => editParticipant(row)}>Edit</a> 
        }
        </Table.Cell>
      </Table.Row>
  )
} 

class EventParticipants extends Component {
  static propTypes = {
    dispatch: PropTypes.func
  };

  static defaultProps = {
    dispatch: null
  };

  constructor(props) {
    super(props);
    this.deleteParticipant = this.deleteParticipant.bind(this);
    this.editParticipant = this.editParticipant.bind(this);
  }

  state = {
    modalOpen: false
  };

  deleteParticipant(row) {
    const { deleteParticipant } = this.props;
    deleteParticipant(row);
  }
  editParticipant(row) {
    const { dispatch } = this.props;
    dispatch(selectEventParticipant(row));
    this.setState({ modalOpen: true });
  }
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const { participants } = this.props;
    return (
      <React.Fragment>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon>
          <Header content='Edit Completed Participant' />      
            <Modal.Content>
              <EditScore handleClose={this.handleClose} />
           </Modal.Content>
        </Modal>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell className="right aligned">Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              participants.map(row => {
                return <TableRow key={row.id} row={row} editParticipant={this.editParticipant}      
                   deleteParticipant={this.deleteParticipant} />
              })
            }
        </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}
export default EventParticipants;


