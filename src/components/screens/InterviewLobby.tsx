'use client';

import React from 'react';
import { CheckCircle2, Bot, FileText, BookOpen, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Candidate, DifficultyLevel } from '@/types/interview';

export interface InterviewLobbyProps {
  candidate: Candidate;
  difficulty: DifficultyLevel;
  questionCount: number;
  onEnterInterview: () => void;
}

export const InterviewLobby: React.FC<InterviewLobbyProps> = ({
  candidate,
  difficulty,
  questionCount,
  onEnterInterview,
}) => {
  return (
    <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
      <Card elevated accentBorder padding="36px 32px">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(110, 91, 255, 0.12)',
              color: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Interview Lobby</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            System readiness verification complete for {candidate.member.name}.
          </p>
        </div>

        {/* System Check List */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Session initialized & in-memory store linked</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Candidate signals & 31-day missions loaded</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Curriculum context & 8 module banks active</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>AI Interview Agent ({difficulty} difficulty) standby</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY</span>
          </div>
        </div>

        {/* Expectations Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '28px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            <Clock size={15} style={{ color: 'var(--accent-secondary)' }} />
            Session Overview
          </div>
          <p>
            This technical interview consists of ~{questionCount} questions spanning at least 4 distinct curriculum days. Answers are text-based — take your time to provide detailed architectural rationale.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" size="lg" onClick={onEnterInterview} rightIcon={<ArrowRight size={18} />}>
            Enter Interview
          </Button>
        </div>
      </Card>
    </div>
  );
};
