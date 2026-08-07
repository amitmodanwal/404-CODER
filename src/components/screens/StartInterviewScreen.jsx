import React, { useState } from 'react';
import { candidatesData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { handleInterviewApi } from '../../api/interviewEngine';
import { 
  UserCheck, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Clock, 
  GraduationCap, 
  Layers, 
  Brain, 
  Sliders, 
  Play 
} from 'lucide-react';

export const StartInterviewScreen = ({ setCurrentView }) => {
  const { selectedCandidate, setSelectedCandidate, setActiveSession } = useApp();
  const candidates = candidatesData.candidates || [];

  const currentCand = selectedCandidate || candidates[0];

  // Calibration settings
  const [primaryFocus, setPrimaryFocus] = useState('System Design');
  const [depthTolerance, setDepthTolerance] = useState('High');
  const [hintThreshold, setHintThreshold] = useState('Strict');
  const [duration, setDuration] = useState('60 Min');
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitialize = async (e) => {
    e.preventDefault();
    setIsInitializing(true);

    try {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      const payload = {
        sessionId,
        candidate: currentCand.member
      };

      const res = await handleInterviewApi(payload);

      const sessionObj = {
        sessionId,
        candidate: currentCand.member,
        fullCandidateData: currentCand,
        question: res.reply.replace(/Welcome.*Let's begin: /, ''),
        currentQuestionIndex: res.currentQuestionIndex || 1,
        totalQuestions: res.totalQuestions || 8,
        confidenceScore: res.confidenceScore || 82,
        primaryFocus,
        depthTolerance,
        hintThreshold,
        duration
      };

      setActiveSession(sessionObj);
      setIsInitializing(false);
      setCurrentView('live_console');
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setIsInitializing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0]">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
            Start Interview Calibration
          </h1>
          <span className="rounded-full bg-[#6C3BFF]/10 border border-[#8B5CF6]/30 px-3 py-1 font-mono text-xs text-[#8B5CF6] font-semibold">
            POST /api/interview Calibration
          </span>
        </div>
        <p className="mt-1 text-xs dark:text-[#94A3B8] light:text-[#64748B]">
          Configure and launch a new technical assessment based on candidate profile data.
        </p>
      </div>

      <form onSubmit={handleInitialize} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Candidate Card & Configuration Options (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Candidate Snapshot Card from candidates.json */}
          <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C3BFF] to-[#06B6D4] text-white font-bold text-xl shadow-md">
                  {currentCand.member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white light:text-slate-900">{currentCand.member.name}</h3>
                  <p className="text-xs text-[#06B6D4] font-semibold">{currentCand.member.jobRole}</p>
                </div>
              </div>

              {/* Candidate Switcher dropdown */}
              <select
                value={currentCand.member.id}
                onChange={(e) => {
                  const found = candidates.find(c => c.member.id === e.target.value);
                  if (found) setSelectedCandidate(found);
                }}
                className="rounded-xl border px-3 py-2 text-xs font-semibold dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.member.id} value={c.member.id}>
                    Switch: {c.member.name} ({c.member.yearsExperience} yrs)
                  </option>
                ))}
              </select>
            </div>

            {/* Candidate Metadata Tags */}
            <div className="grid grid-cols-3 gap-3 text-xs border-b pb-4 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Experience</span>
                <div className="font-bold dark:text-white light:text-slate-900">{currentCand.member.yearsExperience} Years</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Education</span>
                <div className="font-bold dark:text-white light:text-slate-900">{currentCand.member.education}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Status</span>
                <div className="font-bold text-[#10B981]">{currentCand.member.status}</div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Validated Skills Tags</span>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Distributed Systems', 'Vector Search', 'RAG Pipelines', 'Kubernetes'].map((skill, idx) => (
                  <span key={idx} className="rounded-lg bg-[#6C3BFF]/10 border border-[#8B5CF6]/30 px-2.5 py-1 text-[11px] font-mono font-semibold text-[#8B5CF6]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Parameters Box */}
          <div className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
              <Sliders className="h-4 w-4" />
              <span>Assessment Configuration</span>
            </div>

            {/* Primary Focus selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">PRIMARY FOCUS</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['System Design', 'Algorithms', 'Concurrency', 'Database Architecture'].map((f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setPrimaryFocus(f)}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-bold transition-all ${
                      primaryFocus === f
                        ? 'border-[#6C3BFF] bg-[#6C3BFF]/20 text-[#8B5CF6]'
                        : 'dark:border-slate-800 dark:bg-[#0B1220] dark:text-slate-400 light:border-slate-200 light:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth & Hint Threshold */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Depth Tolerance</label>
                <div className="flex space-x-2">
                  {['High', 'Medium'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDepthTolerance(d)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        depthTolerance === d ? 'border-[#6C3BFF] bg-[#6C3BFF]/20 text-[#8B5CF6]' : 'dark:border-slate-800 dark:bg-[#0B1220] text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hint Threshold</label>
                <div className="flex space-x-2">
                  {['Strict', 'Gentle'].map((h) => (
                    <button
                      type="button"
                      key={h}
                      onClick={() => setHintThreshold(h)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        hintThreshold === h ? 'border-[#6C3BFF] bg-[#6C3BFF]/20 text-[#8B5CF6]' : 'dark:border-slate-800 dark:bg-[#0B1220] text-slate-400'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">DURATION</label>
              <div className="flex space-x-3">
                {['45 Min', '60 Min', '90 Min'].map((dur) => (
                  <button
                    type="button"
                    key={dur}
                    onClick={() => setDuration(dur)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      duration === dur ? 'border-[#6C3BFF] bg-[#6C3BFF]/20 text-[#8B5CF6]' : 'dark:border-slate-800 dark:bg-[#0B1220] text-slate-400'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Synapse Engine Calibration Box & Action Button (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="sticky top-24 rounded-2xl border p-6 space-y-6 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-[#8B5CF6]" />
                <h3 className="font-extrabold text-base dark:text-white light:text-slate-900">Synapse Engine</h3>
              </div>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 font-mono text-[10px] font-bold text-amber-400">
                ADVANCED Level 4/5
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Based on candidate's {currentCand.member.yearsExperience} years of experience and target role, calibrating question complexity to Level 4. Expect deep-dive follow-ups on distributed state consistency and latency optimization.
            </p>

            <div className="space-y-3 border-t pt-4 dark:border-slate-800 text-xs">
              <div className="flex justify-between"><span>Depth Tolerance:</span><strong className="text-white">{depthTolerance}</strong></div>
              <div className="flex justify-between"><span>Hint Threshold:</span><strong className="text-white">{hintThreshold}</strong></div>
              <div className="flex justify-between"><span>Duration Limit:</span><strong className="text-[#06B6D4]">{duration}</strong></div>
            </div>

            {/* Initialize Interview Action Button */}
            <button
              type="submit"
              disabled={isInitializing}
              className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-[#6C3BFF] via-[#8B5CF6] to-[#6C3BFF] py-4 text-sm font-bold text-white shadow-xl shadow-[#6C3BFF]/30 hover:shadow-2xl active:scale-98 transition-all disabled:opacity-50"
            >
              {isInitializing ? (
                <span>Initializing Interview Session...</span>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Initialize Interview</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};
