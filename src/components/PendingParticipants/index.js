import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm, reset} from 'redux-form/immutable';
import { Form, Grid } from  'semantic-ui-react';
import Input from '../../components/Form/Input';
import {required} from '../../utils/validations';
import {updateParticipantStatus} from '../../redux/modules/event';
import {getSocket} from '../../utils/commonutils';
import DragSortableList from 'react-drag-sortable'

const ItemContent = ({row, deleteParticipant, editParticipant, onSubmit, dispatch, loading, event}) => {
    const onUpdateScore = async(formData) => {
        const activeParticipants = event.participants.filter(row => {
            return row.status === 1;
        });
        const pendingParticipants = event.participants.filter(row => {
            return row.status === 0;
        });
        const data = {
            score: formData.toJS().score,
            eventId: event.id,
            status: 2,
            activeParticipantId: activeParticipants[0].id,
            nextParticipantId: pendingParticipants && pendingParticipants.length > 0 ? pendingParticipants[0].id : 0,
            scoreInterval: event.scoreInterval
        };
        await dispatch(updateParticipantStatus(data));
        dispatch(reset('eventParticipant'));
        let eventDetails = event;
        const participants = event.participants;
            if (participants) {
                eventDetails.participants = event.participants.filter(item => item.status === 1);
            }  
        getSocket().emit('updateLeaderboard', eventDetails);    
        getSocket().emit('activeParticipant', eventDetails);
        getSocket().emit('fanPoints',  event.id);

    }
    return (
        <div className="row">
            <Grid className="activeParticipate">
                <Grid.Column computer={5} tablet={16} mobile={16}>
                    <div className="row"> 
                        <i aria-hidden="true" className="resize vertical big icon left aligned"></i>
                        <h5 className="pendingUsers">
                            { row.name }{ row.status === 1 ? <font color="#00EE76">(Active)</font> : ''}
                        </h5>
                    </div>
                </Grid.Column>
                <Grid.Column computer={11} tablet={16} mobile={16} className="right aligned">
                    {
                        row.status === 1 ?
                        <div className="newEntry">
                            <Form className="login-form" onSubmit={onSubmit(onUpdateScore)}>
                                <Input  
                                    action={{ icon: 'save' }} 
                                    className="score left floated" 
                                    name="score" 
                                    placeholder="Score" type="text"
                                    size="small" 
                                    validate={[required]}/>
                            </Form>
                        </div> :
                        row.score
                    }
                    { <p  className="pendingUsers"><a onClick={() => deleteParticipant(row)}>Delete</a></p> }
                </Grid.Column>
            </Grid>
        </div>
    )
}
const getItems = (participants, handleSubmit, dispatch, isLoading, details, self) => {
    return Array.from(participants, (v, k) => v).map(v => {
        return ({
            id: `${v.id}`,
            content: (<ItemContent
                row={v}
                editParticipant={this.editParticipant}
                deleteParticipant={self.deleteParticipant}
                onSubmit={handleSubmit}
                dispatch={dispatch}
                loading={isLoading}
                event={details}/>)
        });
    });
}

class PendingParticipants extends Component {
    static propTypes = {
        dispatch: PropTypes.func,
        handleSubmit: PropTypes.func,
        isLoading: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.deleteParticipant = this.deleteParticipant.bind(this);
    }

    deleteParticipant(row) {
        const {deleteParticipant} = this.props;
        deleteParticipant(row);
    }
    onSort = async(sortedList, dropEvent) => {
        const { dispatch, details } = this.props;
        const index = details.participants.findIndex(x=>x.id===Number(sortedList[0].id));
        const firstParticipant = details.participants[index]; // first participant in sorted list

        const activeIndex = details.participants.findIndex(x=>x.status===1);
        const activeParticipant = details.participants[activeIndex]; // active participant in the list

        if(firstParticipant.status===0){ // if any participant moved to first position is inactive, make it active
            let payload = {
                eventId: details.id,
                status: 0,
                activeParticipantId: activeParticipant.id, // already active participant - make it inactive
                nextParticipantId: firstParticipant.id // next participant going to be active
                };
            await dispatch(updateParticipantStatus(payload));
            let eventDetails = details;
            const participants = details.participants;
                if (participants) {
                    eventDetails.participants = details.participants.filter(item => item.status === 1);
                }
            getSocket().emit('activeParticipant', eventDetails);    
        }
    }

    render() {
        const {participants, handleSubmit, dispatch, isLoading, details} = this.props;
        const items = getItems(participants, handleSubmit, dispatch, isLoading, details, this);
        return (
            <React.Fragment>
                <Grid>
                    <Grid.Row className="borderBottom">
                        <Grid.Column computer={6}>
                            <p><b>Name</b></p>
                        </Grid.Column>
                        <Grid.Column computer={4}>
                            <p><b>Score</b></p>
                        </Grid.Column>
                        <Grid.Column computer={6} className="right aligned">
                            <p><b>Action</b></p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Grid.Row>
                    <Grid.Column colSpan={3}>
                        <DragSortableList
                        onSort={this.onSort}
                        items={items}
                        dropBackTransitionDuration={0.3} type="vertical"/>
                    </Grid.Column>
                </Grid.Row>
            </React.Fragment>
        );
    }
}
export default connect(state => ({
    isLoading: state.get('event').get('isLoad'),
    details: state.get('event').get('details'),
}))(reduxForm({
    form: 'eventParticipant'
})(PendingParticipants));