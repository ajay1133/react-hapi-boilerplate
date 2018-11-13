import React from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react'; // eslint-disable-line


const TextBox = ({ input, label, meta, inline, ...custom }) => {
  const { touched, error } = meta || {};
  const hasError = (touched && !!error);
  
  if (input && !input.value && custom && custom.disabled && custom.emptyValue) {
    input.value = custom.emptyValue;
  }
  
  if (custom && custom.emptyValue) {
    delete custom.emptyValue;
  }
  
  
  return (
    <Form.Field error={ hasError } inline={ inline }>
      { label && <label>{ label }</label> }
      <Input
        className={ hasError ? 'error' : '' }
        { ...input }
        { ...custom }
        autoComplete='poo'
      />
      { touched && error && <span className="help-block">{ touched && error ? error : '' }</span> }
    </Form.Field>
  );
};

TextBox.propTypes = {
  inline: PropTypes.object,
  input: PropTypes.object,
  label: PropTypes.node,
  meta: PropTypes.object,
  custom: PropTypes.object
};

export default TextBox;
