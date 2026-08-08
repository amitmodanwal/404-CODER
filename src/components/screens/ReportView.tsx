'use client';

import React from 'react';
import { Download, FileText, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Calendar, Clock, Award, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ScoreRing } from '../ui/ScoreRing';
import { DifficultyBadge } from '../ui/Badge';
import { FeedbackReport, Candidate } from '@/types/interview';

export interface ReportViewProps {
  report: FeedbackReport;
  candidate: Candidate;
  onViewTranscript: () => void;
  onNewInterview: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  candidate,
  onViewTranscript,
  onNewInterview,
}) => {
  const handleDownloadPDF = () => {
    // Printable stub / window.print() triggers clean PDF print preview
    window.print();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '36px auto', padding: '0 20px' }}>
      {/* Header Banner */}
      <Card accentBorder padding="28px 32px" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ScoreRing score={report.overallScore} size={110} strokeWidth={9} label="Overall Score" />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Interview Report</h2>
                <DifficultyBadge difficulty={report.difficultyUsed} />
              </div>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Candidate: {report.candidateName} · {report.candidateRole}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> {report.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Duration: {report.durationMinutes} mins
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="md" onClick={handleDownloadPDF} leftIcon={<Download size={16} />}>
              Export PDF
            </Button>
            <Button variant="secondary" size="md" onClick={onViewTranscript} leftIcon={<FileText size={16} />}>
              View Transcript
            </Button>
            <Button variant="primary" size="md" onClick={onNewInterview} leftIcon={<RefreshCw size={16} />}>
              Start New Interview
            </Button>
          </div>
        </div>
      </Card>

      {/* 2-Column Dashboard Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Executive Summary, Strengths, Gaps, Actionable Next Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Executive Summary */}
          <Card>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: 'var(--accent-primary)' }} />
              Executive Summary
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {report.summary}
            </p>
          </Card>

          {/* Key Strengths */}
          <Card>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--accent-success)' }} />
              Verified Technical Strengths
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.strengths.map((str, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    backgroundColor: 'rgba(61, 214, 140, 0.08)',
                    border: '1px solid rgba(61, 214, 140, 0.25)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--accent-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Identified Knowledge Gaps */}
          <Card>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} style={{ color: 'var(--accent-warn)' }} />
              Identified Knowledge Gaps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {report.gaps.map((gap, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    backgroundColor: 'rgba(242, 184, 75, 0.08)',
                    border: '1px solid rgba(242, 184, 75, 0.25)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)',
                  }}
                >
                  <AlertTriangle size={16} style={{ color: 'var(--accent-warn)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Actionable Next Steps Mapped to Curriculum Days */}
          <Card>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--accent-secondary)' }} />
              Curriculum-Mapped Next Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.next.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                  }}
                >
                  {item.dayNumber && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-secondary)',
                        backgroundColor: 'rgba(34, 211, 199, 0.12)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      Day {item.dayNumber}
                    </span>
                  )}
                  <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Module Category Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card padding="20px">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Category Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {report.categoryBreakdown.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {cat.moduleTitle}
                    </span>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {cat.score}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '7px',
                      backgroundColor: 'var(--border-subtle)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.score}%`,
                        height: '100%',
                        backgroundColor:
                          cat.score >= 80
                            ? 'var(--accent-success)'
                            : cat.score >= 60
                            ? 'var(--accent-warn)'
                            : 'var(--accent-danger)',
                        borderRadius: '4px',
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Candidate Card */}
          <Card padding="16px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden' }}>
                {/* eslint-disable-next-next/no-img-element */}
                <img src={candidate.member.avatar} alt={candidate.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700 }}>{candidate.member.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{candidate.member.statusBadge}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
