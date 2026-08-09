'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, Calendar, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface PastReportItem {
  id: string;
  difficulty: string;
  status: string;
  createdAt: string;
  overallScore: number | null;
  turnsCount: number;
}

export default function ReportsHistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<PastReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch('/api/interviews');
        if (res.ok) {
          const data = await res.json();
          const completedOnly = (data.interviews || []).filter(
            (i: PastReportItem) => i.status === 'completed' || i.overallScore !== null
          );
          setReports(completedOnly);
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading report history...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>Interview Reports</h1>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
          Access full graded feedback scorecards, category breakdowns, and transcripts.
        </p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText size={28} />}
          title="No reports yet"
          description="Complete your first technical interview to generate a persistent feedback scorecard and transcript record."
          actionText="Start Interview"
          onAction={() => router.push('/confirm')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.map((rep) => (
            <Card key={rep.id} elevated padding="20px">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <DifficultyBadge difficulty={rep.difficulty as any} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Technical Assessment Report #{rep.id.substring(0, 8)}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Completed on {new Date(rep.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {rep.turnsCount} turns graded
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>OVERALL SCORE</span>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        color: (rep.overallScore || 0) >= 70 ? 'var(--accent-success)' : (rep.overallScore || 0) >= 40 ? 'var(--accent-warn)' : 'var(--accent-danger)',
                      }}
                    >
                      {rep.overallScore ?? 0}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link href={`/report/${rep.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                        View Report
                      </Button>
                    </Link>
                    <Link href={`/transcript/${rep.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="md">
                        Transcript
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
