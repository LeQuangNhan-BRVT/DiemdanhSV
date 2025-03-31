import React from 'react';
import './LoadingSpinner.css';

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p>Đang tải...</p>
    </div>
  );
};
