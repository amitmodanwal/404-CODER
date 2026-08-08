import React from 'react';
import { candidatesData } from '../../data/mockData';
import { 
  BrainCircuit, 
  Target, 
  Award, 
  Sparkles, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AboutUs = ({ setCurrentView }) => {
  const candidates = candidatesData.candidates || [];
  const totalCandidates = candidates.length;
  
  const avgExp = (
    candidates.reduce((sum, c) => sum + (c.member.yearsExperience || 0), 0) / totalCandidates
  ).toFixed(1);

  const totalMissionsCompleted = candidates.reduce(
    (sum, c) => sum + (c.signals?.missionsCompleted || 0), 0
  );

  const principles = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-[#8B5CF6]" />,
      title: "Rigor in Practice",
      desc: "Evaluating candidates on real-world multi-agent architectures, RAG optimization, vector search recall, and containerized deployment rather than artificial algorithmic puzzles."
    },
    {
      icon: <Target className="h-6 w-6 text-[#10B981]" />,
      title: "Deep Evaluation",
      desc: "Multi-turn dynamic questioning that probes architectural trade-offs, edge cases, system design choices, and clear technical communication."
    },
    {
      icon: <Award className="h-6 w-6 text-[#F59E0B]" />,
      title: "Data-Driven Guidance",
      desc: "Mapping identified candidate gaps directly to exact modules and days within our 31-day AI engineering cohort curriculum for instant upskilling."
    }
  ];

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-12 space-y-16 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#6C3BFF]/30 bg-[#6C3BFF]/10 px-4 py-1.5 text-xs font-semibold text-[#8B5CF6]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Product Vision & Philosophy</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-white light:text-slate-900 leading-tight">
          Evaluating <span className="bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#06B6D4] bg-clip-text text-transparent">True Engineering Depth</span> Over Rote Memorization
        </h1>

        <p className="text-base lg:text-lg dark:text-[#94A3B8] light:text-[#64748B] leading-relaxed">
          Synapse_AI was engineered to eliminate the flaws in traditional technical hiring. We reject arbitrary LeetCode puzzle tricks in favor of deep, architectural reasoning, trade-off analysis, and real-world system design capability across a 31-day AI cohort.
        </p>
      </div>

      {/* Cohort Real Data Banner */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 rounded-2xl border p-6 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
        <div className="space-y-1 text-center border-r dark:border-slate-800 light:border-slate-200 last:border-none">
          <div className="text-3xl font-extrabold text-[#8B5CF6]">{totalCandidates}</div>
          <div className="text-xs font-semibold text-slate-400">Tracked Candidates</div>
        </div>
        <div className="space-y-1 text-center border-r dark:border-slate-800 light:border-slate-200 last:border-none">
          <div className="text-3xl font-extrabold text-[#10B981]">{avgExp} Yrs</div>
          <div className="text-xs font-semibold text-slate-400">Avg Experience</div>
        </div>
        <div className="space-y-1 text-center border-r dark:border-slate-800 light:border-slate-200 last:border-none">
          <div className="text-3xl font-extrabold text-[#06B6D4]">{totalMissionsCompleted}</div>
          <div className="text-xs font-semibold text-slate-400">Missions Validated</div>
        </div>
        <div className="space-y-1 text-center">
          <div className="text-3xl font-extrabold text-[#F59E0B]">31 Days</div>
          <div className="text-xs font-semibold text-slate-400">Cohort Curriculum</div>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {principles.map((p, idx) => (
          <div key={idx} className="rounded-2xl border p-6 space-y-3 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C3BFF]/10">
              {p.icon}
            </div>
            <h3 className="text-lg font-bold dark:text-white light:text-slate-900">{p.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
