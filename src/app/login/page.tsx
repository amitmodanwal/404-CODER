'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Search, Lock, Mail, AlertTriangle, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Candidate } from '@/types/interview';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // All 20 candidates for quick demo login picker
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch('/api/candidates');
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates || []);
        }
      } catch (err) {
        // Ignore
      }
    }
    fetchCandidates();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Network error during login');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (candidateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoCandidateId: candidateId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to login as demo candidate');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Failed demo login');
      setIsLoading(false);
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
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '12px',
            boxShadow: '0 4px 16px rgba(110, 91, 255, 0.3)',
          }}
        >
          <Sparkles size={26} />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '6px' }}>Sign in to Synapse_AI</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Enter your credentials or choose from all 20 seeded cohort candidate profiles.
        </p>
      </div>

      {/* Grid Layout: Login Form Left / Info Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '32px', marginBottom: '48px' }}>
        {/* Email & Password Login Card */}
        <Card accentBorder elevated padding="28px">
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Candidate Login</h3>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(240, 85, 94, 0.12)',
                border: '1px solid rgba(240, 85, 94, 0.3)',
                color: 'var(--accent-danger)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="alex_chen@synapse.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '8px',
                    padding: '10px 12px 10px 36px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '8px',
                    padding: '10px 12px 10px 36px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <Button variant="primary" size="lg" type="submit" isLoading={isLoading} rightIcon={<ArrowRight size={18} />}>
              Sign In
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up here
            </Link>
          </div>
        </Card>

        {/* Informational Hero Card */}
        <Card padding="28px" elevated style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
            Adaptive Technical Assessment Platform
          </h3>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Synapse_AI evaluates engineering depth across 31 curriculum days. Answers are graded immediately per turn using real arithmetic correctness scores.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} style={{ color: 'var(--accent-success)' }} />
              <span>Full SQLite persistence for all past interviews & reports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} style={{ color: 'var(--accent-success)' }} />
              <span>Real turn-by-turn grading pipeline eliminating fake scores</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fast-Path Demo Quick-Picker Section for ALL 20 Seeded Candidates */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Or continue with a sample candidate profile</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Click any candidate card below to log in directly as that seeded account ({candidates.length} profiles available).
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search 20 candidates by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: '6px',
                padding: '6px 10px 6px 32px',
                color: 'var(--text-primary)',
                fontSize: '12.5px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* 2-Column Scrollable Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '14px',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {filteredCandidates.map((cand) => (
            <Card
              key={cand.id}
              onClick={() => handleQuickDemoLogin(cand.id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.18s ease',
              }}
              className="candidate-picker-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-strong)', flexShrink: 0 }}>
                  {/* eslint-disable-next-next/no-img-element */}
                  <img src={cand.member.avatar} alt={cand.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{cand.member.name}</span>
                    <Badge variant="status" size="sm">{cand.member.statusBadge}</Badge>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cand.member.role} · {cand.member.yearsExperience}</p>
                </div>
              </div>

              <ArrowRight size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
