import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './db';
import candidatesDataRaw from '../data/candidates.json';

const JWT_SECRET = process.env.JWT_SECRET || 'synapse_secret_key_2026_antigravity';
const COOKIE_NAME = 'synapse_session';

const avatarMap = candidatesDataRaw.candidates.reduce((acc, c) => {
  acc[c.id] = c.member.avatar;
  return acc;
}, {} as Record<string, string>);

export interface SessionPayload {
  candidateId: string;
  email: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function setSessionCookie(candidateId: string, email: string) {
  const token = signToken({ candidateId, email });
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentCandidate() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.candidateId) return null;

    const c = await prisma.candidate.findUnique({
      where: { id: payload.candidateId },
      include: {
        signals: true,
        missions: true,
      },
    });

    if (!c) return null;

    return {
      id: c.id,
      email: c.email,
      resumeText: c.resumeText,
      member: {
        name: c.name,
        role: c.jobRole,
        yearsExperience: typeof c.yearsExperience === 'number' ? `${c.yearsExperience} yrs exp` : c.yearsExperience,
        education: c.education,
        statusBadge: c.status,
        avatar: avatarMap[c.id] || '',
      },
      signals: {
        commitDays: c.signals?.commitDays || 0,
        missionsCompleted: c.signals?.missionsCompleted || 0,
        missionsFirstTry: c.signals?.missionsFirstTry || 0,
        passRate: c.signals ? (c.signals.missionsCompleted > 0 ? c.signals.missionsCompleted / 31 : 0) : 0,
      },
      missions: (c.missions || []).map((m) => ({
        day: m.day,
        title: m.title,
        completed: m.passed,
        skipped: m.skipped,
        attempts: m.attempts,
        firstTry: m.attempts === 1 && m.passed,
      })),
    };
  } catch (err) {
    return null;
  }
}
