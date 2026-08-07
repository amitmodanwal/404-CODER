import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Target, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Layers, 
  TrendingUp 
} from 'lucide-react';

export const LandingPage = ({ setCurrentView }) => {
  const steps = [
    {
      step: "01",
      title: "Select Candidate Profile",
      desc: "Pick from 20 detailed candidate profiles in candidates.json to parse completed missions & gap areas."
    },
    {
      step: "02",
      title: "Calibrate AI Engine",
      desc: "Configure target difficulty (Levels 1-5), primary architectural focus, and AI interviewer persona tone."
    },
    {
      step: "03",
      title: "Live Multi-Turn Interview",
      desc: "8+ dynamic questions covering ≥ 4 curriculum days with real-time confidence tracking & context memory."
    },
    {
      step: "04",
      title: "Structured Feedback Report",
      desc: "Instant score output, strengths, root cause gaps, and personalized 31-day curriculum upskilling roadmap."
    }
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 lg:px-12 space-y-20 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#6C3BFF]/40 bg-[#6C3BFF]/10 px-4 py-1.5 text-xs font-semibold text-[#8B5CF6]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The AI Interview Intelligence Engine</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl dark:text-white light:text-slate-900 leading-tight">
          Elevate Technical Hiring.<br />
          <span className="bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">
            Engineering Thinking Over Memorization.
          </span>
        </h1>

        <p className="text-base lg:text-lg dark:text-[#94A3B8] light:text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Evaluating true technical depth, system architecture trade-offs, and multi-agent control flows across a 31-day AI engineering cohort. Zero LeetCode puzzles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentView('setup')}
            className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#6C3BFF] bg-[length:200%_auto] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-[#6C3BFF]/30 hover:shadow-2xl hover:shadow-[#6C3BFF]/40 transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start AI Interview</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => setCurrentView('curriculum')}
            className="rounded-2xl border border-slate-700 dark:bg-[#111A2E] light:bg-white px-7 py-4 text-sm font-semibold dark:text-slate-200 light:text-slate-700 hover:border-[#6C3BFF] transition-all"
          >
            Explore 31-Day Curriculum
          </button>
        </div>

      </div>

      {/* Core Values & Feature Highlight Cards */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold dark:text-white light:text-slate-900">Why Memorization Fails</h2>
          <p className="text-xs text-slate-400">Traditional algorithmic tests measure memorization rather than real production engineering intuition.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Why Memorization Fails */}
          <div className="rounded-3xl border p-8 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl hover:border-[#6C3BFF]/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-[#EF4444]">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white light:text-slate-900">Why Memorization Fails</h3>
            <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B] leading-relaxed">
              Binary pass/fail algorithm puzzles reward memorized tricks while completely ignoring distributed system trade-offs, vector DB recall tuning, and error recovery.
            </p>
          </div>

          {/* Card 2: The 31-Day AI Cohort */}
          <div className="rounded-3xl border p-8 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl hover:border-[#6C3BFF]/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C3BFF]/15 text-[#8B5CF6]">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white light:text-slate-900">The 31-Day AI Cohort</h3>
            <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B] leading-relaxed">
              Curriculum-aligned evaluation across 8 modules covering embeddings, RAG pipelines, QLoRA fine-tuning, LangChain agents, Model Context Protocol (MCP), and Kubernetes.
            </p>
          </div>

          {/* Card 3: Adaptive AI Engine */}
          <div className="rounded-3xl border p-8 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl hover:border-[#6C3BFF]/50 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981]/15 text-[#10B981]">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white light:text-slate-900">Adaptive AI Engine</h3>
            <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B] leading-relaxed">
              Multi-turn state machine evaluating responses in real time, adapting question complexity dynamically based on candidate background and previous turn answers.
            </p>
          </div>

        </div>
      </div>

      {/* How It Works Interactive Timeline */}
      <div className="space-y-8 border-t pt-12 dark:border-slate-800">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold dark:text-white light:text-slate-900">How Synapse_AI Works</h2>
          <p className="text-xs text-slate-400">4-step visual pipeline from candidate selection to diagnostic feedback report.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="rounded-2xl border p-6 space-y-3 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
              <span className="font-mono text-2xl font-extrabold text-[#8B5CF6]">{s.step}</span>
              <h4 className="font-bold text-sm dark:text-white light:text-slate-900">{s.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Latency Banner */}
      <div className="rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-4 dark:border-slate-800 dark:bg-[#0B1220] light:border-slate-300 light:bg-slate-100">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-6 w-6 text-[#10B981]" />
          <div>
            <div className="font-bold text-xs dark:text-white light:text-slate-900">Enterprise Security & Compliance</div>
            <div className="text-[11px] text-slate-400">SOC2 Type II Certified • GDPR Compliant • Zero Data Leakage</div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('setup')}
          className="rounded-xl bg-[#6C3BFF] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#5b2ee6]"
        >
          Launch Candidate Assessment &rarr;
        </button>
      </div>

    </div>
  );
};
