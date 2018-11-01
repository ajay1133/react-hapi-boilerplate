import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { Form, Input as TextBox } from 'semantic-ui-react';
import { pick } from 'lodash';
import ErrorText from './ErrorText';

const TextField = ({ input, meta: { touched, error }, ...custom }) => {
  const hasError = touched && !!error;
  const fieldProps = pick(Object.assign(input, custom), [
    'disabled', 'inline', 'label', 'required', 'width'
  ]);
  const inputProps = pick(Object.assign(input, custom), [
    'name', 'className', 'type', 'icon', 'iconPosition', 'placeholder', 'size', 'inverted', 'loading',
    'onChange', 'label', 'labelPosition', 'fluid', 'ref', 'autoCorrect', 'autoCapitalize', 'value', 'action'
  ]);

  return (
    <Form.Field inline error={hasError} {...fieldProps}>
      {/*<label>{fieldProps.label}</label>*/}
      <TextBox {...inputProps} />
      {hasError && <ErrorText content={error} />}
    </Form.Field>
  );
};

TextField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
};

TextField.defaultProps = {
  input: null,
  meta: null
};

const Input = ({ name, ...rest }) => (
  <Field name={name} component={TextField} {...rest} />
);

Input.propTypes = {
  name: PropTypes.string
};

Input.defaultProps = {
  name: ''
};

export default Input;
