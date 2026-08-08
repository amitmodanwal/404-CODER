'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Landing } from '@/components/screens/Landing';
import { ResumeUpload } from '@/components/screens/ResumeUpload';
import { ProfileConfirmation } from '@/components/screens/ProfileConfirmation';
import { InterviewSetup } from '@/components/screens/InterviewSetup';
import { InterviewLobby } from '@/components/screens/InterviewLobby';
import { LiveInterview } from '@/components/screens/LiveInterview';
import { InterviewComplete } from '@/components/screens/InterviewComplete';
import { ReportView } from '@/components/screens/ReportView';
import { TranscriptView } from '@/components/screens/TranscriptView';
import { StepId } from '@/components/ui/Stepper';
import { Candidate, DifficultyLevel, QuestionData, InterviewTurn, FeedbackReport, ApiInterviewResponse } from '@/types/interview';
import candidatesDataRaw from '@/data/candidates.json';

const candidates = candidatesDataRaw.candidates as Candidate[];

export type AppScreen =
  | 'landing'
  | 'resume_upload'
  | 'profile_confirm'
  | 'setup'
  | 'lobby'
  | 'live_interview'
  | 'complete_transition'
  | 'report'
  | 'transcript';

export default function Home() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(candidates[0]);

  // Session state
  const [sessionId, setSessionId] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Advanced');
  const [length, setLength] = useState<'standard' | 'extended'>('standard');
  const [targetCount, setTargetCount] = useState<number>(8);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [turnsHistory, setTurnsHistory] = useState<InterviewTurn[]>([]);
  const [daysCovered, setDaysCovered] = useState<number[]>([1]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [feedbackReport, setFeedbackReport] = useState<FeedbackReport | null>(null);

  // Map app screen to Stepper step ID for navbar
  const getStepperStep = (): StepId => {
    switch (screen) {
      case 'setup':
      case 'profile_confirm':
      case 'resume_upload':
        return 'setup';
      case 'lobby':
        return 'lobby';
      case 'live_interview':
      case 'complete_transition':
        return 'interview';
      case 'report':
      case 'transcript':
        return 'report';
      default:
        return 'setup';
    }
  };

  const showStepper = ['setup', 'lobby', 'live_interview', 'complete_transition', 'report', 'transcript'].includes(screen);

  // Reset to picker
  const handleResetSession = () => {
    setSessionId('');
    setTurnsHistory([]);
    setDaysCovered([1]);
    setCurrentQuestion(null);
    setFeedbackReport(null);
    setScreen('resume_upload');
  };

  // 1. Candidate Selection
  const handleCandidateSelected = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setScreen('profile_confirm');
  };

  // 2. Setup -> Lobby -> API start call
  const handleBeginSetup = async (config: {
    difficulty: DifficultyLevel;
    length: 'standard' | 'extended';
    focusModules: number[];
  }) => {
    setIsThinking(true);
    setDifficulty(config.difficulty);
    setLength(config.length);
    const newSessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSessionId);
    const targetQCount = config.length === 'extended' ? 12 : 8;
    setTargetCount(targetQCount);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          sessionId: newSessionId,
          candidateId: selectedCandidate.id,
          difficulty: config.difficulty,
          length: config.length,
          focusModules: config.focusModules,
        }),
      });

      const data: ApiInterviewResponse = await res.json();
      if (data.currentQuestion) {
        setCurrentQuestion(data.currentQuestion);
        setDaysCovered(data.daysCovered || [1]);
      }
      setIsThinking(false);
      setScreen('lobby');
    } catch (err: unknown) {
      setIsThinking(false);
      setNetworkError('Failed to initialize session. Re-trying...');
      setScreen('lobby');
    }
  };

  // 3. Submit Answer turn -> call /api/interview respond
  const handleSubmitAnswer = async (answerText: string) => {
    if (!currentQuestion) return;

    setIsThinking(true);
    setNetworkError(null);

    const nowTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newTurn: InterviewTurn = {
      id: `turn_${turnsHistory.length + 1}`,
      question: currentQuestion,
      candidateAnswer: answerText,
      timestamp: nowTimestamp,
    };

    const updatedHistory = [...turnsHistory, newTurn];
    setTurnsHistory(updatedHistory);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          sessionId,
          candidateId: selectedCandidate.id,
          answer: answerText,
          difficulty,
          length,
        }),
      });

      const data: ApiInterviewResponse = await res.json();
      setIsThinking(false);

      if (data.done && data.feedback) {
        setFeedbackReport(data.feedback);
        setScreen('complete_transition');
      } else if (data.currentQuestion) {
        setCurrentQuestion(data.currentQuestion);
        if (data.daysCovered) setDaysCovered(data.daysCovered);
      }
    } catch (err: unknown) {
      setIsThinking(false);
      setNetworkError(err instanceof Error ? err.message : 'Network error');
    }
  };

  // 4. End Interview Early
  const handleEndEarly = async () => {
    setIsThinking(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'finish',
          sessionId,
          candidateId: selectedCandidate.id,
          difficulty,
        }),
      });
      const data: ApiInterviewResponse = await res.json();
      setIsThinking(false);
      if (data.feedback) {
        setFeedbackReport(data.feedback);
      }
      setScreen('complete_transition');
    } catch (err: unknown) {
      setIsThinking(false);
      setScreen('complete_transition');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        currentStep={getStepperStep()}
        showStepper={showStepper}
        onStartClick={() => setScreen('resume_upload')}
      />

      <main style={{ flex: 1 }}>
        {screen === 'landing' && (
          <Landing onStartInterview={() => setScreen('resume_upload')} />
        )}

        {screen === 'resume_upload' && (
          <ResumeUpload onSelectCandidate={handleCandidateSelected} />
        )}

        {screen === 'profile_confirm' && (
          <ProfileConfirmation
            candidate={selectedCandidate}
            onConfirm={() => setScreen('setup')}
            onChooseDifferent={() => setScreen('resume_upload')}
          />
        )}

        {screen === 'setup' && (
          <InterviewSetup
            candidate={selectedCandidate}
            onBeginInterview={handleBeginSetup}
            isLoading={isThinking}
          />
        )}

        {screen === 'lobby' && (
          <InterviewLobby
            candidate={selectedCandidate}
            difficulty={difficulty}
            questionCount={targetCount}
            onEnterInterview={() => setScreen('live_interview')}
          />
        )}

        {screen === 'live_interview' && currentQuestion && (
          <LiveInterview
            sessionId={sessionId}
            candidate={selectedCandidate}
            difficulty={difficulty}
            targetCount={targetCount}
            currentQuestion={currentQuestion}
            turnsHistory={turnsHistory}
            daysCovered={daysCovered}
            isThinking={isThinking}
            onSubmitAnswer={handleSubmitAnswer}
            onEndEarly={handleEndEarly}
            networkError={networkError}
            onRetryNetwork={() => setNetworkError(null)}
          />
        )}

        {screen === 'complete_transition' && (
          <InterviewComplete onEvaluationFinished={() => setScreen('report')} />
        )}

        {screen === 'report' && feedbackReport && (
          <ReportView
            report={feedbackReport}
            candidate={selectedCandidate}
            onViewTranscript={() => setScreen('transcript')}
            onNewInterview={handleResetSession}
          />
        )}

        {screen === 'transcript' && (
          <TranscriptView
            turns={turnsHistory}
            candidate={selectedCandidate}
            onBackToReport={() => setScreen('report')}
          />
        )}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '40px',
        }}
      >
        Synapse_AI — Interview Agent (v1.0) · Built with Next.js &amp; Pure CSS Tokens
      </footer>
    </div>
  );
}
