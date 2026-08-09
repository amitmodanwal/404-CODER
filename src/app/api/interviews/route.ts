import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCandidate } from '@/lib/auth';
import curriculumDataRaw from '@/data/curriculum.json';
import { CurriculumData } from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

export async function GET() {
  try {
    const candidate = await getCurrentCandidate();
    if (!candidate) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const interviews = await prisma.interview.findMany({
      where: { candidateId: candidate.id },
      include: {
        report: true,
        turns: {
          select: { id: true, role: true, day: true, correctness: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute union of distinct modules covered across all completed interviews
    const touchedDaysSet = new Set<number>();
    interviews.forEach((inv) => {
      if (inv.status === 'completed' || inv.report) {
        inv.turns.forEach((t) => {
          if (t.day) touchedDaysSet.add(t.day);
        });
      }
    });

    const touchedModuleIds = new Set<number>();
    touchedDaysSet.forEach((day) => {
      const cDay = curriculum.days.find((d) => d.day === day);
      if (cDay) {
        touchedModuleIds.add(cDay.moduleId);
      }
    });

    const modulesCoveredCount = touchedModuleIds.size;

    const result = interviews.map((inv) => ({
      id: inv.id,
      difficulty: inv.difficulty,
      status: inv.status,
      createdAt: inv.createdAt,
      completedAt: inv.completedAt,
      overallScore: inv.report?.overallScore ?? null,
      turnsCount: inv.turns.filter((t) => t.role === 'candidate').length,
    }));

    return NextResponse.json({
      interviews: result,
      modulesCoveredCount,
      totalModules: curriculum.modules.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching interviews';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
