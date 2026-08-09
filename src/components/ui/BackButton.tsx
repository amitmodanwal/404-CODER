'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, label = 'Back' }) => {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={onClick}
      leftIcon={<ArrowLeft size={16} />}
      className="back-button"
      style={{
        marginBottom: '16px',
        padding: '11px 22px',
        borderRadius: '9999px',
        backgroundColor: 'var(--accent-secondary)',
        color: '#FFFFFF',
        border: '1px solid transparent',
        boxShadow: 'none',
      }}
    >
      {label}
    </Button>
  );
};
