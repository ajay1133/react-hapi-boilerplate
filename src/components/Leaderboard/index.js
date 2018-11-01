import React, { Component } from 'react';
import  PropTypes from 'prop-types';
import { Grid, Table } from  'semantic-ui-react';
import { connect } from 'react-redux'

const TableRow = ( { row, index }) => {
  let number = row.phoneNumber.slice(-4);
  var phoneNumber = ['xxx', '-', 'xxx', '-', number].join('');
  return (
    <Table.Row key={row.id}>
      <Table.Cell>
        {index+1}
      </Table.Cell> 
      <Table.Cell>
        {phoneNumber}
      </Table.Cell> 
      <Table.Cell>
      <span className="scoreResult">{row.fanPoints}</span>
      </Table.Cell>   
    </Table.Row>
  )
}

class Leaderboard extends Component {

  static propTypes= {
    dispatch: PropTypes.func,
    events: PropTypes.array
  }

  render () {
    const { eventFan } = this.props;
    return (
      <Grid>

        <Grid.Row>
          <Table celled className="leaderBoard">
          <Table.Header>
            <tr>
              <th></th> 
              <th className="scoreResult  "> Leaderboard</th>
              
              <th> <span className="scoreResult">{ eventFan && eventFan.count } </span>of Fans:</th>
            </tr>
          </Table.Header>
            <Table.Body>
            { eventFan &&
              eventFan.rows.map((row, index) => {
                return <TableRow key={row.id} row={row} index={index}  />
              })
            }
            </Table.Body>
          </Table>
        </Grid.Row>
      </Grid>  
    )
  }
}


export default connect(state => ({
  eventFan: state.get('event').get('eventFan')
}))(Leaderboard);