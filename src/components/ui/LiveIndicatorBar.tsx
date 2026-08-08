'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export interface LiveIndicatorBarProps {
  signalEstimate?: number; // 0 - 100
}

export const LiveIndicatorBar: React.FC<LiveIndicatorBarProps> = ({ signalEstimate = 85 }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getSignalColor = (val: number) => {
    if (val >= 80) return 'var(--accent-secondary)';
    if (val >= 60) return 'var(--accent-warn)';
    return 'var(--accent-danger)';
  };

  const color = getSignalColor(signalEstimate);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Communication signal (estimate)
          </span>
          <div style={{ position: 'relative' }}>
            <Info
              size={13}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-6px)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  whiteSpace: 'normal',
                  width: '210px',
                  boxShadow: 'var(--shadow-subtle)',
                  zIndex: 20,
                  textAlign: 'center',
                }}
              >
                Estimate based on this session&apos;s responses. Not a formal psychological evaluation.
              </div>
            )}
          </div>
        </div>

        <span style={{ fontSize: '12px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>
          ~{Math.round(signalEstimate)}% estimate
        </span>
      </div>

      {/* Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--border-subtle)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${signalEstimate}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
};
