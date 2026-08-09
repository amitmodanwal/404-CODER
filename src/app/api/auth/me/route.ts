import { NextResponse } from 'next/server';
import { getCurrentCandidate } from '@/lib/auth';

export async function GET() {
  const candidate = await getCurrentCandidate();
  if (!candidate) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  return NextResponse.json({ candidate });
}
