import React, { useState } from 'react';
import { curriculumData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Play 
} from 'lucide-react';

export const CurriculumMapScreen = ({ setCurrentView }) => {
  const { selectedCandidate } = useApp();
  const modules = curriculumData.modules || [];
  const days = curriculumData.days || [];

  const [selectedModuleNum, setSelectedModuleNum] = useState(0);
  const [expandedDay, setExpandedDay] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract completed days for selected candidate from candidates.json
  const completedDaysSet = new Set(
    (selectedCandidate?.missions || []).filter(m => m.passed).map(m => m.day)
  );

  const filteredDays = days.filter(d => {
    let inModule = true;
    if (selectedModuleNum > 0) {
      const mod = modules.find(m => m.n === selectedModuleNum);
      if (mod && mod.days) {
        inModule = d.day >= mod.days[0] && d.day <= mod.days[1];
      }
    }
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.tools || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return inModule && matchesSearch;
  });

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'SETUP': return 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30';
      case 'BUILD': return 'bg-[#6C3BFF]/15 text-[#8B5CF6] border-[#8B5CF6]/30';
      case 'SHIP_IT': return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'AI_CORE': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'OPTIMIZE': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'CAPSTONE': return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
              Curriculum Map
            </h1>
            <span className="rounded-full bg-[#6C3BFF]/10 border border-[#8B5CF6]/30 px-3 py-1 font-mono text-xs text-[#8B5CF6] font-bold">
              Code 2026
            </span>
          </div>
          <p className="mt-1 text-xs dark:text-[#94A3B8] light:text-[#64748B]">
            Technical Stack Coverage for <strong>{selectedCandidate?.member?.name || 'Selected Candidate'}</strong>. Progress synced to candidates.json.
          </p>
        </div>

        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search modules, tools..."
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-xs transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-white focus:outline-none focus:border-[#6C3BFF]"
          />
        </div>
      </div>

      {/* Tech Stack Coverage Tags */}
      <div className="rounded-2xl border p-4 space-y-2 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Technical Stack Coverage</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {['FAISS', 'LangChain', 'Redis', 'ChromaDB', 'MCP', 'Docker', 'Kubernetes'].map((tech, idx) => (
            <span key={idx} className="rounded-full bg-[#6C3BFF]/10 border border-[#8B5CF6]/30 px-3 py-1 font-mono text-xs font-semibold text-[#8B5CF6]">
              • {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 31-Day Progression Grid Calendar */}
      <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm dark:text-white light:text-slate-900">31-Day Progression Timeline</h3>
          <div className="flex items-center space-x-3 text-[10px] font-semibold">
            <span className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded-sm bg-[#6C3BFF]" /><span>Passed Mission</span></span>
            <span className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded-sm bg-slate-800" /><span>Pending</span></span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = completedDaysSet.has(dayNum);
            return (
              <div
                key={dayNum}
                onClick={() => setExpandedDay(dayNum)}
                className={`h-14 rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-[#6C3BFF] border-[#8B5CF6] text-white shadow-md'
                    : 'dark:border-slate-800 bg-[#0B1220]/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span>D{dayNum}</span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Selector Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedModuleNum(0)}
          className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
            selectedModuleNum === 0
              ? 'bg-[#6C3BFF] text-white shadow-lg'
              : 'dark:border-slate-800 dark:bg-[#111A2E] dark:text-slate-400 light:border-slate-200 light:bg-white'
          }`}
        >
          All 8 Modules
        </button>

        {modules.map((m) => (
          <button
            key={m.n}
            onClick={() => setSelectedModuleNum(m.n)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              selectedModuleNum === m.n
                ? 'bg-[#6C3BFF] text-white border-[#6C3BFF] shadow-lg'
                : 'dark:border-slate-800 dark:bg-[#111A2E] dark:text-slate-400 light:border-slate-200 light:bg-white'
            }`}
          >
            Mod {m.n}: {m.title}
          </button>
        ))}
      </div>

      {/* Days Explorer Cards */}
      <div className="space-y-4">
        {filteredDays.map((d) => {
          const isExpanded = expandedDay === d.day;
          const isCompleted = completedDaysSet.has(d.day);

          return (
            <div 
              key={d.day}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded
                  ? 'border-[#6C3BFF] dark:bg-[#111A2E] light:bg-white shadow-xl'
                  : 'dark:border-[#1E293B] dark:bg-[#0B1220]/60 light:border-[#E2E8F0] light:bg-slate-50'
              }`}
            >
              <div 
                onClick={() => setExpandedDay(isExpanded ? null : d.day)}
                className="flex items-center justify-between p-5 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-extrabold shadow-md ${
                    isCompleted ? 'bg-[#10B981] text-white' : 'bg-[#6C3BFF] text-white'
                  }`}>
                    D{d.day}
                  </span>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${getTypeBadgeColor(d.type)}`}>
                        {d.type}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-[#10B981] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Candidate Passed</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base dark:text-white light:text-slate-900 mt-0.5">{d.title}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {isExpanded ? <ChevronDown className="h-5 w-5 text-[#8B5CF6]" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="border-t p-6 space-y-4 dark:border-slate-800 bg-[#0B1220]/40 rounded-b-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#8B5CF6]">Tools Required</span>
                    <div className="flex flex-wrap gap-2">
                      {d.tools?.map((t, idx) => (
                        <span key={idx} className="rounded-lg bg-[#0B1220] border border-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#10B981]">Daily Objectives</span>
                    <ul className="space-y-1 text-xs dark:text-slate-300 light:text-slate-700">
                      {d.objectives?.map((obj, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
