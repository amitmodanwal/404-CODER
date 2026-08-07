import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Share2, 
  FileText, 
  BookOpen, 
  ArrowRight, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export const PostInterviewReport = ({ setCurrentView }) => {
  const { reportData, selectedCandidate } = useApp();

  const candidate = reportData?.candidate || selectedCandidate?.member || {
    name: "Alex Mercer",
    jobRole: "Senior Frontend Engineer"
  };

  const feedback = reportData?.feedback || {
    summary: "Candidate demonstrated advanced proficiency in system architecture and state management performance optimization. Communication was clear, and problem-solving approach was methodical under pressure.",
    score: 88,
    strengths: [
      "State Management Architecture (Flawlessly designed complex store with normalized state)",
      "Algorithmic Efficiency (Optimized search problem down to O(N log N) using caching)"
    ],
    gaps: [
      "Accessibility (a11y) Standards (Missed WAI-ARIA attributes on custom dropdown components)",
      "CI/CD Pipeline Knowledge (Basic understanding, but struggled to explain automated E2E testing in GitHub Actions)"
    ],
    next: [
      "Day 25: Chatbot Evaluation & Automated Testing Benchmark",
      "Day 27: Security, Privacy & Guardrails",
      "Day 28: Docker & Kubernetes Microservices Deployment"
    ]
  };

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
              Interview Report
            </h1>
            <span className="rounded-full bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 font-mono text-xs text-[#10B981] font-bold">
              Strong Hire Recommendation
            </span>
          </div>
          <p className="mt-1 text-xs dark:text-[#94A3B8] light:text-[#64748B]">
            Candidate: <strong className="text-[#8B5CF6]">{candidate.name}</strong> • Completed Assessment Report
          </p>
        </div>

        {/* Actions: Share, Download PDF, Download Transcript */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => alert("Report link copied!")}
            className="flex items-center space-x-2 rounded-xl border px-3.5 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white hover:border-[#6C3BFF]"
          >
            <Share2 className="h-4 w-4 text-[#8B5CF6]" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setCurrentView('transcript')}
            className="flex items-center space-x-2 rounded-xl border px-3.5 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white hover:border-[#6C3BFF]"
          >
            <FileText className="h-4 w-4 text-[#06B6D4]" />
            <span>Download Transcript</span>
          </button>

          <button
            onClick={() => alert("Generating PDF Report...")}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-lg"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Performance Summary Banner with Score Badge (88 / 100) */}
      <div className="rounded-3xl border p-8 bg-gradient-to-br dark:border-[#1E293B] dark:from-[#111A2E] dark:to-[#0B1220] light:border-[#E2E8F0] light:from-white light:to-[#F8FAFC] shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center h-20 w-20">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-[#6C3BFF]" strokeDasharray="88, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-white">88</span>
                <span className="text-[9px] text-slate-400 block font-mono">/100</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/15 text-emerald-400 px-3 py-0.5 text-xs font-bold border border-emerald-500/20 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Strong Hire Recommendation</span>
              </div>
              <h2 className="text-2xl font-extrabold dark:text-white light:text-slate-900">Exceptional Technical Acumen</h2>
            </div>
          </div>
        </div>

        <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B] border-t pt-4 dark:border-slate-800 leading-relaxed">
          {feedback.summary}
        </p>
      </div>

      {/* Grid: Key Strengths & Identified Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Strengths */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#10B981] uppercase tracking-wider border-b pb-3 dark:border-slate-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Key Strengths</span>
          </div>

          <div className="space-y-3">
            {feedback.strengths.map((str, idx) => (
              <div key={idx} className="flex items-start space-x-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                <Check className="h-4 w-4 text-[#10B981] mt-0.5 shrink-0" />
                <span className="text-xs font-semibold text-emerald-300">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Gaps */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#EF4444] uppercase tracking-wider border-b pb-3 dark:border-slate-800">
            <AlertTriangle className="h-4 w-4" />
            <span>Identified Gaps</span>
          </div>

          <div className="space-y-3">
            {feedback.gaps.map((gap, idx) => (
              <div key={idx} className="flex items-start space-x-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3">
                <AlertTriangle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
                <span className="text-xs font-semibold text-rose-300">{gap}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Personalized Learning Roadmap mapping to curriculum.json */}
      <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Personalized Learning Roadmap (Mapped to curriculum.json)</span>
          </div>
          <button
            onClick={() => setCurrentView('curriculum')}
            className="text-xs font-semibold text-[#8B5CF6] hover:underline flex items-center space-x-1"
          >
            <span>Explore 31-Day Curriculum</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedback.next.map((item, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-2 dark:border-slate-800 bg-[#0B1220]/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8B5CF6] uppercase">Roadmap Step {idx + 1}</span>
                <span className="rounded-full bg-[#6C3BFF]/20 text-[#8B5CF6] px-2 py-0.5 text-[10px] font-semibold">Priority</span>
              </div>
              <p className="text-xs font-semibold dark:text-white light:text-slate-900">{item}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
