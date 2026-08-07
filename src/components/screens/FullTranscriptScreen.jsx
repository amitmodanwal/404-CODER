import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Award, 
  ArrowLeft 
} from 'lucide-react';

export const FullTranscriptScreen = ({ setCurrentView }) => {
  const { selectedCandidate } = useApp();

  const candidate = selectedCandidate?.member || {
    name: "Sarah Jenkins",
    jobRole: "Senior Frontend Engineer"
  };

  const questions = [
    {
      id: "Q1",
      title: "Question 1: React Performance & Code Splitting",
      context: "Can you walk me through your approach to identifying and resolving performance bottlenecks in a large-scale React application?",
      response: "Typically, I start with the React Profiler to identify components that are rendering too often. If I see a lot of yellow or red in the flame graph, I look into memoization techniques. I use useMemo for expensive calculations and useCallback to prevent unnecessary re-renders. I also heavily rely on code splitting with React.lazy to keep the initial bundle size small.",
      idealReasoning: "The candidate should mention specific tools (Profiler, Lighthouse), concepts (memoization, virtual DOM), and structural approaches (code splitting, state collocation).",
      aiNotes: "Strong theoretical grasp. Correctly identified Profiler, useMemo/useCallback, and React.lazy. Rightly highlighted state collocation as a primary defense against re-renders.",
      score: "9/10"
    },
    {
      id: "Q2",
      title: "Question 2: State Management Architecture",
      context: "How do you decide between using React Context versus a global state management library like Redux or Zustand?",
      response: "I usually prefer Context for simple, low-frequency updates like theme or auth state. It is built-in and easy. If the app has complex, frequently updating state, or if I need fine-grained control over re-renders across many disconnected components, I'll reach for Zustand or Redux. Zustand is my current favorite because it has less boilerplate.",
      idealReasoning: "Candidate must demonstrate understanding of Context's re-render caveats and recognize when a dedicated store is necessary for performance and maintainability.",
      aiNotes: "Excellent answer. Properly distinguished between low-frequency (Context) and high-frequency (Zustand/Redux) updates. Good practical justification.",
      score: "9/10"
    }
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0]">
        <div>
          <button
            onClick={() => setCurrentView('analytics')}
            className="flex items-center space-x-1 text-xs font-semibold text-[#8B5CF6] hover:underline mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>&lt; BACK TO ANALYTICS</span>
          </button>
          
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
            Interview Transcript
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Candidate: <strong className="text-white">{candidate.name}</strong> • Role: {candidate.jobRole} • Date: Oct 24, 2026
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button 
            onClick={() => alert("Exporting Transcript PDF...")}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Question-by-Question Breakdown Timeline */}
      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.id} className="rounded-2xl border p-6 space-y-6 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            
            {/* Question Header & Context */}
            <div className="space-y-2 border-b pb-4 dark:border-slate-800">
              <h3 className="font-extrabold text-base dark:text-white light:text-slate-900">{q.title}</h3>
              <p className="text-xs text-[#8B5CF6] italic font-mono bg-[#6C3BFF]/10 p-3 rounded-xl border border-[#6C3BFF]/20">
                "{q.context}"
              </p>
            </div>

            {/* Candidate Response Transcript */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Candidate Response</span>
              <p className="text-xs font-mono dark:text-slate-200 light:text-slate-800 bg-[#0B1220] p-4 rounded-xl border border-slate-800 leading-relaxed">
                "{q.response}"
              </p>
            </div>

            {/* Side-by-Side: Ideal Reasoning & AI Notes with Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              <div className="rounded-xl bg-[#0B1220]/60 border border-slate-800 p-4 space-y-1">
                <div className="text-[10px] font-bold uppercase text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Ideal Reasoning</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{q.idealReasoning}</p>
              </div>

              <div className="rounded-xl bg-[#0B1220]/60 border border-slate-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase text-[#06B6D4] flex items-center space-x-1">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>AI Notes</span>
                  </div>
                  <span className="rounded-full bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 font-mono text-[10px] font-bold border border-[#10B981]/30">
                    Score: {q.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{q.aiNotes}</p>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
