'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';

export interface InterviewCompleteProps {
  onEvaluationFinished: () => void;
}

export const InterviewComplete: React.FC<InterviewCompleteProps> = ({ onEvaluationFinished }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Reviewing candidate answers...',
    'Scoring responses against 31-day curriculum rubric...',
    'Identifying key technical strengths & knowledge gaps...',
    'Building executive feedback report...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(() => {
          onEvaluationFinished();
        }, 500);
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onEvaluationFinished, steps.length]);

  return (
    <div style={{ maxWidth: '540px', margin: '80px auto', padding: '0 20px' }}>
      <Card elevated accentBorder padding="40px 32px">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(110, 91, 255, 0.15)',
              color: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
            className="animate-pulse-glow"
          >
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Evaluating Your Responses...</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Processing multi-turn transcript and compiling cohort rubric scores.
          </p>
        </div>

        {/* 4 Step Progress Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((stepText, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: isCurrent ? 'rgba(110, 91, 255, 0.08)' : 'var(--bg-surface)',
                  border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.25s ease',
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={20} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                ) : isCurrent ? (
                  <Loader2 size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} className="animate-spin" />
                ) : (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px solid var(--border-strong)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isCurrent ? 600 : 400,
                    color: isDone ? 'var(--text-primary)' : isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                  }}
                >
                  {stepText}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
