import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { reduxForm, reset } from 'redux-form/immutable'
import Input from '../../components/Form/Input'
import { required } from '../../utils/validations'

class AddParticipant extends Component {

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
    this.addParticipant = this.addParticipant.bind(this);
  }

  addParticipant(formData) {
    const { saveParticipant, dispatch } = this.props;
    const participant = formData.toJS();
    saveParticipant(participant);
    dispatch(reset('participantForm'));
  }


  render() {
    const { handleSubmit,isAdding } = this.props;
    return (
      <div className="newEntry">
        <Form onSubmit={handleSubmit(this.addParticipant)} loading={isAdding}>
          <Input
            action={{ icon: 'plus' }} 
            name="name"
            placeholder="Enter Participant Name"
            type="text"
            size="small"
            validate={[required]}
          />
        </Form>
      </div>
    );
  }
}
export default connect(state => ({
  isLoading: state.get('event').get('isLoad'),
  isAdding: state.get('event').get('savingParticipant')
  }))(reduxForm({
     form: 'participantForm'
  })(AddParticipant));