'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { Candidate } from '@/types/interview';
import { ResumeUpload } from '@/components/screens/ResumeUpload';

export default function StartPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      try {
        const res = await fetch('/api/candidates');
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  const handleSelect = async (candidateId: string) => {
    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoCandidateId: candidateId }),
      });
      router.push('/confirm');
    } catch (err) {
      router.push('/confirm');
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.member.name.toLowerCase().includes(q) ||
      c.member.role.toLowerCase().includes(q) ||
      c.member.statusBadge.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <BackButton onClick={() => router.push('/dashboard')} label="Back to Dashboard" />

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Select Candidate Profile</h2>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
          Select which candidate profile to evaluate in this interview session ({candidates.length} profiles available).
        </p>
      </div>

      <ResumeUpload onSelectCandidate={() => router.push('/confirm')} />

      <div style={{ margin: '36px 0 24px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />

      <div style={{ position: 'relative', width: '340px', marginBottom: '20px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter 20 candidates by name or role..."
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

      {loading ? (
        <div style={{ color: 'var(--text-muted)' }}>Loading 20 sample candidates...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '16px',
            maxHeight: '560px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {filteredCandidates.map((cand) => (
            <Card
              key={cand.id}
              onClick={() => handleSelect(cand.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                padding: '16px 18px',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.18s ease',
              }}
              className="candidate-picker-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-strong)', flexShrink: 0 }}>
                  {/* eslint-disable-next-next/no-img-element */}
                  <img src={cand.member.avatar} alt={cand.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{cand.member.name}</span>
                    <Badge variant="status" size="sm">{cand.member.statusBadge}</Badge>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cand.member.role} · {cand.member.yearsExperience}</p>
                </div>
              </div>

              <ArrowRight size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
