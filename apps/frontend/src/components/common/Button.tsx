// Button Component
// Reference: COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md - "Component Library, Button Component"
// Spec: Primary button bg #5dade2, padding 12px 24px, border-radius 8px

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium text-base transition-all';

  const variantStyles = {
    // Primary: cyan background per design system
    primary: 'bg-cyan-primary text-white hover:bg-cyan-light active:bg-cyan-dark',
    // Secondary: navy with border
    secondary: 'bg-navy-medium text-white border border-navy-light hover:bg-navy-light',
    // Ghost: transparent with cyan text
    ghost: 'bg-transparent text-cyan-primary hover:bg-cyan-primary/10',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
