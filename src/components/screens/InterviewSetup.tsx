'use client';

import React, { useState } from 'react';
import { ArrowRight, Sliders, Clock, Target, Sparkles, Check, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DifficultyBadge } from '../ui/Badge';
import { Candidate, DifficultyLevel, CurriculumData } from '@/types/interview';
import curriculumDataRaw from '@/data/curriculum.json';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

export interface InterviewSetupProps {
  candidate: Candidate;
  onBeginInterview: (setupConfig: {
    difficulty: DifficultyLevel;
    length: 'standard' | 'extended';
    focusModules: number[];
  }) => void;
  isLoading?: boolean;
}

// Compute formula-backed recommendation rationale from candidate signals
function computeDifficultyRationale(candidate: Candidate): { difficulty: DifficultyLevel; rationale: string } {
  const { passRate, missionsCompleted, commitDays, missionsFirstTry } = candidate.signals;
  const skippedCount = candidate.missions.filter((m) => m.skipped).length;

  if (passRate >= 0.88 && missionsCompleted >= 28) {
    return {
      difficulty: 'Advanced',
      rationale: `Advanced — ${missionsCompleted}/31 missions completed (${commitDays} commit days), ${(passRate * 100).toFixed(0)}% pass rate with strong signal on Agentic AI & MCP (Days 21–24).`,
    };
  }
  if (passRate >= 0.75 || missionsCompleted >= 24) {
    return {
      difficulty: 'Intermediate',
      rationale: `Intermediate — ${missionsCompleted}/31 missions completed with high consistency. ${skippedCount} skipped topics noted for targeted probing.`,
    };
  }
  return {
    difficulty: 'Beginner',
    rationale: `Beginner — ${missionsCompleted}/31 missions completed (${missionsFirstTry} first-try passes). Recommended focus on core foundations & prompting.`,
  };
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  candidate,
  onBeginInterview,
  isLoading = false,
}) => {
  const rec = computeDifficultyRationale(candidate);
  const [selectedLength, setSelectedLength] = useState<'standard' | 'extended'>('standard');
  const [selectedModules, setSelectedModules] = useState<number[]>([]);

  const toggleModule = (id: number) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter((mId) => mId !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleStart = () => {
    onBeginInterview({
      difficulty: rec.difficulty,
      length: selectedLength,
      focusModules: selectedModules,
    });
  };

  return (
    <div style={{ maxWidth: '880px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Interview Setup</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Configure session options for {candidate.member.name}. Difficulty is auto-recommended from cohort data.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Candidate Read-only Context Summary Card */}
        <Card elevated padding="20px 24px">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid var(--border-strong)',
                }}
              >
                {/* eslint-disable-next-next/no-img-element */}
                <img src={candidate.member.avatar} alt={candidate.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{candidate.member.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{candidate.member.role} · {candidate.member.yearsExperience}</p>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {candidate.signals.missionsCompleted}/31 Missions Passed · {(candidate.signals.passRate * 100).toFixed(0)}% Signal
            </div>
          </div>
        </Card>

        {/* Auto-Recommended Difficulty Banner */}
        <Card accentBorder style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(110, 91, 255, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sliders size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Auto-Recommended Difficulty
                </span>
                <DifficultyBadge difficulty={rec.difficulty} size="sm" />
              </div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.5,
                }}
              >
                {rec.rationale}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Derived dynamically from commit history, retry frequency, and skipped mission topics.
              </p>
            </div>
          </div>
        </Card>

        {/* Controls: Length & Focus */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {/* Interview Length Selector */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
              <h4 style={{ fontSize: '15.5px', fontWeight: 700 }}>Interview Length</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setSelectedLength('standard')}
                style={{
                  border: selectedLength === 'standard' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedLength === 'standard' ? 'rgba(110, 91, 255, 0.06)' : 'var(--bg-surface)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.18s ease',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Standard Interview (8–10 Qs)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ~15–20 minutes · Covers key curriculum milestones & probing
                  </div>
                </div>
                {selectedLength === 'standard' && <Check size={18} style={{ color: 'var(--accent-primary)' }} />}
              </div>

              <div
                onClick={() => setSelectedLength('extended')}
                style={{
                  border: selectedLength === 'extended' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedLength === 'extended' ? 'rgba(110, 91, 255, 0.06)' : 'var(--bg-surface)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.18s ease',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Extended Deep-Dive (12–15 Qs)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ~25–30 minutes · Comprehensive coverage across all 8 modules
                  </div>
                </div>
                {selectedLength === 'extended' && <Check size={18} style={{ color: 'var(--accent-primary)' }} />}
              </div>
            </div>
          </Card>

          {/* Module Focus Emphasis */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Target size={18} style={{ color: 'var(--accent-secondary)' }} />
              <h4 style={{ fontSize: '15.5px', fontWeight: 700 }}>Focus Emphasis (Optional)</h4>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Select specific modules to prioritize (defaults to balanced coverage):
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
              {curriculum.modules.map((m) => {
                const isSelected = selectedModules.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModule(m.id)}
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '5px 10px',
                      borderRadius: '6px',
                      border: isSelected ? '1px solid var(--accent-secondary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(34, 211, 199, 0.12)' : 'var(--bg-elevated)',
                      color: isSelected ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Module {m.id}: {m.title}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={18} />}
          >
            Begin Interview
          </Button>
        </div>
      </div>
    </div>
  );
};
