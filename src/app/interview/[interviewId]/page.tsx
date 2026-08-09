'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiveInterview } from '@/components/screens/LiveInterview';
import { Candidate, QuestionData, InterviewTurn, DifficultyLevel } from '@/types/interview';

export default function LiveInterviewPage({ params }: { params: { interviewId: string } }) {
  const router = useRouter();
  const { interviewId } = params;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Advanced');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [turnsHistory, setTurnsHistory] = useState<InterviewTurn[]>([]);
  const [daysCovered, setDaysCovered] = useState<number[]>([1]);
  const [isThinking, setIsThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    async function initInterview() {
      try {
        const [meRes, repRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch(`/api/interviews/${interviewId}/report`),
        ]);

        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        const meData = await meRes.json();
        setCandidate(meData.candidate);

        if (repRes.ok) {
          const repData = await repRes.json();
          setDifficulty(repData.interview.difficulty as DifficultyLevel);
          setTurnsHistory(repData.turnsHistory || []);

          if (repData.turnsHistory.length > 0) {
            const lastTurn = repData.turnsHistory[repData.turnsHistory.length - 1];
            setCurrentQuestion(lastTurn.question);
          } else {
            // Fetch starting question from API start if new
            const startRes = await fetch('/api/interview/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ difficulty: 'Advanced' }),
            });
            const startData = await startRes.json();
            setCurrentQuestion(startData.currentQuestion);
            setDaysCovered(startData.daysCovered || [1]);
          }
        }
      } catch (err) {
        setNetworkError('Failed to sync interview session');
      } finally {
        setLoading(false);
      }
    }
    initInterview();
  }, [interviewId, router]);

  const handleSubmitAnswer = async (answerText: string) => {
    if (!currentQuestion) return;
    setIsThinking(true);
    setNetworkError(null);

    const nowTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localTurn: InterviewTurn = {
      id: `turn_${turnsHistory.length + 1}`,
      question: currentQuestion,
      candidateAnswer: answerText,
      timestamp: nowTimestamp,
    };

    setTurnsHistory((prev) => [...prev, localTurn]);

    try {
      const res = await fetch(`/api/interview/${interviewId}/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: answerText, action: 'respond' }),
      });

      const data = await res.json();
      setIsThinking(false);

      if (data.done) {
        router.push(`/report/${interviewId}`);
      } else if (data.currentQuestion) {
        setCurrentQuestion(data.currentQuestion);
        if (data.daysCovered) setDaysCovered(data.daysCovered);
      }
    } catch (err) {
      setIsThinking(false);
      setNetworkError('Network error submitting turn');
    }
  };

  const handleEndEarly = async () => {
    setIsThinking(true);
    try {
      const res = await fetch(`/api/interview/${interviewId}/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish' }),
      });
      setIsThinking(false);
      router.push(`/report/${interviewId}`);
    } catch (err) {
      setIsThinking(false);
      router.push(`/report/${interviewId}`);
    }
  };

  if (loading || !candidate || !currentQuestion) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading live interview session...
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '20px' }}>
      <LiveInterview
        sessionId={interviewId}
        candidate={candidate}
        difficulty={difficulty}
        targetCount={8}
        currentQuestion={currentQuestion}
        turnsHistory={turnsHistory}
        daysCovered={daysCovered}
        isThinking={isThinking}
        onSubmitAnswer={handleSubmitAnswer}
        onEndEarly={handleEndEarly}
        networkError={networkError}
        onRetryNetwork={() => setNetworkError(null)}
      />
    </div>
  );
}
