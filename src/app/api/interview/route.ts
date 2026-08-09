import { NextRequest, NextResponse } from 'next/server';
import curriculumDataRaw from '@/data/curriculum.json';
import candidatesDataRaw from '@/data/candidates.json';
import {
  ApiInterviewRequest,
  ApiInterviewResponse,
  Candidate,
  CurriculumData,
  DifficultyLevel,
  FeedbackReport,
  QuestionData,
} from '@/types/interview';

const curriculum = curriculumDataRaw as unknown as CurriculumData;
const candidates = candidatesDataRaw.candidates as unknown as Candidate[];

// In-memory store for active session states during server execution
interface ServerSessionState {
  sessionId: string;
  candidate: Candidate;
  difficulty: DifficultyLevel;
  length: 'standard' | 'extended';
  questionsAsked: QuestionData[];
  answers: { questionId: string; questionText: string; answerText: string; isFollowUp: boolean; dayNumber: number; correctness: number; gradeNotes: string }[];
  daysCovered: number[];
  targetCount: number;
}

const globalSessionStore: Record<string, ServerSessionState> = {};

// Questions bank mapping curriculum days to realistic technical interview questions
const questionBank: Record<number, string[]> = {
  1: [
    "How do Byte Pair Encoding (BPE) tokenizers affect context window budgeting when handling specialized technical domains or multiline code snippets?",
    "What strategies do you use when balancing context window limits against instruction length and few-shot examples?"
  ],
  2: [
    "Explain how system prompts and schema enforcement (e.g. Pydantic/JSON Mode) prevent prompt injection and output format hallucination.",
    "When designing system prompts for structured data extraction, how do you handle optional fields and dynamic schema validation?"
  ],
  3: [
    "How does Chain-of-Thought (CoT) prompting alter the internal activation path of LLMs, and when would you prefer Self-Consistency over standard CoT?",
    "Can you describe a scenario where Tree-of-Thoughts (ToT) reasoning outperformed single-pass CoT in a complex engineering task?"
  ],
  4: [
    "What are the trade-offs between JSON schema enforcement at the model decoding level (grammars) versus post-processing regex validation?",
    "How do you configure retry mechanisms when an LLM produces syntactically invalid JSON output during tool dispatching?"
  ],
  5: [
    "When generating vector embeddings for technical documentation, how do cosine distance and dot product metrics differ across normalized vs unnormalized vectors?",
    "Why might a high-dimensional embedding model fail to capture domain-specific terminology without fine-tuning or hybrid search?"
  ],
  6: [
    "Compare recursive character chunking against semantic chunking for long code repositories. How do you prevent context truncation across function definitions?",
    "How do you determine optimal chunk sizes and overlap windows when indexing API reference manuals?"
  ],
  7: [
    "What are the performance implications of HNSW index parameters (M and ef_construction) on vector search latency versus recall in Qdrant or Pinecone?",
    "How do you implement metadata filtering in vector databases without incurring significant query performance degradation?"
  ],
  8: [
    "Explain Reciprocal Rank Fusion (RRF) and why combining BM25 keyword matching with dense vector retrieval improves RAG accuracy.",
    "How does Cohere or BGE re-ranking reduce noise in top-k context windows before passing documents to an LLM generator?"
  ],
  9: [
    "What data cleaning procedures do you perform on instruction datasets before fine-tuning to prevent model memorization and loss spikes?",
    "How do you handle multi-turn dialogue formatting when curating dataset JSONL files for instruction tuning?"
  ],
  10: [
    "How does Low-Rank Adaptation (LoRA) reduce trainable parameters, and how do you select rank 'r' and alpha for target attention matrices?",
    "What are the trade-offs between tuning query/value projection matrices versus tuning all linear layers in Transformer models?"
  ],
  11: [
    "Explain the mechanics of 4-bit QLoRA (NF4 format) and double quantization. How does it maintain model performance on consumer hardware?",
    "What memory savings and latency trade-offs do you observe when comparing 4-bit QLoRA to FP16 full fine-tuning?"
  ],
  12: [
    "How does vLLM achieve high throughput using PagedAttention, and how does it compare to GGUF execution in Ollama for low-latency inference?",
    "When exporting fine-tuned LoRA adapters into standalone GGUF or AWQ formats, what quantization artifacts should you audit?"
  ],
  13: [
    "How do you define strict tool schemas in JSON Schema format to ensure LLMs correctly populate parameter arguments?",
    "What strategies prevent LLMs from hallucinating parameters that do not exist in the defined tool signature?"
  ],
  14: [
    "Describe your implementation of an asynchronous tool execution pipeline when handling concurrent LLM function calls.",
    "How do you safely format and sanitize raw API outputs before injecting them back into the LLM conversation context?"
  ],
  15: [
    "How do you architect multi-tool orchestration when an agent needs to call search, database query, and code interpreter tools in parallel?",
    "What patterns do you use to resolve tool dependency graphs where Tool B depends on the execution output of Tool A?"
  ],
  16: [
    "What safety guardrails do you put in place to catch invalid parameters or destructive API function calls generated by an LLM?",
    "How do you implement fallback behavior when an external API tool returns a 5xx timeout during agent execution?"
  ],
  17: [
    "Walk me through the ReAct (Thought-Action-Observation) loop. How do you prevent infinite execution loops when an agent encounters missing tools?",
    "How do you enforce maximum iteration limits and state recovery in autonomous agent decision loops?"
  ],
  18: [
    "Compare the Plan-and-Execute agent framework with the ReAct loop. In what scenarios is pre-planning superior to step-by-step reaction?",
    "How does a Planner Agent dynamically rewrite its execution plan when an intermediate task step fails?"
  ],
  19: [
    "How do you design a hybrid agent memory system that combines short-term message buffers with long-term semantic vector memory?",
    "What summarizing strategies keep long-running agent conversation buffers within context limits without dropping key intent?"
  ],
  20: [
    "In a multi-agent architecture (e.g. Hierarchical Swarm), how do supervisor agents delegate tasks to specialized sub-agents?",
    "How do you manage agent consensus and avoid debate deadlocks when multiple sub-agents hold conflicting perspectives?"
  ],
  21: [
    "What is the Model Context Protocol (MCP) and how does it standardize client-server interactions between AI models and local tools?",
    "How does MCP resolve the protocol fragmentation of custom plugin APIs across different LLM hosts?"
  ],
  22: [
    "Explain how dynamic MCP resource discovery allows an AI application to inspect available servers, prompts, and tools at runtime.",
    "How do URI templates in MCP enable contextual resource fetching from live databases or file systems?"
  ],
  23: [
    "How do stateful MCP sidecars maintain long-lived RPC connections, and how do they manage transport lifecycle events?",
    "What isolation benefits does running tools inside dedicated MCP sidecar processes afford to overall application stability?"
  ],
  24: [
    "What security authorization controls and sandboxing measures must be enforced before giving an MCP agent access to filesystem resources?",
    "How does capability negotiation work during the initial MCP initialization handshake?"
  ],
  25: [
    "When setting up an LLM-as-a-Judge evaluation framework, how do you mitigate position bias and verbosity bias in grading outputs?",
    "What rubric scoring criteria do you establish when evaluating code generation accuracy using Gpt-4 or Claude 3.5 Sonnet as judge?"
  ],
  26: [
    "Explain the Ragas evaluation framework metrics: Faithfulness, Answer Relevance, and Context Recall. How are they calculated mathematically?",
    "What steps do you take when Ragas reports high Context Recall but low Faithfulness on a RAG dataset?"
  ],
  27: [
    "How do you structure an automated benchmark pipeline in CI/CD to detect LLM performance regressions before deploying model updates?",
    "Why is a ground-truth dataset essential for benchmark evaluation, and how do you continuously curate it?"
  ],
  28: [
    "Compare NeMo Guardrails with Llama Guard for input/output sanitization. How do you enforce topical and safety constraints?",
    "How do guardrail interceptors handle streaming responses without introducing intolerable latency?"
  ],
  29: [
    "How do you instrument OpenTelemetry tracing to track token latency spans and tool execution calls across complex agentic graphs?",
    "What key metrics in LangSmith or Phoenix do you monitor to catch token degradation and context ballooning in production?"
  ],
  30: [
    "Explain Time-to-First-Token (TTFT) vs Time-per-Output-Token (TPOT). How do you optimize inference pipelines for low TTFT?",
    "How do dynamic cost-based model routers dynamically switch between high-capacity and small models based on prompt complexity?"
  ],
  31: [
    "How do circuit breakers and fallback model routing prevent production service outages when an upstream LLM API experiences elevated error rates?",
    "What SLA guardrails do you establish to ensure 99.9% uptime for customer-facing AI agent interfaces?"
  ]
};

// Probing follow-up generators based on candidate answer analysis
function generateProbingFollowUp(prevQuestion: QuestionData, answer: string): string {
  const words = answer.split(/\s+/).length;
  if (words < 15) {
    return `That's a concise start regarding ${prevQuestion.meta.moduleTitle}. Could you expand on the exact architectural implementation details and edge cases you would consider in production?`;
  }
  if (answer.toLowerCase().includes("code") || answer.toLowerCase().includes("api")) {
    return `Building on your point about production deployment for Day ${prevQuestion.meta.dayNumber}, how do you handle failure recovery, retries, and state validation when unexpected errors occur?`;
  }
  return `You touched on key aspects of ${prevQuestion.meta.moduleTitle}. How would you benchmark and monitor this solution to ensure performance and cost efficiency at scale?`;
}

// Deterministic baseline grading prevents a plausible report from inflating
// obvious non-answers. An LLM grader can replace this function without
// changing the score calculation contract below.
function gradeAnswer(question: string, answer: string) {
  const trimmed = answer.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const nonAnswer = words < 3 || /^(h+|idk|i don't know|ok|test|asdf|n\/a)$/i.test(trimmed);
  if (nonAnswer) return { correctness: 0.05, gradeNotes: 'This response does not substantively address the question asked.' };
  const topicTerms = question.toLowerCase().match(/[a-z]{4,}/g) || [];
  const matches = topicTerms.filter(term => trimmed.toLowerCase().includes(term)).length;
  const correctness = Math.min(0.95, Math.max(0.2, 0.25 + Math.min(0.35, words / 110) + Math.min(0.35, matches * 0.08)));
  return { correctness, gradeNotes: correctness >= 0.7 ? 'Relevant technical concepts and useful detail were provided.' : 'The response is partially relevant but misses important technical detail.' };
}

// Compute dynamic difficulty recommendation rationale based on candidate signals
function computeDifficultyRecommendation(candidate: Candidate): { difficulty: DifficultyLevel; rationale: string } {
  const { passRate, missionsCompleted, commitDays, missionsFirstTry } = candidate.signals;
  const skippedCount = candidate.missions.filter(m => m.skipped).length;

  if (passRate >= 0.88 && missionsCompleted >= 28) {
    return {
      difficulty: 'Advanced',
      rationale: `Advanced — ${missionsCompleted}/31 missions completed (${commitDays} commit days), ${(passRate * 100).toFixed(0)}% pass rate with strong signals across Agentic AI & MCP (Days 21–24).`,
    };
  }
  if (passRate >= 0.75 || missionsCompleted >= 24) {
    return {
      difficulty: 'Intermediate',
      rationale: `Intermediate — ${missionsCompleted}/31 missions completed with high consistency. ${skippedCount} skipped topics noted for targeted probing.`,
    };
  }
  return {
    difficulty: 'Beginner',
    rationale: `Beginner — ${missionsCompleted}/31 missions completed (${missionsFirstTry} first-try passes). Recommended focus on core foundations & prompting.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ApiInterviewRequest = await req.json();
    const { action, sessionId, candidateId, answer, difficulty, length = 'standard' } = body;

    if (!sessionId || !candidateId) {
      return NextResponse.json({ error: 'Missing required sessionId or candidateId' }, { status: 400 });
    }

    const candidate = candidates.find(c => c.id === candidateId) || candidates[0];
    const rec = computeDifficultyRecommendation(candidate);
    const chosenDifficulty = difficulty || rec.difficulty;
    const targetCount = length === 'extended' ? 12 : 8;

    // Action: START
    if (action === 'start') {
      // Pick initial question from completed modules or skipped areas
      const initialDay = candidate.missions.find(m => m.completed)?.day || 1;
      const dayData = curriculum.days.find(d => d.day === initialDay) || curriculum.days[0];
      const modData = curriculum.modules.find(m => m.id === dayData.moduleId) || curriculum.modules[0];
      const questionsForDay = questionBank[initialDay] || questionBank[1];

      const initialQuestion: QuestionData = {
        id: `q_1_${initialDay}`,
        question: questionsForDay[0],
        meta: {
          moduleTitle: modData.title,
          dayNumber: initialDay,
          difficulty: chosenDifficulty,
        },
        isFollowUp: false,
      };

      globalSessionStore[sessionId] = {
        sessionId,
        candidate,
        difficulty: chosenDifficulty,
        length,
        questionsAsked: [initialQuestion],
        answers: [],
        daysCovered: [initialDay],
        targetCount,
      };

      const responsePayload: ApiInterviewResponse = {
        done: false,
        sessionId,
        currentQuestion: initialQuestion,
        daysCovered: [initialDay],
      };

      return NextResponse.json(responsePayload);
    }

    // Action: RESPOND or FINISH
    let session = globalSessionStore[sessionId];
    if (!session) {
      // Fallback session state restoration
      session = {
        sessionId,
        candidate,
        difficulty: chosenDifficulty,
        length,
        questionsAsked: [],
        answers: [],
        daysCovered: [1],
        targetCount,
      };
      globalSessionStore[sessionId] = session;
    }

    if (action === 'respond' && answer) {
      const lastQuestion = session.questionsAsked[session.questionsAsked.length - 1];
      if (lastQuestion) {
        const grade = gradeAnswer(lastQuestion.question, answer);
        session.answers.push({
          questionId: lastQuestion.id,
          questionText: lastQuestion.question,
          answerText: answer,
          isFollowUp: lastQuestion.isFollowUp,
          dayNumber: lastQuestion.meta.dayNumber,
          correctness: grade.correctness,
          gradeNotes: grade.gradeNotes,
        });
      }

      const totalAsked = session.questionsAsked.length;

      // Decide if we ask a follow-up (e.g., after initial question if answer is interesting and not already follow-up)
      const latestGrade = session.answers[session.answers.length - 1];
      const shouldFollowUp = !lastQuestion?.isFollowUp && totalAsked < session.targetCount - 1 && (latestGrade?.correctness < 0.3 || Math.random() > 0.4);

      if (shouldFollowUp && lastQuestion) {
        const followUpText = generateProbingFollowUp(lastQuestion, answer);
        const followUpQuestion: QuestionData = {
          id: `q_${totalAsked + 1}_fu_${lastQuestion.meta.dayNumber}`,
          question: followUpText,
          meta: {
            moduleTitle: lastQuestion.meta.moduleTitle,
            dayNumber: lastQuestion.meta.dayNumber,
            difficulty: session.difficulty,
          },
          isFollowUp: true,
        };

        session.questionsAsked.push(followUpQuestion);

        const responsePayload: ApiInterviewResponse = {
          done: false,
          sessionId,
          currentQuestion: followUpQuestion,
          daysCovered: Array.from(new Set(session.daysCovered)),
        };

        return NextResponse.json(responsePayload);
      }

      // Check if interview is finished
      if (totalAsked >= session.targetCount) {
        return generateFinalFeedbackResponse(session);
      }

      // Pick next curriculum day ensuring ≥4 distinct days covered
      const coveredDaysSet = new Set(session.daysCovered);
      // Select from unvisited days in curriculum that candidate completed or skipped
      const candidateDays = candidate.missions.map(m => m.day);
      const unvisitedDays = candidateDays.filter(d => !coveredDaysSet.has(d));
      const nextDay = unvisitedDays.length > 0
        ? unvisitedDays[Math.floor(Math.random() * unvisitedDays.length)]
        : (totalAsked % 31) + 1;

      coveredDaysSet.add(nextDay);
      session.daysCovered = Array.from(coveredDaysSet);

      const dayData = curriculum.days.find(d => d.day === nextDay) || curriculum.days[0];
      const modData = curriculum.modules.find(m => m.id === dayData.moduleId) || curriculum.modules[0];
      const qList = questionBank[nextDay] || questionBank[1];
      const qText = qList[totalAsked % qList.length];

      const nextQuestion: QuestionData = {
        id: `q_${totalAsked + 1}_${nextDay}`,
        question: qText,
        meta: {
          moduleTitle: modData.title,
          dayNumber: nextDay,
          difficulty: session.difficulty,
        },
        isFollowUp: false,
      };

      session.questionsAsked.push(nextQuestion);

      const responsePayload: ApiInterviewResponse = {
        done: false,
        sessionId,
        currentQuestion: nextQuestion,
        daysCovered: Array.from(coveredDaysSet),
      };

      return NextResponse.json(responsePayload);
    }

    if (action === 'finish') {
      return generateFinalFeedbackResponse(session);
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// Generate structured feedback payload matching technical spec
function generateFinalFeedbackResponse(session: ServerSessionState) {
  const { candidate, difficulty, answers, daysCovered } = session;
  const overallScore = Math.round(100 * (answers.reduce((total, answer) => total + answer.correctness, 0) / Math.max(answers.length, 1)));

  // Category breakdown for touched modules
  const touchedModuleTitles = Array.from(
    new Set(
      daysCovered.map(d => {
        const cDay = curriculum.days.find(item => item.day === d);
        const cMod = curriculum.modules.find(m => m.id === cDay?.moduleId);
        return cMod?.title || 'Foundations & Prompt Engineering';
      })
    )
  );

  const categoryBreakdown = touchedModuleTitles.map(modTitle => {
    const asked = answers.filter(answer => (curriculum.modules.find(m => m.id === curriculum.days.find(day => day.day === answer.dayNumber)?.moduleId)?.title || 'Foundations & Prompt Engineering') === modTitle);
    return { moduleTitle: modTitle, score: Math.round(100 * asked.reduce((total, answer) => total + answer.correctness, 0) / Math.max(asked.length, 1)), questionsCount: asked.length };
  });
  const strongAnswers = answers.filter(answer => answer.correctness >= 0.7);
  const weakAnswers = answers.filter(answer => answer.correctness < 0.4);
  const skippedList = candidate.missions.filter(m => m.skipped);

  const feedback: FeedbackReport = {
    overallScore,
    difficultyUsed: difficulty,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    durationMinutes: Math.max(12, Math.round(session.questionsAsked.length * 2.2)),
    candidateName: candidate.member.name,
    candidateRole: candidate.member.role,
    summary: `${candidate.member.name} demonstrated robust conceptual understanding across ${daysCovered.length} curriculum days (${touchedModuleTitles.join(', ')}). Responses showed strong technical depth, particularly in structuring AI system prompts, tool schemas, and agentic workflows. Communication signal remained strong throughout the session.`,
    strengths: [
      `Deep architectural clarity in structured prompting and schema enforcement (Days 2 & 4).`,
      `Solid understanding of multi-tool orchestration and async function dispatching (Days 14–16).`,
      `Clear explanation of vector embeddings and hybrid search re-ranking strategies (Days 5 & 8).`,
      `High communication clarity with structured technical reasoning under probing follow-ups.`
    ],
    gaps: [
      skippedList.length > 0
        ? `Observed knowledge gaps in ${skippedList.map(s => `Day ${s.day} (${s.title})`).join(', ')}.`
        : `Minor room for improvement in fine-tuning memory footprint optimization (LoRA vs QLoRA 4-bit).`,
      `Could provide deeper telemetry details regarding OpenTelemetry span trees and TTFT latency budgeting.`
    ],
    next: [
      { text: `Review Day 29 — Monitoring, Logging & Observability to master OpenTelemetry trace spans in agent loops.`, dayNumber: 29, moduleTitle: 'Monitoring, Logging & Observability' },
      { text: `Practice 4-bit QLoRA double quantization mechanics on Day 11 to optimize local inference memory.`, dayNumber: 11, moduleTitle: 'LLM Fine-Tuning & Quantization' },
      { text: `Implement stateful sidecar RPC handles for Model Context Protocol (MCP) servers on Day 23.`, dayNumber: 23, moduleTitle: 'Advanced Agentic AI & MCP' }
    ],
    categoryBreakdown,
  };
  feedback.summary = overallScore < 40
    ? `${candidate.member.name}'s ${overallScore}% score reflects weak or non-substantive responses, including “${weakAnswers[0]?.answerText || 'no graded answer'}”. The interview did not demonstrate reliable command of the topics assessed.`
    : `${candidate.member.name}'s ${overallScore}% score is grounded in the graded responses across ${daysCovered.length} curriculum days.`;
  feedback.strengths = strongAnswers.map(answer => `Day ${answer.dayNumber}: ${answer.gradeNotes}`);
  feedback.gaps = weakAnswers.map(answer => `Day ${answer.dayNumber}: ${answer.gradeNotes}`);

  const responsePayload: ApiInterviewResponse = {
    done: true,
    sessionId: session.sessionId,
    feedback,
    daysCovered: Array.from(new Set(daysCovered)),
  };

  return NextResponse.json(responsePayload);
}
