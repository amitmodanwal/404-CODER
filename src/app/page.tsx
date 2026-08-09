import { redirect } from 'next/navigation';
import { getCurrentCandidate } from '@/lib/auth';

export default async function RootPage() {
  const candidate = await getCurrentCandidate();

  if (!candidate) {
    redirect('/login');
  } else {
    redirect('/dashboard');
  }
}
