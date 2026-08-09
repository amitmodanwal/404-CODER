'use client';

import React from 'react';
import { DifficultyLevel } from '@/types/interview';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'beginner' | 'intermediate' | 'advanced' | 'module' | 'status' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'beginner':
        return {
          backgroundColor: 'var(--badge-beginner-bg)',
          color: 'var(--badge-beginner-text)',
          border: '1px solid var(--badge-beginner-border)',
        };
      case 'intermediate':
        return {
          backgroundColor: 'var(--badge-intermediate-bg)',
          color: 'var(--badge-intermediate-text)',
          border: '1px solid var(--badge-intermediate-border)',
        };
      case 'advanced':
        return {
          backgroundColor: 'var(--badge-advanced-bg)',
          color: 'var(--badge-advanced-text)',
          border: '1px solid var(--badge-advanced-border)',
        };
      case 'module':
        return {
          backgroundColor: 'rgba(110, 91, 255, 0.12)',
          color: 'var(--accent-primary)',
          border: '1px solid rgba(110, 91, 255, 0.25)',
        };
      case 'status':
        return {
          backgroundColor: 'rgba(34, 211, 199, 0.12)',
          color: 'var(--accent-secondary)',
          border: '1px solid rgba(34, 211, 199, 0.25)',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
    }
  };

  const isSm = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: isSm ? '11px' : '12px',
        fontWeight: 600,
        padding: isSm ? '2px 8px' : '4px 10px',
        borderRadius: '20px',
        fontFamily: 'var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap',
        ...getStyles(),
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const DifficultyBadge: React.FC<{ difficulty: DifficultyLevel; size?: 'sm' | 'md' }> = ({
  difficulty,
  size = 'md',
}) => {
  const variantMap: Record<DifficultyLevel, 'beginner' | 'intermediate' | 'advanced'> = {
    Beginner: 'beginner',
    Intermediate: 'intermediate',
    Advanced: 'advanced',
  };

  return (
    <Badge variant={variantMap[difficulty]} size={size}>
      {difficulty}
    </Badge>
  );
};
