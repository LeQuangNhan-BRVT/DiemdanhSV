import React from 'react';
import PropTypes from 'prop-types';
import './ErrorMessage.css';

export const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <i className="fas fa-exclamation-circle"></i>
      <span>{message}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}; 