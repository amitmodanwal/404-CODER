'use client';

import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';

export interface ToastProps {
  message: string;
  type?: 'warning' | 'error' | 'info';
  onRetry?: () => void;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'warning',
  onRetry,
  onClose,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'rgba(240, 85, 94, 0.12)',
          border: '1px solid rgba(240, 85, 94, 0.3)',
          color: 'var(--accent-danger)',
        };
      case 'info':
        return {
          bg: 'rgba(110, 91, 255, 0.12)',
          border: '1px solid rgba(110, 91, 255, 0.3)',
          color: 'var(--accent-primary)',
        };
      case 'warning':
      default:
        return {
          bg: 'rgba(242, 184, 75, 0.12)',
          border: '1px solid rgba(242, 184, 75, 0.3)',
          color: 'var(--accent-warn)',
        };
    }
  };

  const st = getStyles();

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: st.border,
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: 'var(--shadow-subtle)',
      }}
      className="animate-fade-in"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={18} style={{ color: st.color, flexShrink: 0 }} />
        <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
          {message}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onRetry && (
          <Button size="sm" variant="secondary" onClick={onRetry} leftIcon={<RefreshCw size={12} />}>
            Retry
          </Button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
