'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ReportView } from '@/components/screens/ReportView';
import { FeedbackReport, Candidate } from '@/types/interview';

export default function ReportPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter();
  const { interviewId } = params;
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const res = await fetch(`/api/interviews/${interviewId}/report`);
        if (res.ok) {
          const data = await res.json();
          setReport(data.report);
          setCandidate(data.interview?.candidate ? {
            id: data.interview.candidate.id,
            member: {
              name: data.interview.candidate.name,
              role: data.interview.candidate.jobRole,
              yearsExperience: `${data.interview.candidate.yearsExperience} yrs exp`,
              education: data.interview.candidate.education,
              statusBadge: data.interview.candidate.status,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            },
            signals: { commitDays: 30, missionsCompleted: 30, missionsFirstTry: 28, passRate: 0.93 },
            missions: [],
          } : null);
        }
      } catch (err) {
        // Ignore
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [interviewId]);

  if (loading || !report || !candidate) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading graded report...</div>;
  }

  return (
    <div>
      <BackButton onClick={() => router.push('/dashboard')} label="Back to Dashboard" />
      <ReportView
        report={report}
        candidate={candidate}
        onViewTranscript={() => router.push(`/transcript/${interviewId}`)}
        onNewInterview={() => router.push('/setup')}
      />
    </div>
  );
}
