import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Radar, 
  BookOpen, 
  ArrowRight, 
  Download 
} from 'lucide-react';

export const PerformanceAnalyticsScreen = ({ setCurrentView }) => {
  const { selectedCandidate } = useApp();

  const candidate = selectedCandidate?.member || {
    name: "Sarah Jenkins",
    jobRole: "Backend Engineering"
  };

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="rounded-3xl border p-8 bg-gradient-to-br dark:border-[#1E293B] dark:from-[#111A2E] dark:to-[#0B1220] light:border-[#E2E8F0] light:from-white light:to-[#F8FAFC] shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="font-mono text-xs text-[#06B6D4] font-bold">Backend Engineering • Conducted: Oct 24, 2026</span>
          <h1 className="text-3xl font-extrabold dark:text-white light:text-slate-900 mt-1">
            Candidate: {candidate.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive technical assessment report covering System Design, Algorithms, and Core Computer Science concepts.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-[#0B1220]/60 border border-slate-800 rounded-2xl p-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">OVERALL SCORE</span>
            <div className="text-3xl font-extrabold text-[#8B5CF6] font-mono">88 <span className="text-sm text-slate-400">/100</span></div>
          </div>
          <button 
            onClick={() => alert("Downloading PDF Report...")}
            className="flex items-center space-x-1.5 rounded-xl border px-3 py-2 text-xs font-bold dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Demonstrated Strengths vs Areas for Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Demonstrated Strengths */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#10B981] uppercase tracking-wider border-b pb-3 dark:border-slate-800">
            <CheckCircle2 className="h-4 w-4" />
            <span>Demonstrated Strengths</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Distributed Systems Architecture</h4>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Excellent</span>
              </div>
              <p className="text-[11px] text-slate-400">Candidate showed exceptional understanding of microservices, load balancing, and fault tolerance mechanisms.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Algorithmic Optimization</h4>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Strong</span>
              </div>
              <p className="text-[11px] text-slate-400">Consistently optimized solutions for time and space complexity using dynamic programming.</p>
            </div>
          </div>
        </div>

        {/* Areas for Growth */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider border-b pb-3 dark:border-slate-800">
            <AlertTriangle className="h-4 w-4" />
            <span>Areas for Growth</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Database Indexing Strategies</h4>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Needs Review</span>
              </div>
              <p className="text-[11px] text-slate-400">Struggled slightly when explaining B-Tree vs Hash indexes and write amplification in high-throughput scenarios.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Concurrency Control</h4>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Average</span>
              </div>
              <p className="text-[11px] text-slate-400">Understood basic concepts but hesitated when designing thread-safe data structures without heavy locking.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Skill Radar Chart Card */}
      <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider border-b pb-3 dark:border-slate-800">
          <Radar className="h-4 w-4" />
          <span>Skill Competency Breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative flex items-center justify-center h-60 border rounded-xl dark:border-slate-800 bg-[#0B1220]/40 p-4">
            <svg className="w-full h-full max-h-52" viewBox="0 0 200 200">
              <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              <polygon points="100,32 165,80 135,152 62,155 35,78" fill="rgba(108, 59, 255, 0.35)" stroke="#8B5CF6" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1"><span>System Design</span><span className="text-[#8B5CF6]">92%</span></div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-[#8B5CF6] w-[92%]" /></div>
            </div>
            <div>
              <div className="flex justify-between font-bold mb-1"><span>Data Structures & Algorithms</span><span className="text-[#8B5CF6]">88%</span></div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-[#8B5CF6] w-[88%]" /></div>
            </div>
            <div>
              <div className="flex justify-between font-bold mb-1"><span>API Design</span><span className="text-[#8B5CF6]">85%</span></div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-[#8B5CF6] w-[85%]" /></div>
            </div>
            <div>
              <div className="flex justify-between font-bold mb-1"><span>Database Optimization</span><span className="text-amber-400">74%</span></div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-[74%]" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Recommendations Linked to Curriculum Days */}
      <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
        <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Personalized Learning Roadmap (Linked to Curriculum Days)</span>
          </div>
          <button
            onClick={() => setCurrentView('curriculum')}
            className="text-xs font-semibold text-[#8B5CF6] hover:underline flex items-center space-x-1"
          >
            <span>Assign to Candidate</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border dark:border-slate-800 bg-[#0B1220]/60 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white">Deep Dive: Advanced Database Indexing (Day 4 & Day 8)</h4>
              <span className="text-[10px] font-mono text-[#8B5CF6]">Reading: 15 mins</span>
            </div>
            <p className="text-[11px] text-slate-400">Focus on B-Trees, LSM-Trees, and compound indexing strategies for high-write systems.</p>
          </div>

          <div className="p-4 rounded-xl border dark:border-slate-800 bg-[#0B1220]/60 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white">Concurrency in Practice (Day 20 & Day 22)</h4>
              <span className="text-[10px] font-mono text-[#8B5CF6]">Lab: 2 hrs</span>
            </div>
            <p className="text-[11px] text-slate-400">Building lock-free data structures and understanding memory barrier models in multi-agent orchestration.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
