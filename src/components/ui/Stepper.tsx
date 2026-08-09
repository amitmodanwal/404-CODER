'use client';

import React from 'react';
import { Check } from 'lucide-react';

export type StepId = 'setup' | 'lobby' | 'interview' | 'report';

interface StepperStep {
  id: StepId;
  label: string;
}

const steps: StepperStep[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'lobby', label: 'Lobby' },
  { id: 'interview', label: 'Interview' },
  { id: 'report', label: 'Report' },
];

export interface StepperProps {
  currentStep: StepId;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const getStepStatus = (stepId: StepId) => {
    const order: StepId[] = ['setup', 'lobby', 'interview', 'report'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', maxWidth: '540px' }}>
      {steps.map((s, idx) => {
        const status = getStepStatus(s.id);
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor:
                    status === 'completed'
                      ? 'var(--accent-success)'
                      : status === 'active'
                      ? 'var(--accent-primary)'
                      : 'var(--bg-elevated)',
                  color:
                    status === 'completed' || status === 'active'
                      ? '#FFFFFF'
                      : 'var(--text-muted)',
                  border: status === 'upcoming' ? '1px solid var(--border-strong)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {status === 'completed' ? <Check size={12} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: status === 'active' ? 700 : 500,
                  color:
                    status === 'active'
                      ? 'var(--text-primary)'
                      : status === 'completed'
                      ? 'var(--text-secondary)'
                      : 'var(--text-muted)',
                }}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor:
                    status === 'completed' ? 'var(--accent-success)' : 'var(--border-subtle)',
                  transition: 'background-color 0.2s ease',
                  margin: '0 4px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
