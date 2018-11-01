import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import classnames from 'classnames'
import moment from 'moment'
import { Form } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'

class DatePickerInput extends PureComponent {

  handleChange = (date) => {
    this.props.input.onChange(moment(date))
  }

  render () {
    const { label, input, className, meta: { error, touched }, required, ...rest } = this.props
    console.log("Input", input);
    return (
      <Form.Field className={classnames('', { 'has-danger': error })}>
        <label>{label}</label>
        <DatePicker {...rest}
          autoOk
          className={classnames('field', { 'form-control-danger': error })}
          onChange={this.handleChange}
          selected={input.value ? moment(input.value) : null} />
        {touched && error && <span className='error-block'>{error}</span>}
      </Form.Field>
    )
  }
}

DatePickerInput.propTypes = {
  className: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  required: PropTypes.bool
}

DatePickerInput.defaultProps = {
  className: 'input',
  required: false
}

export default DatePickerInput