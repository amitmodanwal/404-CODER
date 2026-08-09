'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, CornerDownRight, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InterviewTurn, Candidate } from '@/types/interview';

export interface TranscriptViewProps {
  turns: InterviewTurn[];
  candidate: Candidate;
  onBackToReport: () => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  turns,
  candidate,
  onBackToReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTurns = turns.filter((t) => {
    const qText = t.question.question.toLowerCase();
    const aText = (t.candidateAnswer || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const modText = t.question.meta.moduleTitle.toLowerCase();
    return qText.includes(query) || aText.includes(query) || modText.includes(query);
  });

  return (
    <div style={{ maxWidth: '960px', margin: '36px auto', padding: '0 20px' }}>
      {/* Top Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Button variant="secondary" size="md" onClick={onBackToReport} leftIcon={<ArrowLeft size={16} />}>
          Back to Report
        </Button>

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

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Full Interview Transcript</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Candidate: {candidate.member.name} ({candidate.member.role}) · Total {turns.length} turns recorded
        </p>
      </div>

      {/* Transcript Q&A List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredTurns.length === 0 ? (
          <Card padding="36px" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <p>No Q&A turns match your search query &quot;{searchQuery}&quot;.</p>
          </Card>
        ) : (
          filteredTurns.map((turn, idx) => (
            <Card key={turn.id || idx} accentBorder padding="20px">
              {/* Meta header */}
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
                  Turn #{idx + 1} · {turn.timestamp || 'Just now'}
                </span>
              </div>

              {/* Question */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  Interviewer Question:
                </span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {turn.question.question}
                </p>
              </div>

              {/* Answer */}
              {turn.candidateAnswer && (
                <div
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    {candidate.member.name} Response:
                  </span>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                    {turn.candidateAnswer}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
