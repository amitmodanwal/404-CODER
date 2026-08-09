import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoCandidateId } = body;

    // Fast-path demo candidate login
    if (demoCandidateId) {
      const candidate = await prisma.candidate.findUnique({
        where: { id: demoCandidateId },
        include: { signals: true, missions: true },
      });

      if (!candidate) {
        return NextResponse.json({ error: 'Demo candidate profile not found' }, { status: 404 });
      }

      await setSessionCookie(candidate.id, candidate.email);
      return NextResponse.json({ candidate });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { email },
      include: { signals: true, missions: true },
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, candidate.passwordHash);
    if (!match && candidate.passwordHash !== 'demo-password') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await setSessionCookie(candidate.id, candidate.email);
    return NextResponse.json({ candidate });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
