'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, CornerDownRight, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';

interface GradedTurnItem {
  id: string;
  question: {
    id: string;
    question: string;
    meta: {
      moduleTitle: string;
      dayNumber: number;
      difficulty: string;
    };
    isFollowUp: boolean;
  };
  candidateAnswer?: string;
  correctness?: number | null;
  gradeNotes?: string | null;
  timestamp: string;
}

export default function TranscriptPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter();
  const { interviewId } = params;

  const [turns, setTurns] = useState<GradedTurnItem[]>([]);
  const [candidateName, setCandidateName] = useState('Candidate');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranscript() {
      try {
        const res = await fetch(`/api/interviews/${interviewId}/report`);
        if (res.ok) {
          const data = await res.json();
          setTurns(data.turnsHistory || []);
          if (data.interview?.candidate?.name) {
            setCandidateName(data.interview.candidate.name);
          }
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadTranscript();
  }, [interviewId]);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading graded transcript...</div>;
  }

  const filteredTurns = turns.filter((t) => {
    const qText = t.question.question.toLowerCase();
    const aText = (t.candidateAnswer || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const modText = t.question.meta.moduleTitle.toLowerCase();
    return qText.includes(query) || aText.includes(query) || modText.includes(query);
  });

  const renderCorrectnessPill = (correctness: number | null | undefined, gradeNotes?: string | null) => {
    if (correctness === null || correctness === undefined) return null;

    let bg = 'rgba(61, 214, 140, 0.12)';
    let border = 'rgba(61, 214, 140, 0.3)';
    let color = 'var(--accent-success)';
    let label = `Strong (${Math.round(correctness * 100)}%)`;
    let Icon = CheckCircle2;

    if (correctness < 0.4) {
      bg = 'rgba(240, 85, 94, 0.12)';
      border = 'rgba(240, 85, 94, 0.3)';
      color = 'var(--accent-danger)';
      label = `Needs Improvement (${Math.round(correctness * 100)}%)`;
      Icon = XCircle;
    } else if (correctness < 0.7) {
      bg = 'rgba(242, 184, 75, 0.12)';
      border = 'rgba(242, 184, 75, 0.3)';
      color = 'var(--accent-warn)';
      label = `Partial (${Math.round(correctness * 100)}%)`;
      Icon = AlertTriangle;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11.5px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: '20px',
            backgroundColor: bg,
            border: `1px solid ${border}`,
            color,
            width: 'fit-content',
          }}
        >
          <Icon size={13} />
          <span>Per-Answer Grade: {label}</span>
        </div>
        {gradeNotes && (
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginLeft: '4px' }}>
            Note: {gradeNotes}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <BackButton onClick={() => router.push(`/report/${interviewId}`)} label="Back to Report" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Graded Interview Transcript</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Candidate: {candidateName} · {turns.length} turns graded individually against question rubrics
          </p>
        </div>

        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search transcript questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredTurns.map((turn, idx) => (
          <Card key={turn.id || idx} accentBorder padding="20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-secondary)',
                    backgroundColor: 'rgba(34, 211, 199, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  Day {turn.question.meta.dayNumber}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {turn.question.meta.moduleTitle}
                </span>
                {turn.question.isFollowUp && (
                  <Badge variant="status" size="sm" icon={<CornerDownRight size={12} />}>
                    Follow-up
                  </Badge>
                )}
              </div>

              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Turn #{idx + 1} · {turn.timestamp}
              </span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                Interviewer Question:
              </span>
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                {turn.question.question}
              </p>
            </div>

            {turn.candidateAnswer && (
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Candidate Response:
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.55, whiteSpace: 'pre-wrap', marginBottom: '8px' }}>
                  {turn.candidateAnswer}
                </p>

                {/* Per-Question Correctness Indicator Pill */}
                {renderCorrectnessPill(turn.correctness, turn.gradeNotes)}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
