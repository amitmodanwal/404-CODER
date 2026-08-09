'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Candidate } from '@/types/interview';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setCandidate(data.candidate);
        setLoading(false);
      } catch (err) {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-heading)',
          fontSize: '16px',
        }}
      >
        Loading authenticated session...
      </div>
    );
  }

  // Distraction-free full width layout for live interview page
  if (pathname.startsWith('/interview/')) {
    return <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>{children}</main>;
  }

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar candidate={candidate} />
      <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', padding: '32px 40px', maxWidth: '1240px' }}>{children}</main>
    </div>
  );
}
