import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentCandidate } from '@/lib/auth';
import { gradeCandidateAnswer, compileFinalReport } from '@/lib/grading';
import curriculumDataRaw from '@/data/curriculum.json';
import { CurriculumData } from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;

const moduleQuestionsBank: Record<number, { day: number; questions: string[] }[]> = {
  1: [
    { day: 1, questions: ["How do Byte Pair Encoding (BPE) tokenizers affect context window budgeting when handling specialized technical domains?", "What strategies do you use when balancing context window limits against instruction length and few-shot examples?"] },
    { day: 2, questions: ["Explain how system prompts and schema enforcement (e.g. Pydantic/JSON Mode) prevent prompt injection and output format hallucination.", "When designing system prompts for structured data extraction, how do you handle optional fields and dynamic schema validation?"] },
  ],
  2: [
    { day: 5, questions: ["When generating vector embeddings for technical documentation, how do cosine distance and dot product metrics differ across normalized vs unnormalized vectors?", "Why might a high-dimensional embedding model fail to capture domain-specific terminology without fine-tuning or hybrid search?"] },
    { day: 8, questions: ["Explain Reciprocal Rank Fusion (RRF) and why combining BM25 keyword matching with dense vector retrieval improves RAG accuracy.", "How does Cohere or BGE re-ranking reduce noise in top-k context windows before passing documents to an LLM generator?"] },
  ],
  3: [
    { day: 10, questions: ["How does Low-Rank Adaptation (LoRA) reduce trainable parameters, and how do you select rank 'r' and alpha for target attention matrices?", "What are the trade-offs between tuning query/value projection matrices versus tuning all linear layers in Transformer models?"] },
    { day: 11, questions: ["Explain the mechanics of 4-bit QLoRA (NF4 format) and double quantization. How does it maintain model performance on consumer hardware?", "What memory savings and latency trade-offs do you observe when comparing 4-bit QLoRA to FP16 full fine-tuning?"] },
  ],
  4: [
    { day: 13, questions: ["How do you define strict tool schemas in JSON Schema format to ensure LLMs correctly populate parameter arguments?", "What strategies prevent LLMs from hallucinating parameters that do not exist in the defined tool signature?"] },
    { day: 14, questions: ["Describe your implementation of an asynchronous tool execution pipeline when handling concurrent LLM function calls.", "How do you safely format and sanitize raw API outputs before injecting them back into the LLM conversation context?"] },
  ],
  5: [
    { day: 17, questions: ["Walk me through the ReAct (Thought-Action-Observation) loop. How do you prevent infinite execution loops when an agent encounters missing tools?", "How do you enforce maximum iteration limits and state recovery in autonomous agent decision loops?"] },
    { day: 18, questions: ["Compare the Plan-and-Execute agent framework with the ReAct loop. In what scenarios is pre-planning superior to step-by-step reaction?", "How does a Planner Agent dynamically rewrite its execution plan when an intermediate task step fails?"] },
  ],
  6: [
    { day: 21, questions: ["What is the Model Context Protocol (MCP) and how does it standardize client-server interactions between AI models and local tools?", "How does dynamic MCP resource discovery allow an AI application to inspect available servers, prompts, and tools at runtime?"] },
    { day: 23, questions: ["How do stateful MCP sidecars maintain long-lived RPC connections, and how do they manage transport lifecycle events?", "What isolation benefits does running tools inside dedicated MCP sidecar processes afford to overall application stability?"] },
  ],
  7: [
    { day: 25, questions: ["When setting up an LLM-as-a-Judge evaluation framework, how do you mitigate position bias and verbosity bias in grading outputs?", "What rubric scoring criteria do you establish when evaluating code generation accuracy using Gpt-4 or Sonnet as judge?"] },
    { day: 26, questions: ["Explain the Ragas evaluation framework metrics: Faithfulness, Answer Relevance, and Context Recall.", "What steps do you take when Ragas reports high Context Recall but low Faithfulness on a RAG dataset?"] },
  ],
  8: [
    { day: 29, questions: ["How do you instrument OpenTelemetry tracing to track token latency spans and tool execution calls across complex agentic graphs?", "What key metrics in LangSmith or Phoenix do you monitor to catch token degradation and context ballooning in production?"] },
    { day: 30, questions: ["Explain Time-to-First-Token (TTFT) vs Time-per-Output-Token (TPOT). How do you optimize inference pipelines for low TTFT?", "How do dynamic cost-based model routers dynamically switch between high-capacity and small models based on prompt complexity?"] },
  ],
};

function normaliseQuestion(question: string) {
  return question.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function isDuplicateQuestion(question: string, previousQuestions: string[]) {
  const normalised = normaliseQuestion(question);
  return previousQuestions.some((previous) => {
    const prior = normaliseQuestion(previous);
    if (prior === normalised) return true;
    const tokens = new Set(normalised.split(' ').filter(Boolean));
    const priorTokens = new Set(prior.split(' ').filter(Boolean));
    const overlap = Array.from(tokens).filter((token) => priorTokens.has(token)).length;
    return overlap / Math.max(tokens.size, priorTokens.size, 1) >= 0.85;
  });
}

export async function POST(req: NextRequest, { params }: { params: { interviewId: string } }) {
  try {
    const currentCandidate = await getCurrentCandidate();
    if (!currentCandidate) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { interviewId } = params;
    const body = await req.json();
    const { message, action = 'respond' } = body;

    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        turns: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    // Handle early finish action
    if (action === 'finish') {
      const report = await compileFinalReport(interviewId);
      const parsedReport = {
        ...report,
        difficultyUsed: interview.difficulty,
        date: new Date(report.createdAt).toLocaleDateString(),
        durationMinutes: 15,
        candidateName: currentCandidate.member.name,
        candidateRole: currentCandidate.member.role,
        strengths: JSON.parse(report.strengths),
        gaps: JSON.parse(report.gaps),
        next: JSON.parse(report.next),
        categoryBreakdown: JSON.parse(report.categoryBreakdown),
      };

      return NextResponse.json({
        done: true,
        feedback: parsedReport,
      });
    }

    if (!message) {
      return NextResponse.json({ error: 'Candidate answer message required' }, { status: 400 });
    }

    // Get last interviewer question
    const interviewerTurns = interview.turns.filter((t) => t.role === 'interviewer');
    const lastQuestionTurn = interviewerTurns[interviewerTurns.length - 1];
    const questionText = lastQuestionTurn?.content || 'Technical assessment question';

    // 1. Grade candidate answer immediately!
    const grade = gradeCandidateAnswer(questionText, message);

    // 2. Save candidate Turn with correctness and gradeNotes to DB
    await prisma.turn.create({
      data: {
        interviewId,
        role: 'candidate',
        content: message,
        day: lastQuestionTurn?.day || 1,
        correctness: grade.correctness,
        gradeNotes: grade.gradeNotes,
      },
    });

    const candidateTurnsCount = interview.turns.filter((t) => t.role === 'candidate').length + 1;
    const targetCount = 8;

    // Check if target question count reached
    if (candidateTurnsCount >= targetCount) {
      const report = await compileFinalReport(interviewId);
      const parsedReport = {
        ...report,
        difficultyUsed: interview.difficulty,
        date: new Date(report.createdAt).toLocaleDateString(),
        durationMinutes: 16,
        candidateName: currentCandidate.member.name,
        candidateRole: currentCandidate.member.role,
        strengths: JSON.parse(report.strengths),
        gaps: JSON.parse(report.gaps),
        next: JSON.parse(report.next),
        categoryBreakdown: JSON.parse(report.categoryBreakdown),
      };

      return NextResponse.json({
        done: true,
        feedback: parsedReport,
      });
    }

    // Determine next question with STRICT module rotation & deduplication guard
    const isLowScore = grade.correctness < 0.3;
    let nextDay = 1;
    let nextQuestionText = '';
    let isFollowUp = false;

    // Collect already asked days and question contents
    const askedDaysSet = new Set(interviewerTurns.map((t) => t.day).filter(Boolean) as number[]);
    const askedQuestionsText = interviewerTurns.map((t) => t.content.toLowerCase());

    const followUpAlreadyAsked = lastQuestionTurn
      ? interviewerTurns.some((turn) => turn.day === lastQuestionTurn.day && turn.isFollowUp)
      : false;
    if (isLowScore && lastQuestionTurn && !lastQuestionTurn.isFollowUp && !followUpAlreadyAsked) {
      // Low score forces a probing follow-up staying on the SAME day!
      isFollowUp = true;
      nextDay = lastQuestionTurn.day || 1;
      nextQuestionText = `Let's probe a bit deeper into Day ${nextDay}. Could you walk me through how you would handle failure recovery and error handling in a production environment?`;
    } else {
      // Rotate to an UNVISITED curriculum module & day!
      const moduleOrder = [1, 2, 4, 5, 6, 7, 8, 3];
      let selectedModule = moduleOrder[candidateTurnsCount % moduleOrder.length];
      let candidatesList = moduleQuestionsBank[selectedModule] || moduleQuestionsBank[1];

      // Find an unvisited day from module list
      let dayObj = candidatesList.find((item) => !askedDaysSet.has(item.day));

      if (!dayObj) {
        const allDays = Object.values(moduleQuestionsBank).flat();
        dayObj = allDays.find((item) => !askedDaysSet.has(item.day)) || candidatesList[0];
      }

      nextDay = dayObj.day;
      const availableQ = dayObj.questions.find((q) => !askedQuestionsText.includes(q.toLowerCase())) || dayObj.questions[0];

      // Inject candidate resume context if present and relevant
      if (interview.candidate.resumeText && candidateTurnsCount === 2) {
        const resumeSnippet = interview.candidate.resumeText.slice(0, 100);
        nextQuestionText = `Drawing from your experience noted in your resume ("${resumeSnippet}..."), ${availableQ}`;
      } else {
        nextQuestionText = availableQ;
      }
    }

    // Server-Side Duplicate Check: Reject if exact question was already asked in non-followup
    if (isDuplicateQuestion(nextQuestionText, interviewerTurns.map((turn) => turn.content))) {
      const allDays = Object.values(moduleQuestionsBank).flat();
      const forcedDay = allDays.find((item) => !askedDaysSet.has(item.day));
      if (forcedDay) {
        nextDay = forcedDay.day;
        isFollowUp = false;
        nextQuestionText = forcedDay.questions.find((question) => !isDuplicateQuestion(question, interviewerTurns.map((turn) => turn.content))) || `Moving to Day ${nextDay}: describe the core implementation trade-offs for this module.`;
      }
    }

    // Persist new interviewer Turn in DB
    const newInterviewerTurn = await prisma.turn.create({
      data: {
        interviewId,
        role: 'interviewer',
        content: nextQuestionText,
        day: nextDay,
        isFollowUp,
      },
    });

    const cDay = curriculum.days.find((d) => d.day === nextDay) || curriculum.days[0];
    const cMod = curriculum.modules.find((m) => m.id === cDay.moduleId) || curriculum.modules[0];

    const currentQuestion = {
      id: newInterviewerTurn.id,
      question: nextQuestionText,
      meta: {
        moduleTitle: cMod.title,
        dayNumber: nextDay,
        difficulty: interview.difficulty,
      },
      isFollowUp,
    };

    const daysCovered = Array.from(new Set([...Array.from(askedDaysSet), nextDay]));

    return NextResponse.json({
      done: false,
      currentQuestion,
      daysCovered,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error processing turn';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
