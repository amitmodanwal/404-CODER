import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCandidate } from '@/lib/auth';
import curriculumDataRaw from '@/data/curriculum.json';
import { CurriculumData } from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

export async function GET(req: NextRequest, { params }: { params: { interviewId: string } }) {
  try {
    const candidate = await getCurrentCandidate();
    if (!candidate) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { interviewId } = params;

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        report: true,
        turns: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    let parsedReport = null;
    if (interview.report) {
      parsedReport = {
        ...interview.report,
        difficultyUsed: interview.difficulty,
        date: new Date(interview.report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        durationMinutes: 18,
        candidateName: interview.candidate.name,
        candidateRole: interview.candidate.jobRole,
        strengths: JSON.parse(interview.report.strengths),
        gaps: JSON.parse(interview.report.gaps),
        next: JSON.parse(interview.report.next),
        categoryBreakdown: JSON.parse(interview.report.categoryBreakdown).map((category: any) => ({
          ...category,
          moduleTitle: category.moduleTitle || category.module || 'Untitled module',
        })),
      };
    }

    // Format turn history with per-question correctness scores for transcript
    const turnsHistory = [];
    const rawTurns = interview.turns;

    for (let i = 0; i < rawTurns.length; i++) {
      const turn = rawTurns[i];
      if (turn.role === 'interviewer') {
        const nextCandidateTurn = rawTurns[i + 1]?.role === 'candidate' ? rawTurns[i + 1] : null;
        const dayNumber = turn.day || 1;
        const cDay = curriculum.days.find((d) => d.day === dayNumber) || curriculum.days[0];
        const cMod = curriculum.modules.find((m) => m.id === cDay.moduleId) || curriculum.modules[0];

        turnsHistory.push({
          id: turn.id,
          question: {
            id: turn.id,
            question: turn.content,
            meta: {
              moduleTitle: cMod.title,
              dayNumber,
              difficulty: interview.difficulty,
            },
            isFollowUp: turn.isFollowUp,
          },
          candidateAnswer: nextCandidateTurn?.content,
          correctness: nextCandidateTurn?.correctness ?? null,
          gradeNotes: nextCandidateTurn?.gradeNotes ?? null,
          timestamp: new Date(turn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }
    }

    return NextResponse.json({
      interview,
      report: parsedReport,
      turnsHistory,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching report';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
