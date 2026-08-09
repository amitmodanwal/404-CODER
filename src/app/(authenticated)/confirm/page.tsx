'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { ProfileConfirmation } from '@/components/screens/ProfileConfirmation';
import { Candidate } from '@/types/interview';

export default function ConfirmPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !candidate) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading profile data...</div>;
  }

  return (
    <div>
      <BackButton onClick={() => router.push('/start')} label="Back to Candidate Picker" />
      <ProfileConfirmation
        candidate={candidate}
        onConfirm={() => router.push('/setup')}
        onChooseDifferent={() => router.push('/start')}
      />
    </div>
  );
}
