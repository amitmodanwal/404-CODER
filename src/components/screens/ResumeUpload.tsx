'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Candidate } from '@/types/interview';
import candidatesDataRaw from '@/data/candidates.json';

const sampleCandidates = candidatesDataRaw.candidates as Candidate[];

export interface ResumeUploadProps {
  onSelectCandidate: (candidate: Candidate) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSelectCandidate }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsingCandidate, setParsingCandidate] = useState<Candidate | null>(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStep, setParseStep] = useState<string>('Initializing parser...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const startParsingSequence = (candidate: Candidate) => {
    setErrorMessage(null);
    setIsParsing(true);
    setParsingCandidate(candidate);
    setParseProgress(10);
    setParseStep('Extracting candidate identity & metadata...');

    setTimeout(() => {
      setParseProgress(45);
      setParseStep('Matching 31-day cohort mission history...');
    }, 500);

    setTimeout(() => {
      setParseProgress(80);
      setParseStep('Calculating commit signals & pass rates...');
    }, 1100);

    setTimeout(() => {
      setParseProgress(100);
      setParseStep('Parsing complete!');
      setTimeout(() => {
        onSelectCandidate(candidate);
      }, 400);
    }, 1700);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Unsupported or oversized resume file format. Please pick a candidate profile below.');
        return;
      }
      // If a valid file type is dropped, associate with top candidate
      startParsingSequence(sampleCandidates[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        setErrorMessage('Unsupported or oversized resume file format. Please pick a candidate profile below.');
        return;
      }
      startParsingSequence(sampleCandidates[0]);
    }
  };

  if (isParsing && parsingCandidate) {
    return (
      <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 20px' }}>
        <Card elevated accentBorder padding="36px 32px">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
                marginBottom: '16px',
              }}
              className="animate-pulse-glow"
            >
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Parsing Resume...</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>{parseStep}</p>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: `${parseProgress}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Skeleton placeholders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%' }} className="skeleton-loading" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '60%', height: '16px', borderRadius: '4px' }} className="skeleton-loading" />
                <div style={{ width: '40%', height: '12px', borderRadius: '4px' }} className="skeleton-loading" />
              </div>
            </div>
            <div style={{ width: '100%', height: '12px', borderRadius: '4px' }} className="skeleton-loading" />
            <div style={{ width: '85%', height: '12px', borderRadius: '4px' }} className="skeleton-loading" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Upload Candidate Resume</h2>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Drop a resume to extract candidate experience, or select a sample cohort profile below.
        </p>
      </div>

      {/* Error Message if non-resume dropped */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'rgba(240, 85, 94, 0.12)',
            border: '1px solid rgba(240, 85, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-danger)',
            marginBottom: '24px',
            fontSize: '13.5px',
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Centered Dropzone Card */}
      <Card
        accentBorder
        style={{
          border: isDragging ? '2px dashed var(--accent-primary)' : '2px dashed var(--border-strong)',
          backgroundColor: isDragging ? 'rgba(110, 91, 255, 0.05)' : 'var(--bg-surface)',
          padding: '44px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '36px',
          transition: 'all 0.2s ease',
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('resume-file-input')?.click()}
      >
        <input
          type="file"
          id="resume-file-input"
          style={{ display: 'none' }}
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
        />
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: 'rgba(110, 91, 255, 0.12)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Upload size={26} />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>
          Drag & drop your resume, or <span style={{ color: 'var(--accent-primary)' }}>browse</span>
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Supports PDF, DOCX (up to 10MB)
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={14} /> resume_alex_chen.pdf
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={14} /> sarah_ml_engineer.docx
          </span>
        </div>
      </Card>

      {/* Or continue with a sample profile */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Or continue with a sample cohort profile
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '16px',
          }}
        >
          {sampleCandidates.map((cand) => (
            <Card
              key={cand.id}
              onClick={() => startParsingSequence(cand)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '16px 20px',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease',
              }}
              className="candidate-picker-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid var(--border-strong)',
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-next/no-img-element */}
                  <img
                    src={cand.member.avatar}
                    alt={cand.member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {cand.member.name}
                    </span>
                    <Badge variant="status" size="sm">
                      {cand.member.statusBadge}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {cand.member.role} · {cand.member.yearsExperience}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {cand.signals.missionsCompleted}/31 missions completed · {(cand.signals.passRate * 100).toFixed(0)}% pass rate
                  </p>
                </div>
              </div>

              <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                <ArrowRight size={18} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
