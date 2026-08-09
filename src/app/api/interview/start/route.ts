import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCandidate } from '@/lib/auth';
import curriculumDataRaw from '@/data/curriculum.json';
import { CurriculumData } from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

const initialQuestionsMap: Record<number, string> = {
  1: "How do Byte Pair Encoding (BPE) tokenizers affect context window budgeting when handling specialized technical domains or multiline code snippets?",
  2: "Explain how system prompts and schema enforcement (e.g. Pydantic/JSON Mode) prevent prompt injection and output format hallucination.",
  5: "When generating vector embeddings for technical documentation, how do cosine distance and dot product metrics differ across normalized vs unnormalized vectors?",
  9: "What data cleaning procedures do you perform on instruction datasets before fine-tuning to prevent model memorization and loss spikes?",
  13: "How do you define strict tool schemas in JSON Schema format to ensure LLMs correctly populate parameter arguments?",
  17: "Walk me through the ReAct (Thought-Action-Observation) loop. How do you prevent infinite execution loops when an agent encounters missing tools?",
  21: "What is the Model Context Protocol (MCP) and how does it standardize client-server interactions between AI models and local tools?",
  25: "When setting up an LLM-as-a-Judge evaluation framework, how do you mitigate position bias and verbosity bias in grading outputs?",
  29: "How do you instrument OpenTelemetry tracing to track token latency spans and tool execution calls across complex agentic graphs?",
};

export async function POST(req: NextRequest) {
  try {
    const currentCandidate = await getCurrentCandidate();
    if (!currentCandidate) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { difficulty = 'Advanced', length = 'standard' } = body;

    // Create DB Interview row
    const interview = await prisma.interview.create({
      data: {
        candidateId: currentCandidate.id,
        difficulty,
        status: 'in_progress',
      },
    });

    const candidateDb = await prisma.candidate.findUnique({
      where: { id: currentCandidate.id },
      select: { resumeText: true },
    });

    let initialDay = 1;
    let initialQuestionText = initialQuestionsMap[1];

    // If resumeText is present, customize initial question using resume context
    if (candidateDb?.resumeText) {
      const resumeLower = candidateDb.resumeText.toLowerCase();
      if (resumeLower.includes('vector') || resumeLower.includes('rag') || resumeLower.includes('embedding')) {
        initialDay = 5;
        initialQuestionText = `I noticed your background in vector search and embeddings. ${initialQuestionsMap[5]}`;
      } else if (resumeLower.includes('mcp') || resumeLower.includes('agent') || resumeLower.includes('sidecar')) {
        initialDay = 21;
        initialQuestionText = `Given your experience with agentic systems and protocol integration, ${initialQuestionsMap[21]}`;
      } else if (resumeLower.includes('eval') || resumeLower.includes('benchmark') || resumeLower.includes('ragas')) {
        initialDay = 25;
        initialQuestionText = `Based on your work in evaluation benchmarks, ${initialQuestionsMap[25]}`;
      } else {
        const resumeExcerpt = candidateDb.resumeText.replace(/\s+/g, ' ').slice(0, 140);
        initialQuestionText = `Your resume mentions “${resumeExcerpt}”. ${initialQuestionsMap[1]}`;
      }
    }

    // Create initial interviewer turn in DB
    const initialTurn = await prisma.turn.create({
      data: {
        interviewId: interview.id,
        role: 'interviewer',
        content: initialQuestionText,
        day: initialDay,
        isFollowUp: false,
      },
    });

    const cDay = curriculum.days.find((d) => d.day === initialDay) || curriculum.days[0];
    const modData = curriculum.modules.find((m) => m.id === cDay.moduleId) || curriculum.modules[0];

    const currentQuestion = {
      id: initialTurn.id,
      question: initialQuestionText,
      meta: {
        moduleTitle: modData.title,
        dayNumber: initialDay,
        difficulty,
      },
      isFollowUp: false,
    };

    return NextResponse.json({
      interviewId: interview.id,
      currentQuestion,
      daysCovered: [initialDay],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error starting interview';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
