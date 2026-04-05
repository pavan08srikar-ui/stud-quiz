import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'white',
      boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--text-light)',
      border: '1px solid var(--card-border)',
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: 'white',
    }
  };

  // Merge styles (inline for simplicity, though could use CSS classes)
  const style = { ...baseStyle, ...variants[variant] };

  return (
    <button style={style} className={className} 
      onMouseOver={(e) => {
        if(variant !== 'outline') e.currentTarget.style.transform = 'translateY(-2px)';
        if(variant === 'outline') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
      }}
      onMouseOut={(e) => {
        if(variant !== 'outline') e.currentTarget.style.transform = 'translateY(0)';
        if(variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
      }}
      {...props}
    >
      {children}
    </button>
  );
};
