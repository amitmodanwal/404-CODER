'use client';

import React from 'react';
import { DifficultyBadge } from './Badge';
import { DifficultyLevel } from '@/types/interview';

export interface QuestionMetaProps {
  moduleTitle: string;
  dayNumber: number;
  difficulty: DifficultyLevel;
}

export const QuestionMeta: React.FC<QuestionMetaProps> = ({ moduleTitle, dayNumber, difficulty }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-secondary)',
          backgroundColor: 'rgba(34, 211, 199, 0.12)',
          border: '1px solid rgba(34, 211, 199, 0.25)',
          padding: '2px 8px',
          borderRadius: '4px',
        }}
      >
        Day {dayNumber}
      </span>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {moduleTitle}
      </span>
      <DifficultyBadge difficulty={difficulty} size="sm" />
    </div>
  );
};
