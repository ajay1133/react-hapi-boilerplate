/* eslint-disable */
import './objectExtensions';
import { VALID_ACCESSIBLE_FILE_FORMATS } from '../utils/constants';
import { validFileName } from '../utils/commonutils';

const isEmpty = value => value === undefined || value === null || value === '';

const join = rules => (value, data) => rules
  .map(rule => rule(value, data))
  .filter(error => !!error)[0];
/* first error */

export function email(value) {
  const reExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!isEmpty(value) && !reExp.test(value)) {
    return !isEmpty(value) && !reExp.test(value) && 'Wrong Email';
  }
}

export function url(value) {
  const reExp = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  if (!isEmpty(value) && !reExp.test(value)) {
    return !isEmpty(value) && !reExp.test(value) && 'Wrong Url';
  }
}

export function phone(value) {
  const reExp = /^\d{10}$/;
  if (!isEmpty(value) && !reExp.test(value)) {
    return !isEmpty(value) && !reExp.test(value) && 'Wrong Phone';
  }
}

export function normalizePhone (value) {
  if (!value) {
    return value;
  }
  
  const onlyNums = value.replace(/[^\d]/g, '');
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  }
  
  if (onlyNums.length <= 10) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`;
  }
  
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)} x${onlyNums.slice(10, 16)}`;
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
  if (!validFileName(fileName, VALID_ACCESSIBLE_FILE_FORMATS)) {
	  return 'Invalid File Name, a valid file must start with alphanumeric and have a \'.md\' extension';
  }
}