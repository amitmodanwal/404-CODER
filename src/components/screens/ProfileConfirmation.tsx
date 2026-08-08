'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Calendar, Award, BookOpen, User, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Candidate, CurriculumData } from '@/types/interview';
import curriculumDataRaw from '@/data/curriculum.json';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

export interface ProfileConfirmationProps {
  candidate: Candidate;
  onConfirm: () => void;
  onChooseDifferent: () => void;
}

export const ProfileConfirmation: React.FC<ProfileConfirmationProps> = ({
  candidate,
  onConfirm,
  onChooseDifferent,
}) => {
  const { member, signals, missions } = candidate;

  // Group completed missions by module
  const completedMissions = missions.filter((m) => m.completed);
  const skippedMissions = missions.filter((m) => m.skipped);

  const firstTryRate = missions.length > 0
    ? ((signals.missionsFirstTry / signals.missionsCompleted) * 100).toFixed(0)
    : '0';

  return (
    <div style={{ maxWidth: '1100px', margin: '36px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Profile Confirmation</h2>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
          Review parsed candidate profile and verified 31-day cohort learning signals.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 340px) 1fr',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Candidate Summary Card */}
        <Card accentBorder style={{ position: 'sticky', top: '90px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 14px',
                border: '2px solid var(--accent-primary)',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={member.avatar}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{member.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>{member.role}</p>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{member.education}</p>
            <div style={{ marginTop: '10px' }}>
              <Badge variant="status">{member.statusBadge}</Badge>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Experience</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{member.yearsExperience}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Commit Days</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{signals.commitDays} / 31 days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Missions Passed</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{signals.missionsCompleted} missions</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>First-Try Rate</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{firstTryRate}%</span>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button variant="primary" size="lg" onClick={onConfirm} rightIcon={<ArrowRight size={18} />}>
              Looks good — continue
            </Button>
            <button
              onClick={onChooseDifferent}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'underline',
              }}
            >
              Not you? Choose a different profile
            </button>
          </div>
        </Card>

        {/* Right: Learning Journey Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Signal Chips Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            <Card padding="14px 16px" elevated>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Commit Days</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {signals.commitDays} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 31</span>
              </span>
            </Card>

            <Card padding="14px 16px" elevated>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Award size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Completed</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {signals.missionsCompleted} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>missions</span>
              </span>
            </Card>

            <Card padding="14px 16px" elevated>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <BookOpen size={16} style={{ color: 'var(--accent-success)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>First-Try Rate</span>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {firstTryRate}%
              </span>
            </Card>
          </div>

          {/* Skipped Topics Warning Callout */}
          {skippedMissions.length > 0 && (
            <div
              style={{
                backgroundColor: 'rgba(242, 184, 75, 0.12)',
                border: '1px solid rgba(242, 184, 75, 0.3)',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-warn)' }}>
                <AlertTriangle size={18} />
                <h4 style={{ fontSize: '14.5px', fontWeight: 700 }}>Skipped Topics Noted</h4>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                The AI interviewer will adaptively probe these skipped cohort days:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skippedMissions.map((s) => (
                  <span
                    key={s.day}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--accent-warn)',
                      backgroundColor: 'rgba(242, 184, 75, 0.15)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    Skipped: Day {s.day} — {s.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Completed Missions Grouped by Curriculum Module */}
          <Card>
            <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>
              Completed Missions by Curriculum Module
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {curriculum.modules.map((mod) => {
                const modMissions = completedMissions.filter((m) => mod.days.includes(m.day));
                if (modMissions.length === 0) return null;

                return (
                  <div
                    key={mod.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Module {mod.id}: {mod.title}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {modMissions.length} / {mod.days.length} days
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {modMissions.map((m) => (
                        <span
                          key={m.day}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 500,
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-elevated)',
                            border: '1px solid var(--border-subtle)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <CheckCircle2 size={11} style={{ color: 'var(--accent-success)' }} />
                          Day {m.day}: {m.title}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
