import { curriculumData, candidatesData } from '../data/mockData';

// Session store indexed by sessionId
const sessions = new Map();

/**
 * Question bank mapped to curriculum days
 */
const DAY_QUESTIONS = {
  1: "In Day 1 setup, how did you structure your Python virtual environment and Pylance configurations to prevent import path resolution errors?",
  2: "Regarding Day 2 local models, what performance trade-offs did you observe when running Ollama with Qwen2.5-Coder compared to cloud APIs?",
  3: "For Day 3 React & FastAPI integration, how did you handle CORS policy headers and async request streaming between Vite and Uvicorn?",
  4: "In Day 4 structured data, how do you optimize SQLite indexing and Pandas DataFrame memory usage when querying high-volume claims?",
  5: "During Day 5 unstructured data processing, how do you clean Tesseract OCR artifacts and extract tables from healthcare PDFs cleanly?",
  6: "For Day 6 Knowledge Base creation, what text splitting strategy (chunk size vs overlap) did you select to preserve section context?",
  7: "In Day 7 Embeddings, how do cosine similarity and dot product differ when comparing normalized high-dimensional text vectors?",
  8: "For Day 8 Vector Databases, what architectural factors dictate choosing ChromaDB locally vs Pinecone serverless in production?",
  9: "In Day 9 vector indexing, how do you manage metadata filtering without degrading vector search recall latency?",
  10: "For Day 10 Retrieval Engine, how does your query router decide between structured SQL lookups and semantic vector search?",
  11: "In Day 11 RAG pipelines, how do you design system prompts to strictly prevent LLM hallucinations when retrieved context is sparse?",
  12: "For Day 12 Prompt Engineering, when does Chain-of-Thought (CoT) prompting significantly outperform Zero-Shot prompting?",
  13: "In Day 13 Function Calling, how do you validate Pydantic schemas to ensure type-safe structured JSON outputs from open-weight models?",
  14: "For Day 14 Fine-Tuning concepts, when is parameter-efficient fine-tuning (LoRA) preferred over standard RAG?",
  15: "In Day 15 QLoRA hands-on, what quantization parameters (4-bit vs 8-bit NF4) did you set to minimize VRAM during training?",
  16: "For Day 16 Chatbot Backend, how do you persist session-based conversation state and manage token window limits in FastAPI?",
  18: "In Day 18 SSE Streaming, how do you gracefully handle client connection disconnects during Server-Sent Event LLM token streaming?",
  21: "For Day 21 LangChain Agents, how does a ReAct agent prevent infinite tool execution loops when tool outputs return errors?",
  22: "In Day 22 Multi-Agent Orchestration, how do specialized domain agents resolve state conflicts in a supervisor graph (e.g. LangGraph/CrewAI)?",
  23: "For Day 23 Model Context Protocol (MCP), how does MCP standardize tool discovery and resource prompts compared to custom REST endpoints?",
  28: "In Day 28 Production Deployment, how do you structure non-root Docker builds and Kubernetes HPA for LLM microservices?",
  29: "For Day 29 Observability, what key metrics (TTFT, tokens/sec, embedding latency) do you track in Prometheus & Grafana?"
};

export async function handleInterviewApi(payload) {
  const { sessionId, candidate, message } = payload;

  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  // Session Initialization (Payload 1)
  if (!sessions.has(sessionId) && candidate) {
    const candidateId = candidate.id || "CAND-001";
    const fullCandObj = candidatesData.candidates.find(c => c.member.id === candidateId) || candidatesData.candidates[0];
    
    // Determine Adaptive Difficulty Level
    const yrsExp = fullCandObj.member.yearsExperience || 0;
    let difficultyLevel = 3;
    let difficultyLabel = "Mid / Senior (Level 3-4)";
    if (yrsExp < 2) {
      difficultyLevel = 1;
      difficultyLabel = "Junior (Level 1-2)";
    } else if (yrsExp >= 10) {
      difficultyLevel = 5;
      difficultyLabel = "Principal / Staff (Level 5)";
    }

    // Filter questions strictly from completed missions in candidates.json
    const completedMissions = fullCandObj.missions ? fullCandObj.missions.filter(m => m.passed) : [];
    const completedDays = completedMissions.map(m => m.day);

    const targetDays = completedDays.length >= 4 ? completedDays : [7, 8, 10, 12, 13, 16, 22, 23, 28];
    
    // Select at least 8 questions spanning >= 4 distinct days
    const questionQueue = [];
    const daysUsed = new Set();

    targetDays.forEach(day => {
      if (DAY_QUESTIONS[day]) {
        questionQueue.push({ day, question: DAY_QUESTIONS[day] });
        daysUsed.add(day);
      }
    });

    // Top up to 8 if needed
    let idx = 0;
    const fallbackDays = [7, 8, 10, 12, 13, 15, 22, 23, 28, 29];
    while (questionQueue.length < 8) {
      const fbDay = fallbackDays[idx % fallbackDays.length];
      questionQueue.push({ day: fbDay, question: DAY_QUESTIONS[fbDay] || `Explain your approach to Day ${fbDay} concepts.` });
      daysUsed.add(fbDay);
      idx++;
    }

    const newSession = {
      sessionId,
      candidate: fullCandObj.member,
      fullCandidateData: fullCandObj,
      difficultyLevel,
      difficultyLabel,
      questionQueue,
      currentTurn: 1,
      totalTurns: 8,
      turnsHistory: [],
      confidenceScore: 82,
      done: false
    };

    sessions.set(sessionId, newSession);

    const firstQ = questionQueue[0].question;
    return {
      reply: `Welcome ${fullCandObj.member.name} (${fullCandObj.member.jobRole}). Calibrated difficulty: ${difficultyLabel}. Let's begin: ${firstQ}`,
      done: false,
      currentQuestionIndex: 1,
      totalQuestions: 8,
      confidenceScore: 82
    };
  }

  // Existing Session (Payload 2+ Turns)
  const session = sessions.get(sessionId);
  if (!session) {
    // Auto initialize if session missing
    return handleInterviewApi({
      sessionId,
      candidate: payload.candidate || { id: "CAND-001", name: "Sarah Johnson" }
    });
  }

  // Record candidate turn
  const currentQObj = session.questionQueue[session.currentTurn - 1];
  session.turnsHistory.push({
    turn: session.currentTurn,
    day: currentQObj ? currentQObj.day : 7,
    question: currentQObj ? currentQObj.question : "Technical question",
    answer: message || "",
    score: Math.min(10, Math.max(6, Math.floor(7 + ((message || "").length / 40))))
  });

  // Adjust confidence dynamically
  const msgLen = (message || "").length;
  session.confidenceScore = Math.min(96, Math.max(68, session.confidenceScore + (msgLen > 50 ? 2 : -1)));

  // Advance turn
  session.currentTurn += 1;

  // Final Payload check (End after 8 turns)
  if (session.currentTurn > session.totalTurns) {
    session.done = true;

    const avgScore = Math.round(
      (session.turnsHistory.reduce((acc, t) => acc + t.score, 0) / session.turnsHistory.length) * 9.5
    );

    const feedbackObj = {
      summary: `${session.candidate.name} (${session.candidate.jobRole}) demonstrated high engineering rigor across ${session.totalTurns} curriculum turns. Evaluated strong decision making in RAG retrieval and multi-agent control flows, with minor gap identified in production Kubernetes HPA scaling.`,
      score: Math.min(96, Math.max(74, avgScore)),
      strengths: [
        "State Management Architecture & Isolation",
        "Vector DB Hybrid Retrieval & Reciprocal Rank Fusion",
        "Multi-Agent Control Flow & ReAct Loops",
        "Pydantic Schema Validation for Structured Outputs"
      ],
      gaps: [
        "Accessibility (a11y) WAI-ARIA Standards",
        "Kubernetes HPA Pod Scaling & Container Security",
        "Automated CI/CD Pipeline E2E Benchmarking"
      ],
      next: [
        "Day 25: Chatbot Evaluation & Automated Testing Benchmark",
        "Day 28: Docker & Kubernetes Microservices Deployment",
        "Day 29: Monitoring, Logging & Prometheus Observability"
      ]
    };

    session.feedback = feedbackObj;

    return {
      reply: "Interview completed. Structured diagnostic evaluation generated.",
      done: true,
      feedback: feedbackObj,
      sessionId: session.sessionId
    };
  }

  // Intermediate Turn Response
  const nextQObj = session.questionQueue[session.currentTurn - 1];
  let replyText = nextQObj.question;

  // Follow-up intelligence evaluating answer
  if ((message || "").toLowerCase().includes("vector") || (message || "").toLowerCase().includes("rag")) {
    replyText = `Building on your response regarding RAG and vector search: ${nextQObj.question}`;
  } else if ((message || "").toLowerCase().includes("agent") || (message || "").toLowerCase().includes("mcp")) {
    replyText = `Following up on your experience with agentic control flows: ${nextQObj.question}`;
  }

  return {
    reply: replyText,
    done: false,
    currentQuestionIndex: session.currentTurn,
    totalQuestions: session.totalTurns,
    confidenceScore: session.confidenceScore,
    sessionId: session.sessionId
  };
}

/**
 * Global fetch interceptor for /api/interview
 */
export function setupApiInterceptor() {
  if (typeof window === 'undefined' || window._synapseApiSetup) return;

  const originalFetch = window.fetch;
  window.fetch = async function(resource, config) {
    const url = typeof resource === 'string' ? resource : resource.url;

    if (url && (url.endsWith('/api/interview') || url.includes('/api/interview'))) {
      if (config && config.method === 'POST') {
        const body = JSON.parse(config.body || '{}');
        const resData = await handleInterviewApi(body);
        return new Response(JSON.stringify(resData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return originalFetch.apply(this, arguments);
  };

  window._synapseApiSetup = true;
}

setupApiInterceptor();
