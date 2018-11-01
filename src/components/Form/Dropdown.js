import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import { Dropdown as DDL, Form } from 'semantic-ui-react';
import { pick } from 'lodash';

const DropdownField = ({ input, meta: { touched, error }, ...custom }) => (
  <Form.Field
    error={touched && !!error}
    control={DDL}
    {...input}
    {...pick(Object.assign(input, custom), ['as', 'children', 'className', 'disabled', 'inline',
      'label', 'required', 'type', 'width', 'options'
    ])
    }
    onChange={(e, { value }) => input.onChange(value)}
  />
);

DropdownField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
};

DropdownField.defaultProps = {
  input: null,
  meta: null,
};

const Dropdown = ({ name, ...rest }) => (
  <Field name={name} component={DropdownField} {...rest} />
);

Dropdown.propTypes = {
  name: PropTypes.string,
};

Dropdown.defaultProps = {
  name: '',
};
export default Dropdown;
