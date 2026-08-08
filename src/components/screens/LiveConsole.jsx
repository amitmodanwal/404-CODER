import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { handleInterviewApi } from '../../api/interviewEngine';
import { 
  BrainCircuit, 
  Send, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Terminal, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Award,
  Radar
} from 'lucide-react';

export const LiveConsole = ({ setCurrentView }) => {
  const { selectedCandidate, activeSession, setActiveSession, setReportData } = useApp();

  const candidate = activeSession?.candidate || selectedCandidate?.member || {
    id: "CAND-001",
    name: "Sarah Johnson",
    jobRole: "Senior Data Engineer",
    yearsExperience: 9
  };

  const [sessionId] = useState(activeSession?.sessionId || `sess_${Date.now()}`);
  const [currentTurn, setCurrentTurn] = useState(activeSession?.currentQuestionIndex || 1);
  const [totalTurns] = useState(8);
  const [confidenceScore, setConfidenceScore] = useState(activeSession?.confidenceScore || 82);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(185);

  const [chatTimeline, setChatTimeline] = useState([
    {
      sender: 'AI Examiner',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: activeSession?.question || 'Welcome Sarah. In your vector embeddings pipeline, how do you handle high-dimensional vector similarity search latency under high query volume?',
      type: 'ai'
    }
  ]);

  const timelineEndRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totSec) => {
    const m = Math.floor(totSec / 60);
    const s = totSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmitResponse = async (e) => {
    if (e) e.preventDefault();
    if (!candidateResponse.trim() || isSubmitting) return;

    const userText = candidateResponse;
    setCandidateResponse('');
    setIsSubmitting(true);

    // Append Candidate response to timeline
    const userMsg = {
      sender: candidate.name || 'Candidate',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
      type: 'user'
    };

    setChatTimeline(prev => [...prev, userMsg]);

    try {
      const payload = {
        sessionId,
        message: userText
      };

      const res = await handleInterviewApi(payload);

      if (res.done) {
        // Interview Completed! Final Payload received
        const reportObj = {
          id: sessionId,
          candidate,
          feedback: res.feedback,
          score: res.feedback?.score || 88,
          date: new Date().toISOString()
        };

        setReportData(reportObj);
        setTimeout(() => {
          setCurrentView('analytics'); // Feedback report view
        }, 800);
      } else {
        // Intermediate Turn
        setCurrentTurn(res.currentQuestionIndex || (currentTurn + 1));
        setConfidenceScore(res.confidenceScore || confidenceScore);

        setChatTimeline(prev => [
          ...prev,
          {
            sender: 'AI Examiner',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: res.reply,
            type: 'ai'
          }
        ]);
      }
    } catch (err) {
      console.error('Turn submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-6 lg:px-8 space-y-6 animate-fadeIn">
      
      {/* Top Console Bar */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C3BFF] to-[#8B5CF6]">
            <Cpu className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold dark:text-white light:text-slate-900">Live AI Interview Console</h1>
            <p className="text-xs text-slate-400">Evaluating: <strong className="text-[#8B5CF6]">{candidate.name}</strong> ({candidate.jobRole})</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-full border border-slate-700 bg-[#0B1220] px-3 py-1 font-mono text-xs text-slate-300">
            <Clock className="h-3.5 w-3.5 text-[#06B6D4]" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
          >
            End Session
          </button>
        </div>
      </div>

      {/* 3-COLUMN DESKTOP LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (25% - 3 cols): Candidate Summary, Target Focus, Live Timer, Status Indicator */}
        <div className="lg:col-span-3 space-y-5">
          
          <div className="rounded-2xl border p-5 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-3 border-b pb-3 dark:border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C3BFF]/20 text-[#8B5CF6] font-bold text-sm">
                {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('') : 'CN'}
              </div>
              <div>
                <h3 className="font-bold text-sm dark:text-white light:text-slate-900">{candidate.name}</h3>
                <p className="text-[11px] text-slate-400">{candidate.jobRole}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span>Turn Counter:</span><strong className="text-[#8B5CF6]">{currentTurn} of {totalTurns}</strong></div>
              <div className="flex justify-between"><span>Status:</span><span className="text-[#10B981] font-bold flex items-center space-x-1"><span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" /><span>Active Turn</span></span></div>
              <div className="flex justify-between"><span>Focus Area:</span><strong className="text-slate-300">System Architecture</strong></div>
            </div>
          </div>

          <div className="rounded-2xl border p-4 space-y-2 text-center dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Question Progress</span>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-[#6C3BFF] to-[#06B6D4]" style={{ width: `${(currentTurn / totalTurns) * 100}%` }} />
            </div>
          </div>

        </div>

        {/* CENTER COLUMN (50% - 6 cols): Chat Transcript Timeline, Input Area & Submit Response */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="rounded-2xl border p-5 space-y-4 h-[380px] overflow-y-auto dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            {chatTimeline.map((msg, idx) => (
              <div key={idx} className={`flex flex-col space-y-1.5 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className="font-bold text-[#8B5CF6]">{msg.sender}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[90%] shadow-md ${
                  msg.type === 'user'
                    ? 'bg-[#6C3BFF] text-white font-mono rounded-tr-none'
                    : 'bg-[#0B1220] border border-slate-800 dark:text-slate-200 light:text-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={timelineEndRef} />
          </div>

          {/* Response Form */}
          <form onSubmit={handleSubmitResponse} className="rounded-2xl border p-4 space-y-3 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b pb-2 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-[#8B5CF6]" />
                <span>Candidate Technical Response</span>
              </div>
              <span className="font-mono text-[10px] text-[#06B6D4]">TypeScript / Code / Explanation</span>
            </div>

            <textarea
              rows={4}
              value={candidateResponse}
              onChange={(e) => setCandidateResponse(e.target.value)}
              placeholder="Type your technical explanation, architectural trade-offs, or pseudocode..."
              className="w-full rounded-xl border p-3 font-mono text-xs transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-slate-200 light:border-slate-300 light:bg-slate-50 focus:border-[#6C3BFF] focus:outline-none"
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !candidateResponse.trim()}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#6C3BFF]/25 hover:shadow-xl active:scale-95 transition-all disabled:opacity-40"
              >
                <span>Submit Response</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN (25% - 3 cols): AI Reasoning Panel, Topic Signals, Live Confidence Score Gauge */}
        <div className="lg:col-span-3 space-y-5">
          
          <div className="rounded-2xl border p-5 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#06B6D4] uppercase tracking-wider border-b pb-2 dark:border-slate-800">
              <BrainCircuit className="h-4 w-4" />
              <span>AI Reasoning Panel</span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Context Evaluation</span>
              <p className="text-[11px] text-slate-300 bg-[#0B1220]/60 p-2.5 rounded-xl border border-slate-800">
                Evaluating answer against curriculum.json Day 7 (Embeddings) & Day 10 (Retrieval Router).
              </p>
            </div>

            {/* Live Confidence Score Gauge */}
            <div className="space-y-2 border-t pt-3 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Confidence Score Gauge</span>
              <div className="text-3xl font-extrabold text-[#10B981] font-mono">{confidenceScore}%</div>
              <span className="text-[10px] text-[#10B981] font-semibold">High Signal Precision</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
