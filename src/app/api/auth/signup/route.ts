import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, jobRole, yearsExperience, education } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.candidate.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const parsedYears = parseFloat(yearsExperience) || 1.0;

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        passwordHash,
        jobRole: jobRole || 'AI Engineer',
        yearsExperience: parsedYears,
        education: education || 'Self-Taught Cohort Learner',
        status: 'New Cohort Candidate',
        isSeedProfile: false,
        signals: {
          create: {
            commitDays: 0,
            missionsCompleted: 0,
            missionsFirstTry: 0,
          },
        },
      },
      include: {
        signals: true,
        missions: true,
      },
    });

    await setSessionCookie(candidate.id, candidate.email);

    return NextResponse.json({ candidate });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Signup error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
