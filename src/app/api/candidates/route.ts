import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import candidatesDataRaw from '@/data/candidates.json';

export async function GET() {
  try {
    const dbCandidates = await prisma.candidate.findMany({
      include: {
        signals: true,
        missions: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const candidateMap = candidatesDataRaw.candidates.reduce((acc, item) => {
      acc[item.id] = item.member.avatar;
      return acc;
    }, {} as Record<string, string>);

    const result = dbCandidates.map((c) => ({
      id: c.id,
      member: {
        name: c.name,
        role: c.jobRole,
        yearsExperience: `${c.yearsExperience} yrs exp`,
        education: c.education,
        statusBadge: c.status,
        avatar: candidateMap[c.id] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      },
      signals: {
        commitDays: c.signals?.commitDays || 0,
        missionsCompleted: c.signals?.missionsCompleted || 0,
        missionsFirstTry: c.signals?.missionsFirstTry || 0,
        passRate: c.signals ? (c.signals.missionsCompleted > 0 ? c.signals.missionsCompleted / 31 : 0) : 0,
      },
      missions: c.missions.map((m) => ({
        day: m.day,
        title: m.title,
        completed: m.passed,
        skipped: m.skipped,
        attempts: m.attempts,
        firstTry: m.attempts === 1 && m.passed,
      })),
      isSeedProfile: c.isSeedProfile,
      email: c.email,
    }));

    return NextResponse.json({ candidates: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching candidates';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
