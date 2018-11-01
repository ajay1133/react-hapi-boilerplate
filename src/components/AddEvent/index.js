import React, {Component} from 'react'
import { Button, Form, Header, Grid } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form/immutable'
import { SCORE_INTERVAL_OPTIONS } from '../../utils/constants'
import Input from '../../components/Form/Input'
import ErrorText from '../../components/Form/ErrorText'
import Dropdown from '../../components/Form/Dropdown'
import { required } from '../../utils/validations'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import 'react-widgets/dist/css/react-widgets.css'
import { SubmissionError } from 'redux-form/immutable'
import { SCORE_ERROR_MESSAGE } from '../../utils/constants';

const renderDateTimePicker = ({input: {onChange, value}, meta: {touched, error}, showTime}) => {
        const hasError = touched && !!error;
       return (
        <div className={hasError?'error inline field':''}>
            <DateTimePicker 
            onChange={onChange}
            format="MM/DD/YYYY"
            time={showTime}
            value={!value ? null : new Date(value)}/>
            {hasError && <ErrorText content={error} />}
        </div>
    );
}

class AddEvent extends Component {

    static propTypes = {
        dispatch: PropTypes.func,
        handleSubmit: PropTypes.func,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        dispatch: null,
        handleSubmit: null,
        isLoading: false
    };

    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
    }

    addEvent(formData) {
        const {saveEvent} = this.props;
        const event = formData.toJS();
        if((event.maxScore - event.minScore)< (10 * event.scoreInterval)){
            throw new SubmissionError({ _error: SCORE_ERROR_MESSAGE });
        }
        return saveEvent(event).then(response => {
            console.log("Saved Successfully");
        }).catch(err => {
            console.log(err);            
            if (err.statusCode === 400 && err.message === "Event code already used.") {
                throw new SubmissionError({ number: err.message });
            } else {
                throw new SubmissionError({ _error: err.message });
            }
        });
    }

    render() {
        const { handleSubmit, error, submitting, initialValues } = this.props;
        return (
            <Form className="formStyle" onSubmit={handleSubmit(this.addEvent)}>
                <Header as='h3' className="side">Event Details</Header>
                <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column computer={8} tablet={16} mobile={16}>
                            <Form.Field>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column verticalAlign='middle' computer={4}>
                                            <label>Event Name</label>
                                        </Grid.Column>
                                        <Grid.Column computer={8}>
                                            <Input
                                                className="eventName"
                                                name="name"
                                                fluid
                                                placeholder="Event Name"
                                                type="text"
                                                size="small"
                                                validate={[required]}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>


                                    <Grid.Row>
                                        <Grid.Column verticalAlign='middle' computer={4}>
                                            <label>Date</label>
                                        </Grid.Column>
                                        <Grid.Column computer={8}>
                                            <Field 
                                            name="eventDate" 
                                            showTime={false} 
                                            component={renderDateTimePicker}
                                            validate={required}/>
                                        </Grid.Column>
                                    </Grid.Row>

                                   
                                     <Grid.Row>
                                     <Grid.Column verticalAlign='middle' computer={4}>
                                        <label>Score Interval</label>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <Dropdown
                                            name="scoreInterval"
                                            selection
                                            placeholder="Interval"
                                            validate={[required]}
                                            options={SCORE_INTERVAL_OPTIONS}
                                        />
                                    </Grid.Column>                                      
                                    </Grid.Row>
                                </Grid>

                            </Form.Field>


                        </Grid.Column>
                        <Grid.Column computer={8} tablet={16} mobile={16}>

                            <Grid>
                                <Grid.Row>
                                    <Grid.Column verticalAlign='middle' computer={4}>
                                        <label>Min Score</label>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <Input
                                            name="minScore"
                                            placeholder="Min Score"
                                            type="text"
                                            size="small"
                                            fluid
                                            validate={[required]}

                                        />
                                    </Grid.Column>
                                </Grid.Row>


                                <Grid.Row>
                                    <Grid.Column verticalAlign='middle' computer={4}>
                                        <label>Max Score</label>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <Input
                                            name="maxScore"
                                            placeholder="Max Score"
                                            type="text"
                                            size="small"
                                            validate={[required]}
                                            fluid
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                               <Grid.Row>
                                    <Grid.Column verticalAlign='middle' computer={4}>
                                        <label>Text Number</label>
                                    </Grid.Column>
                                    <Grid.Column computer={8}>
                                        <Input 
                                        name="number"
                                        size="small" 
                                        fluid 
                                        error={error} 
                                        validate={[required]}
                                        disabled={initialValues ? true : false}/>
                                    </Grid.Column>
                                </Grid.Row>                       
                            </Grid>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Button className="ui large fluid button front" type="submit" primary disabled={submitting} loading={submitting}>
                                Save
                            </Button>                           
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <ErrorText content={error}/>
            </Form>
        );
    }
}

export default reduxForm({
    form: 'eventForm'
})(AddEvent)