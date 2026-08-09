'use client';

import React, { useState } from 'react';
import { ArrowRight, Sliders, MessageSquare, Award, CheckCircle2, Zap, FileUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import curriculumDataRaw from '@/data/curriculum.json';
import { CurriculumData } from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

export interface LandingProps {
  onStartInterview: () => void;
  compact?: boolean;
  onResumeUpload?: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartInterview, compact = false, onResumeUpload }) => {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', margin: '32px 0 64px' }} className="animate-fade-in">
        {!compact && <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(110, 91, 255, 0.12)',
            border: '1px solid rgba(110, 91, 255, 0.3)',
            color: 'var(--accent-primary)',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
          }}
        >
          <Zap size={14} />
          <span>31-Day AI Engineering Cohort Assessment Engine</span>
        </div>}

        <h1
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            maxWidth: '900px',
            marginInline: 'auto',
          }}
        >
          Turn your AI Cohort progress into a{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            real technical interview
          </span>
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          An adaptive AI interviewer that evaluates candidate signals across 31 curriculum days, probes deeper with tailored follow-up questions, and generates structured feedback reports.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Button size="lg" variant="primary" onClick={onStartInterview} rightIcon={<ArrowRight size={18} />}>
            Start Interview
          </Button>
          {!compact && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--accent-success)' }} />
            <span>No login required · Single in-memory session</span>
          </div>}
        </div>
      </section>

      {/* Feature Chips */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '64px',
        }}
      >
        <Card accentBorder>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(110, 91, 255, 0.12)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Sliders size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Adaptive Difficulty</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Reads candidate mission completions, pass rates, and retry counts to dynamically scale question difficulty between Beginner, Intermediate, and Advanced.
          </p>
        </Card>

        <Card accentBorder>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(34, 211, 199, 0.12)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <MessageSquare size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Dynamic Probing</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Analyzes your previous answers in real-time, launching probing follow-up turns when responses lack depth or reveal edge case opportunities.
          </p>
        </Card>

        <Card accentBorder>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'rgba(242, 184, 75, 0.12)',
              color: 'var(--accent-warn)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Award size={22} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Evidence-Based Feedback</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Generates executive scorecards, breakdown radar metrics per curriculum module, verified strengths, gaps, and curriculum-mapped next steps.
          </p>
        </Card>

        {onResumeUpload && (
          <Card accentBorder onClick={onResumeUpload} style={{ cursor: 'pointer' }}>
            <div
              style={{
                width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(110, 91, 255, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
              }}
            >
              <FileUp size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Resume Upload</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Upload a resume to personalize the interview using your skills, tools, and experience.
            </p>
          </Card>
        )}
      </section>

      {/* Curriculum Module Dots Strip */}
      {!compact && <section
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            Curriculum Alignment
          </span>
          <h4 style={{ fontSize: '16px', fontWeight: 600, marginTop: '4px' }}>
            Powered by your actual cohort progress — Day 1 through Day 31
          </h4>
        </div>

        {/* 8 Module Dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            position: 'relative',
            padding: '12px 0',
          }}
        >
          {curriculum.modules.map((m) => (
            <div
              key={m.id}
              onMouseEnter={() => setHoveredModule(m.title)}
              onMouseLeave={() => setHoveredModule(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                flex: 1,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-elevated)',
                  border: hoveredModule === m.title ? '2px solid var(--accent-primary)' : '1px solid var(--border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: hoveredModule === m.title ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.18s ease',
                  boxShadow: hoveredModule === m.title ? '0 0 12px rgba(110, 91, 255, 0.4)' : 'none',
                }}
              >
                {m.id}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {m.dayRange}
              </span>

              {/* Tooltip on Hover */}
              {hoveredModule === m.title && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-8px)',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    width: '200px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-subtle)',
                    zIndex: 30,
                    pointerEvents: 'none',
                  }}
                  className="animate-fade-in"
                >
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    Module {m.id}: {m.title}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>}
    </div>
  );
};
