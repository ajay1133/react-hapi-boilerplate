/* eslint-disable */
import './objectExtensions';

const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data) => rules
  .map(rule => rule(value, data))
  .filter(error => !!error)[0];
/* first error */

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return !isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) && 'Wrong email';
  }
}

export function required(value) {
  if (isEmpty(value) || /^\s+$/.test(value)) {
    return 'Required';
  }
}

export function fullNameRequired(value) {
  if (isEmpty(value) || /^\s+$/.test(value)) {
    return 'Full Name Required';
  }
}

export function emailRequired(value) {
  if (isEmpty(value) || /^\s+$/.test(value)) {
    return 'Email Required';
  }
}

export function addressRequired(value) {
  if (isEmpty(value) || /^\s+$/.test(value)) {
    return 'Address Required';
  }
}

export function phoneRequired(value) {
  if (isEmpty(value) || /^\s+$/.test(value)) {
    return 'Phone Number Required';
  }
}

export function minLength(min) {
  return (value) => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
  };
}

export function maxLength(max) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function minValue(min) {
  return (value) => {
    if (!isEmpty(value) && value < min) {
      return `Must be ${min} or greater`;
    }
  };
}

export function maxValue(max) {
  return (value) => {
    if (!isEmpty(value) && value > max) {
      return `Must be no more than ${max}`;
    }
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf(enumeration) {
  return (value) => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function requiredWith(field) {
  return (value, data) => {
    if (data && !!Object.byString(data, field) && isEmpty(value)) {
      return 'Required';
    }
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

export function fileNameValidator(fileName) {
  const failedValidation = /^[0-9|a-z|A-Z]+.md$/.test(fileName);
  
  if (!failedValidation) {
	  return 'Invalid File Name, must start with alphanumeric and have a /'.md/' extension';
  }
}