import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem' }} {...props}>
      {children}
    </div>
  );
};
