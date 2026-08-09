'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, FileText, ArrowRight, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PastInterviewItem {
  id: string;
  difficulty: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  overallScore: number | null;
  turnsCount: number;
}

export default function AnalysisPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<PastInterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInterviews() {
      try {
        const res = await fetch('/api/interviews');
        if (res.ok) {
          const data = await res.json();
          setInterviews(data.interviews || []);
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading performance analysis...</div>;
  }

  const completed = interviews.filter((i) => i.status === 'completed' && typeof i.overallScore === 'number');
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((acc, i) => acc + (i.overallScore || 0), 0) / completed.length)
    : 0;
  const scoreTrend = completed
    .slice()
    .sort((a, b) => new Date(a.completedAt || a.createdAt).getTime() - new Date(b.completedAt || b.createdAt).getTime())
    .map((interview) => ({ date: new Date(interview.completedAt || interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), score: interview.overallScore }));

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Interview Performance Analysis</h1>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
          Historical score trends and technical evaluation metrics across all completed sessions.
        </p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={<BarChart3 size={28} />}
          title="No interviews yet"
          description="Start your first technical interview session to unlock detailed performance analysis and curriculum mastery metrics."
          actionText="Start New Interview"
          onAction={() => router.push('/confirm')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Summary Overview Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Card padding="18px">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Sessions
              </span>
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                {interviews.length}
              </div>
            </Card>

            <Card padding="18px">
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Average Overall Score
              </span>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  marginTop: '4px',
                  color: avgScore >= 70 ? 'var(--accent-success)' : avgScore >= 40 ? 'var(--accent-warn)' : 'var(--accent-danger)',
                }}
              >
                {avgScore}%
              </div>
            </Card>
          </div>

          <Card accentBorder padding="24px">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Score Progress</h3>
            {scoreTrend.length < 2 ? (
              <EmptyState icon={<BarChart3 size={28} />} title="Score trend unavailable" description="Complete another interview to see your score trend." />
            ) : (
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer>
                  <LineChart data={scoreTrend} margin={{ top: 8, right: 12, left: -18, bottom: 4 }}>
                    <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '8px', color: 'var(--text-primary)' }} formatter={(value) => [`${String(value)}%`, 'Overall score']} />
                    <Line type="monotone" dataKey="score" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Session History Grid */}
          <Card accentBorder padding="24px">
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Session History Log</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviews.map((inv) => (
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
                        Session: {inv.id.substring(0, 8)}...
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Created: {new Date(inv.createdAt).toLocaleDateString()} · {inv.turnsCount} Q&A turns
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
                          color: inv.overallScore >= 70 ? 'var(--accent-success)' : inv.overallScore >= 40 ? 'var(--accent-warn)' : 'var(--accent-danger)',
                        }}
                      >
                        Score: {inv.overallScore}%
                      </span>
                    ) : (
                      <Badge variant="status" size="sm">In Progress</Badge>
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
          </Card>
        </div>
      )}
    </div>
  );
}
