import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { Form, TextArea as Area } from 'semantic-ui-react'; // eslint-disable-line

const TextArea = ({ input, label, meta, ...custom }) => {
  const { touched, error } = meta || {};
  const hasError = (touched && !!error);
  
  if (custom && custom.disabled && custom.placeholder) {
    delete custom.placeholder;
  }
  
  return (
    <Form.Field error={ hasError }>
      { label && <label>{ label }</label> }
      <Area
        style={ { minHeight: '80px' } }
        { ...input }
        { ...custom }
        autoComplete='poo'
      />
      { touched && error && <span className="help-block">{ touched && error ? error : '' }</span> }
    </Form.Field>
  );
};

TextArea.propTypes = {
  input: PropTypes.object,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  meta: PropTypes.object,
  custom: PropTypes.object
};

export default TextArea;
