'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  accentBorder?: boolean;
  padding?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  accentBorder = false,
  padding = '20px',
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      style={{
        backgroundColor: elevated ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding,
        boxShadow: elevated ? 'var(--shadow-subtle)' : 'var(--shadow-card)',
        transition: 'all 0.2s ease',
        ...style,
      }}
      className={`synapse-card ${accentBorder ? 'ai-gradient-top-border' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
