import React, { Component } from 'react';
import { Form, Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form/immutable';
import Input from '../../components/Form/Input';
import { required } from '../../utils/validations';
import { connect } from 'react-redux';
import { updateEventParticipant } from '../../redux/modules/event';
import { getSocket } from '../../utils/commonutils';

class EditParticipantScore extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    errMessage: PropTypes.string
  };

  static defaultProps = {
    dispatch: null,
    handleSubmit: null,
    handleClose: null,
    errMessage: null
  };

  constructor(props) {
    super(props);
    this.updateParticipant = this.updateParticipant.bind(this);
  }

  state = {
    loading: false
  };

  updateParticipant = async (formData) => {
    const { dispatch, handleClose, event } = this.props;  
    const participant = formData.toJS();
    this.setState({ loading: true });
    const res = await dispatch(updateEventParticipant({
      id: participant.id,
      score: participant.score,
      isDeleted: false,
      nextParticipantId: undefined,
      eventId: event.id,
      scoreInterval: event.scoreInterval
    }));
    let eventDetails = Object.assign({}, event);
    const participants = event.participants;
      if (participants) {
          eventDetails.participants = event.participants.filter(item => item.status === 1);
      }
    getSocket().emit('fanPoints', event.id);
    getSocket().emit('updateLeaderboard', eventDetails);    
    this.setState({ loading: false });
    if (res) {     
      handleClose();
    }
  }


  render() {
    const { handleSubmit, errMessage } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Form onSubmit={handleSubmit(this.updateParticipant)}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Input
                  name="score"
                  placeholder="Score"
                  type="text"
                  size="small"
                  validate={[required]}
                />
              </Grid.Column>
              <Grid.Column>
                <Button className="ui large button front" type="submit" loading={loading}  primary>
                  Save
                </Button>
              </Grid.Column>
            </Grid.Row>
            {
              errMessage &&
              <Grid.Row>
                <Grid.Column>{errMessage}</Grid.Column>
              </Grid.Row>
            }
          </Grid>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    initialValues: state.get('event').get('eventParticipant'),
    event: state.get('event').get('details'),
    errMessage: state.get('event').get('errMessage')
  }))(reduxForm({
  form: 'participantScoreForm'
})(EditParticipantScore));