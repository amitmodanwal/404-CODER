import React from 'react';
import { candidatesData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Activity, 
  Plus, 
  Play, 
  Radar, 
  CheckCircle2, 
  Sparkles, 
  Brain,
  ChevronRight
} from 'lucide-react';

export const DashboardPage = ({ setCurrentView }) => {
  const { selectedCandidate, selectCandidateById } = useApp();
  const candidates = candidatesData.candidates || [];

  const activeCand = selectedCandidate || candidates[0];

  // Dynamic calculations from candidates.json
  const totalCompleted = activeCand.signals?.missionsCompleted || 28;
  const readinessScore = Math.round((totalCompleted / 31) * 100);
  const avgScoreVal = (7.0 + (totalCompleted / 10)).toFixed(1);

  // Behavioral dynamics state based on candidate experience
  const expYrs = activeCand.member.yearsExperience || 5;
  const confidenceVal = Math.min(95, 75 + (expYrs * 2));
  const techLevelVal = Math.min(92, 70 + (expYrs * 2.2));
  const hesitationVal = Math.max(8, 25 - expYrs);

  return (
    <div className="mx-auto max-w-[1700px] px-6 py-8 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Top Header Bar & Candidate Switcher Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0] gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
              Candidate Overview
            </h1>
            <span className="rounded-full border border-[#8B5CF6]/30 bg-[#6C3BFF]/10 px-3 py-1 font-mono text-xs font-semibold text-[#8B5CF6]">
              Real-time Ingested Data
            </span>
          </div>
          <p className="mt-1 text-xs dark:text-[#94A3B8] light:text-[#64748B]">
            Aggregated technical readiness and performance metrics.
          </p>
        </div>

        {/* Candidate Selector Switcher Dropdown */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-[#0B1220] border border-slate-800 rounded-xl p-2">
            <Users className="h-4 w-4 text-[#8B5CF6]" />
            <select
              value={activeCand.member.id}
              onChange={(e) => selectCandidateById(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer pr-2"
            >
              {candidates.map((c) => (
                <option key={c.member.id} value={c.member.id} className="bg-[#0B1220] text-white">
                  {c.member.name} — {c.member.jobRole} ({c.member.yearsExperience} Yrs)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCurrentView('setup')}
            className="flex items-center space-x-1.5 rounded-xl bg-[#6C3BFF] px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#5b2ee6]"
          >
            <Plus className="h-4 w-4" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Top KPI Grid (Ring Progress, Average Score, Completed Count, Target Difficulty) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Ring Progress Chart - Readiness Score */}
        <div className="rounded-2xl border p-5 space-y-3 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">READINESS SCORE</span>
            <div className="text-2xl font-extrabold text-[#8B5CF6] mt-1">{readinessScore}%</div>
            <div className="text-[11px] text-[#10B981] font-semibold mt-1">📈 +4% vs last cohort</div>
          </div>

          {/* SVG Ring Progress Chart */}
          <div className="relative flex items-center justify-center h-16 w-16">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#6C3BFF]"
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold">{readinessScore}%</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="rounded-2xl border p-5 space-y-2 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md">
          <span className="text-[10px] font-bold uppercase text-slate-400">AVERAGE SCORE</span>
          <div className="text-3xl font-extrabold dark:text-white light:text-slate-900">
            {avgScoreVal} <span className="text-sm text-slate-400">/ 10</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#6C3BFF]" style={{ width: `${avgScoreVal * 10}%` }} />
          </div>
        </div>

        {/* Completed Interviews Count */}
        <div className="rounded-2xl border p-5 space-y-2 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md">
          <span className="text-[10px] font-bold uppercase text-slate-400">COMPLETED INTERVIEWS</span>
          <div className="text-3xl font-extrabold text-[#10B981]">1,204</div>
          <p className="text-[11px] text-slate-400">Active pipeline: 45</p>
        </div>

        {/* Target Difficulty Badge */}
        <div className="rounded-2xl border p-5 space-y-2 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md">
          <span className="text-[10px] font-bold uppercase text-slate-400">TARGET DIFFICULTY</span>
          <div>
            <span className="inline-block rounded-full bg-amber-500/20 text-amber-400 px-3 py-1 text-xs font-bold border border-amber-500/30">
              Senior Staff
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Calibrated for L6 equivalent engineering roles.</p>
        </div>

      </div>

      {/* Behavioral Dynamics & Sentiment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interview Behavioral Dynamics (Progress Bars & Dual Line Graph) */}
        <div className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">INTERVIEW BEHAVIORAL DYNAMICS</h3>
            <span className="text-xs text-slate-400">Confidence, Tech Level, Hesitation</span>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Confidence</span>
                <span className="text-[#8B5CF6]">{confidenceVal}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#8B5CF6]" style={{ width: `${confidenceVal}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Technical Level</span>
                <span className="text-[#06B6D4]">{techLevelVal}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#06B6D4]" style={{ width: `${techLevelVal}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Hesitation Frequency</span>
                <span className="text-amber-400">{hesitationVal}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${hesitationVal}%` }} />
              </div>
            </div>
          </div>

          {/* Dual-Line Graph Tracking Trends Over Turns */}
          <div className="relative flex items-center justify-center h-36 border rounded-xl dark:border-slate-800 bg-[#0B1220]/40 p-2">
            <svg className="w-full h-full" viewBox="0 0 350 100">
              <path d="M 10,70 Q 90,60 180,40 T 340,20" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
              <path d="M 10,85 Q 90,75 180,60 T 340,35" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>

        {/* Response Sentiment & Pace Grid */}
        <div className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300">RESPONSE SENTIMENT & PACE</h3>
            <span className="text-xs text-slate-400">Behavioral Trait Distribution</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 text-center dark:border-slate-800 bg-[#0B1220]/50 space-y-1">
              <div className="text-2xl font-extrabold text-[#10B981]">9.2</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Pacing</div>
            </div>
            <div className="rounded-xl border p-4 text-center dark:border-slate-800 bg-[#0B1220]/50 space-y-1">
              <div className="text-2xl font-extrabold text-[#8B5CF6]">8.5</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Articulation</div>
            </div>
            <div className="rounded-xl border p-4 text-center dark:border-slate-800 bg-[#0B1220]/50 space-y-1">
              <div className="text-2xl font-extrabold text-[#06B6D4]">7.8</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Logic Flow</div>
            </div>
            <div className="rounded-xl border p-4 text-center dark:border-slate-800 bg-[#0B1220]/50 space-y-1">
              <div className="text-2xl font-extrabold text-amber-400">9.0</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Calmness</div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3 dark:border-slate-800">
            <span className="text-xs text-slate-400">Overall Sentiment</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-bold border border-emerald-500/30">
              POSITIVE
            </span>
          </div>
        </div>

      </div>

      {/* Skill Competency Breakdown Radar Chart Card */}
      <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Radar className="h-5 w-5 text-[#8B5CF6]" />
            <h3 className="font-bold text-base dark:text-white light:text-slate-900">Skill Competency Breakdown (5 Core Dimensions)</h3>
          </div>
          <span className="text-xs text-slate-400">Calculated for {activeCand.member.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="relative flex items-center justify-center h-64 border rounded-xl dark:border-slate-800 bg-[#0B1220]/40 p-4">
            <svg className="w-full h-full max-h-56" viewBox="0 0 200 200">
              <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              <polygon points="100,32 165,80 135,152 62,155 35,78" fill="rgba(108, 59, 255, 0.35)" stroke="#8B5CF6" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2 dark:border-slate-800"><span>1. System Architecture</span><strong className="text-[#8B5CF6]">92%</strong></div>
            <div className="flex justify-between border-b pb-2 dark:border-slate-800"><span>2. Vector DBs & RAG</span><strong className="text-[#8B5CF6]">88%</strong></div>
            <div className="flex justify-between border-b pb-2 dark:border-slate-800"><span>3. Architectural Trade-offs</span><strong className="text-[#8B5CF6]">85%</strong></div>
            <div className="flex justify-between border-b pb-2 dark:border-slate-800"><span>4. Agentic AI & MCP</span><strong className="text-[#8B5CF6]">80%</strong></div>
            <div className="flex justify-between"><span>5. Technical Communication</span><strong className="text-[#8B5CF6]">90%</strong></div>
          </div>
        </div>
      </div>

    </div>
  );
};
