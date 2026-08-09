'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { InterviewSetup } from '@/components/screens/InterviewSetup';
import { Candidate, DifficultyLevel } from '@/types/interview';

export default function SetupPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCandidate(data.candidate);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadCandidate();
  }, [router]);

  const handleBeginInterview = async (config: {
    difficulty: DifficultyLevel;
    length: 'standard' | 'extended';
    focusModules: number[];
  }) => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        alert(data.error || 'Failed to start interview session');
        setIsStarting(false);
      }
    } catch (err) {
      alert('Error starting interview session');
      setIsStarting(false);
    }
  };

  if (loading || !candidate) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading setup configuration...</div>;
  }

  return (
    <div>
      <BackButton onClick={() => router.push('/confirm')} label="Back to Profile Confirmation" />
      <InterviewSetup
        candidate={candidate}
        onBeginInterview={handleBeginInterview}
        isLoading={isStarting}
      />
    </div>
  );
}
