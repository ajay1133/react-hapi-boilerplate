import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';


const DropDown = ({ input, label, meta, ...rest }) => {
  const { touched, error } = meta || {};
  const custom = rest || {};
  
  // Filed level attr
  const inline = custom.inline;
  delete custom.inline;
  
  // remove onChange from custom to avoid unwanted behaviour
  const onChange = (input && input.onChange) || custom.onChange;
  
  if (custom.onChange) {
    delete custom.onChange;
  }
  
  const handleChange = (e, data) => {
    // don't change in disabled mode.
    if (custom.disabled) {
      return;
    }
    const val = data.value;
    
    if (input && (input.value === val)) {
      return;
    }
    
    if (onChange) {
      onChange(val);
    }
  };
  
  
  let value = '';
  if (input && input.value !== undefined) {
    value = input.value;
  } else if (custom && custom.value !== undefined) {
    value = custom.value;
  }
  
  if (custom.multiple && !Array.isArray(value)) {
    value = [].concat(value);
  }
  
  return (
    <Form.Field
      error={ (touched && !!error) }
      inline={ inline }
    >
      { label && <label>{ label }</label> }
      <Dropdown
        name={ (input && input.name) || custom.name }
        selection={ true }
        fluid={ custom.fluid || true }
        onChange={ handleChange }
        // in case multiple is we require default be []
        value={ value }
        // added to show selected value in dropdown which was not showing when tabbing to & fro earlier in first case
        // text={value}
        { ...custom }
        autoComplete='poo'
      />
      { touched && error && <span className="help-block">{ touched && error ? error : '' }</span> }
    </Form.Field>
  );
};

DropDown.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  children: PropTypes.node
};

export default DropDown;
