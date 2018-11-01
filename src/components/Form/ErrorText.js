import React from 'react';
import PropTypes from 'prop-types';

const ErrorText = ({ content }) => (
  <span style={{
    color: '#9F3A38',
    marginLeft: '5px'
  }}
  >
    {content}
  </span>
);

ErrorText.propTypes = {
  content: PropTypes.string,
};

ErrorText.defaultProps = {
  content: ''
};

export default ErrorText;
