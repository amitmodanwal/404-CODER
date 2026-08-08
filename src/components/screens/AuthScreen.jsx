import React, { useState } from 'react';
import { candidatesData } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  UserCheck, 
  Cpu 
} from 'lucide-react';

export const AuthScreen = ({ setCurrentView }) => {
  const candidates = candidatesData.candidates || [];
  const { selectCandidateById, setUser } = useApp();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('alex.mercer@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedFastId, setSelectedFastId] = useState('CAND-001');

  const handleFastCandidateLogin = (c) => {
    selectCandidateById(c.member.id);
    setUser({
      name: c.member.name,
      role: c.member.jobRole,
      email: `${c.member.name.toLowerCase().replace(' ', '.')}@synapse.ai`
    });
    setCurrentView('dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      name: 'Alex Mercer',
      role: 'Technical Recruiter',
      email: email
    });
    setCurrentView('dashboard');
  };

  return (
    <div className="mx-auto max-w-[1500px] px-6 py-10 lg:px-12 animate-fadeIn">
      
      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl border dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-2xl overflow-hidden min-h-[620px]">
        
        {/* Left Panel: Platform Value Proposition & Fast Candidate Login */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#6C3BFF]/20 via-[#0B1220] to-[#111A2E] p-8 lg:p-12 space-y-8 flex flex-col justify-between border-r dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#8B5CF6] font-bold text-xs">
              <Cpu className="h-5 w-5" />
              <span>SYNAPSE_AI ENGINE RECRUITER PORTAL</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Elevate Technical Hiring.<br />
              <span className="text-[#06B6D4]">Fast Candidate Quick-Tester.</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              Log in directly as any of the 20 real candidates from candidates.json to test RAG, multi-agent, and adaptive interview sessions.
            </p>
          </div>

          {/* Candidate Profile Fast-Login Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center space-x-1.5 text-[#8B5CF6]">
                <UserCheck className="h-4 w-4" />
                <span>Test As Candidate (20 Profiles)</span>
              </span>
              <span className="text-[10px] text-slate-400">Instant One-Click Login</span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {candidates.slice(0, 6).map((c) => (
                <div
                  key={c.member.id}
                  onClick={() => handleFastCandidateLogin(c)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-[#0B1220]/70 hover:border-[#6C3BFF] cursor-pointer transition-all"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{c.member.name}</div>
                    <div className="text-[10px] text-slate-400">{c.member.jobRole} ({c.member.yearsExperience} Yrs)</div>
                  </div>
                  <span className="text-[10px] font-bold text-[#10B981] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Login &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-4">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>SOC2 Type II</span>
            </span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>

        {/* Right Panel: Traditional Sign-In / Sign-Up Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 space-y-8 flex flex-col justify-center">
          
          <div className="space-y-2">
            <div className="flex justify-center space-x-2 bg-slate-800/40 p-1 rounded-xl w-48 mb-4">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login' ? 'bg-[#6C3BFF] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup' ? 'bg-[#6C3BFF] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                Sign Up
              </button>
            </div>

            <h3 className="text-2xl font-extrabold dark:text-white light:text-slate-900">
              {authMode === 'login' ? 'Welcome Back Recruiter' : 'Create Recruiter Account'}
            </h3>
            <p className="text-xs text-slate-400">
              Enter your corporate credentials to access candidate evaluations and reports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Work Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none focus:border-[#6C3BFF]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none focus:border-[#6C3BFF]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] py-3 text-xs font-bold text-white shadow-lg shadow-[#6C3BFF]/25 hover:shadow-xl transition-all"
            >
              <span>{authMode === 'login' ? 'Sign In to Console' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
