'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Sliders, MessageSquare, Award, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '880px', margin: '40px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />} style={{ marginBottom: '16px' }}>
            Back
          </Button>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(110, 91, 255, 0.3)',
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700 }}>About Synapse_AI</h1>
            <span style={{ fontSize: '13px', color: 'var(--accent-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              v4.0 Architecture Specification
            </span>
          </div>
        </div>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
          Synapse_AI is an adaptive conversational AI technical interview agent designed to evaluate candidate expertise across a 31-day AI engineering cohort curriculum. By coupling candidate learning signals with dynamic turn-by-turn question generation, Synapse_AI delivers evidence-based technical scorecards.
        </p>
      </div>

      {/* 3-Step How It Works Section */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>How Synapse_AI Works</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card accentBorder padding="24px">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(110, 91, 255, 0.12)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <h4 style={{ fontSize: '16.5px', fontWeight: 700, marginBottom: '4px' }}>
                  Cohort Signals & Resume Integration
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  Candidate learning signals (commit days, completed missions, skipped topics, pass rates) and real PDF/DOCX resume text are extracted and analyzed to determine initial interview difficulty.
                </p>
              </div>
            </div>
          </Card>

          <Card accentBorder padding="24px">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(34, 211, 199, 0.12)',
                  color: 'var(--accent-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <h4 style={{ fontSize: '16.5px', fontWeight: 700, marginBottom: '4px' }}>
                  Adaptive Probing & Question Rotation
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  The AI Interview Agent rotates across at least 4 distinct curriculum modules without repetition. When a response lacks technical depth, the agent launches targeted follow-up questions.
                </p>
              </div>
            </div>
          </Card>

          <Card accentBorder padding="24px">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(61, 214, 140, 0.12)',
                  color: 'var(--accent-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <h4 style={{ fontSize: '16.5px', fontWeight: 700, marginBottom: '4px' }}>
                  Real Turn-by-Turn Arithmetic Grading
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  Every candidate response is graded immediately (`correctness` 0.0–1.0). Overall scores are arithmetic averages, ensuring garbage inputs ("hih", "hho") yield low scores under 20% with honest feedback reports.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer info */}
      <Card padding="20px" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        <ShieldCheck size={18} style={{ color: 'var(--accent-primary)', marginBottom: '4px' }} />
        <p>Synapse_AI — Single API Contract · SQLite Database Backed · Next.js App Router</p>
      </Card>
    </div>
  );
}
