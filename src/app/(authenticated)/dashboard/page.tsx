'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Award, Calendar, CheckCircle2, FileText, ArrowRight, BarChart3, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Landing } from '@/components/screens/Landing';
import { Candidate } from '@/types/interview';

interface PastInterviewItem {
  id: string;
  difficulty: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  overallScore: number | null;
  turnsCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [interviews, setInterviews] = useState<PastInterviewItem[]>([]);
  const [modulesCovered, setModulesCovered] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, invRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/interviews'),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setCandidate(meData.candidate);
        }
        if (invRes.ok) {
          const invData = await invRes.json();
          setInterviews(invData.interviews || []);
          setModulesCovered(invData.modulesCoveredCount || 0);
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading candidate dashboard...</div>;
  }

  const recentInterviews = interviews.slice(0, 5);
  const missionsPassed = candidate?.missions.filter((mission) => mission.completed).length || 0;
  const completedInterviews = interviews.filter((interview) => interview.status === 'completed').length;

  return (
    <div>
      {/* Top Banner & Quick Start */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            Welcome back, {candidate?.member.name || 'Candidate'}
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            {candidate?.member.role} · {candidate?.member.education}
          </p>
        </div>

        <Link href="/confirm" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" leftIcon={<Play size={18} />}>
            Start New Interview
          </Button>
        </Link>
      </div>

      {/* Stat Cards Grid (Including Modules Covered X/8) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {/* Modules Covered Stat Card */}
        <Card padding="18px" accentBorder style={{ backgroundColor: 'rgba(110, 91, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', marginBottom: '8px' }}>
            <BookOpen size={18} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Modules Covered</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
              {modulesCovered}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 8 modules</span>
          </div>

          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                width: `${(modulesCovered / 8) * 100}%`,
                height: '100%',
                backgroundColor: 'var(--accent-primary)',
                borderRadius: '3px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </Card>

        <Card padding="18px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', marginBottom: '8px' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Commit Days</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {candidate?.signals?.commitDays || 0} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/ 31 days</span>
          </span>
        </Card>

        <Card padding="18px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-success)', marginBottom: '8px' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Missions Passed</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {missionsPassed} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>completed</span>
          </span>
        </Card>

        <Card padding="18px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-warn)', marginBottom: '8px' }}>
            <Award size={18} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)' }}>Interviews Taken</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            {completedInterviews} <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>sessions</span>
          </span>
        </Card>
      </div>

      {/* Data-Backed Recent Interviews Section */}
      {false && <Card padding="24px" elevated>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Recent Interviews</h3>
          {interviews.length > 0 && (
            <Link href="/analysis" style={{ color: 'var(--accent-primary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              View all history →
            </Link>
          )}
        </div>

        {recentInterviews.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="No interviews yet"
            description="Start your first technical interview to see it recorded here with graded scores and feedback."
            actionText="Start Interview"
            onAction={() => router.push('/confirm')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentInterviews.map((inv) => (
              <div
                key={inv.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <DifficultyBadge difficulty={inv.difficulty as any} />
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Interview #{inv.id.substring(0, 8)}
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(inv.createdAt).toLocaleDateString()} · {inv.turnsCount} Q&A turns
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {inv.overallScore !== null ? (
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color:
                          inv.overallScore >= 70
                            ? 'var(--accent-success)'
                            : inv.overallScore >= 40
                            ? 'var(--accent-warn)'
                            : 'var(--accent-danger)',
                      }}
                    >
                      Score: {inv.overallScore}%
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--accent-warn)', fontWeight: 600 }}>In Progress</span>
                  )}

                  <Link href={`/report/${inv.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />}>
                      View Report
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>}
      <Landing compact onStartInterview={() => router.push('/confirm')} onResumeUpload={() => router.push('/start')} />
    </div>
  );
}
