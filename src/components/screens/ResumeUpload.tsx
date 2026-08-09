'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Candidate } from '@/types/interview';
import candidatesDataRaw from '@/data/candidates.json';

const sampleCandidates = candidatesDataRaw.candidates as unknown as Candidate[];

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

  const startParsingSequence = async (file?: File, candidateChoice?: Candidate) => {
    setErrorMessage(null);
    setIsParsing(true);
    setParseProgress(15);
    setParseStep('Uploading document & extracting text...');

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          setIsParsing(false);
          setErrorMessage(data.error || 'Unsupported or oversized resume file format.');
          return;
        }

        setParseProgress(60);
        setParseStep('Extracting skills, past roles & matching 31-day cohort history...');

        // Fetch current candidate session to get updated resumeText
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setParsingCandidate(meData.candidate);
          setParseProgress(100);
          setParseStep('Parsing complete!');
          setTimeout(() => {
            onSelectCandidate(meData.candidate);
          }, 400);
          return;
        }
      } else if (candidateChoice) {
        setParsingCandidate(candidateChoice);
        setTimeout(() => setParseProgress(60), 400);
        setTimeout(() => {
          setParseProgress(100);
          setParseStep('Parsing complete!');
          setTimeout(() => {
            onSelectCandidate(candidateChoice);
          }, 400);
        }, 1200);
      }
    } catch (err) {
      setIsParsing(false);
      setErrorMessage('Failed to upload and parse resume file.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
      const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
      if (!hasValidExt) {
        setErrorMessage('Unsupported or oversized resume file format. Please pick a candidate profile below.');
        return;
      }
      startParsingSequence(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      startParsingSequence(file);
    }
  };

  if (isParsing) {
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
          Drop an actual PDF or DOCX resume to extract real text, or select a sample cohort profile below.
        </p>
      </div>

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

      {/* Dropzone Card */}
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
          accept=".pdf,.docx,.doc,.txt"
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
          Drag & drop your PDF or DOCX resume, or <span style={{ color: 'var(--accent-primary)' }}>browse</span>
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Real text will be extracted and passed directly into the AI Interview Agent prompt.
        </p>
      </Card>

      {/* Or continue with sample profile */}
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
          {sampleCandidates.slice(0, 4).map((cand) => (
            <Card
              key={cand.id}
              onClick={() => startParsingSequence(undefined, cand)}
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
                </div>
              </div>

              <ArrowRight size={18} style={{ color: 'var(--accent-primary)' }} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
