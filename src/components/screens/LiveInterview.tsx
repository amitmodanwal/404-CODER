'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownRight, AlertCircle, RefreshCw, X, ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChatBubble } from '../ui/ChatBubble';
import { LiveIndicatorBar } from '../ui/LiveIndicatorBar';
import { QuestionMeta } from '../ui/QuestionMeta';
import { Toast } from '../ui/Toast';
import { Candidate, QuestionData, InterviewTurn, DifficultyLevel } from '@/types/interview';

export interface LiveInterviewProps {
  sessionId: string;
  candidate: Candidate;
  difficulty: DifficultyLevel;
  targetCount: number;
  currentQuestion: QuestionData;
  turnsHistory: InterviewTurn[];
  daysCovered: number[];
  isThinking: boolean;
  onSubmitAnswer: (answerText: string) => void;
  onEndEarly: () => void;
  onRetryNetwork?: () => void;
  networkError?: string | null;
}

export const LiveInterview: React.FC<LiveInterviewProps> = ({
  sessionId,
  candidate,
  difficulty,
  targetCount,
  currentQuestion,
  turnsHistory,
  daysCovered,
  isThinking,
  onSubmitAnswer,
  onEndEarly,
  onRetryNetwork,
  networkError,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom when new turn added or thinking status changes
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turnsHistory, isThinking, currentQuestion]);

  const handleSend = () => {
    if (!answerInput.trim() || isThinking) return;
    const text = answerInput;
    setAnswerInput('');
    onSubmitAnswer(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = answerInput.length;
  const wordCount = answerInput.trim() ? answerInput.trim().split(/\s+/).length : 0;
  const currentQuestionNumber = turnsHistory.length + 1;

  // Calculate communication signal estimate dynamically based on answer lengths
  const avgLen = turnsHistory.length > 0
    ? turnsHistory.reduce((acc, t) => acc + (t.candidateAnswer?.length || 0), 0) / turnsHistory.length
    : 0;
  const liveSignalEstimate = Math.min(96, Math.max(72, Math.round(78 + (avgLen > 120 ? 12 : 5))));

  return (
    <div style={{ maxWidth: '1280px', margin: '20px auto', padding: '0 20px' }}>
      {/* Network Error Toast if any */}
      {networkError && (
        <div style={{ marginBottom: '16px' }}>
          <Toast
            message={`Network disruption detected: ${networkError}. Session ID ${sessionId} preserved.`}
            type="warning"
            onRetry={onRetryNetwork}
          />
        </div>
      )}

      {/* Core Desktop 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active AI Interviewer Question Panel */}
          <Card accentBorder elevated padding="24px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <QuestionMeta
                moduleTitle={currentQuestion.meta.moduleTitle}
                dayNumber={currentQuestion.meta.dayNumber}
                difficulty={currentQuestion.meta.difficulty}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Q{currentQuestionNumber} of ~{targetCount}
              </span>
            </div>

            {/* Current Question Text */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.5,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {currentQuestion.question}
            </h3>

            {/* Speaking/Thinking State Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isThinking ? 'var(--accent-warn)' : 'var(--accent-success)',
                  boxShadow: `0 0 8px ${isThinking ? 'var(--accent-warn)' : 'var(--accent-success)'}`,
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {isThinking ? 'AI Interviewer thinking & evaluating turn...' : 'Awaiting candidate response'}
              </span>
            </div>
          </Card>

          {/* Chat History Container */}
          <Card padding="20px" style={{ minHeight: '380px', maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {/* Previous Completed Turns */}
              {turnsHistory.map((turn, idx) => (
                <React.Fragment key={turn.id || idx}>
                  <ChatBubble
                    sender="interviewer"
                    content={turn.question.question}
                    timestamp={turn.timestamp}
                    isFollowUp={turn.question.isFollowUp}
                    moduleTitle={turn.question.meta.moduleTitle}
                    dayNumber={turn.question.meta.dayNumber}
                    difficulty={turn.question.meta.difficulty}
                  />
                  {turn.candidateAnswer && (
                    <ChatBubble
                      sender="candidate"
                      content={turn.candidateAnswer}
                      timestamp={turn.timestamp}
                      avatarUrl={candidate.member.avatar}
                    />
                  )}
                </React.Fragment>
              ))}

              {/* Current Interviewer Question Bubble if not first turn */}
              {turnsHistory.length > 0 && (
                <ChatBubble
                  sender="interviewer"
                  content={currentQuestion.question}
                  isFollowUp={currentQuestion.isFollowUp}
                  moduleTitle={currentQuestion.meta.moduleTitle}
                  dayNumber={currentQuestion.meta.dayNumber}
                  difficulty={currentQuestion.meta.difficulty}
                />
              )}

              {/* Thinking Dots Animation when processing */}
              {isThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', color: 'var(--text-muted)' }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span style={{ fontSize: '13px', fontStyle: 'italic' }}>Generating next context question...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </Card>

          {/* Answer Input Box */}
          <Card padding="16px">
            <textarea
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isThinking}
              placeholder="Type your response here... (Press Enter to submit, Shift+Enter for new line)"
              rows={4}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14.5px',
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {charCount} chars · {wordCount} words
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                disabled={!answerInput.trim() || isThinking}
                isLoading={isThinking}
                rightIcon={<Send size={16} />}
              >
                Submit Answer
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Session Rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '90px' }}>
          {/* Progress Card */}
          <Card padding="18px">
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-secondary)' }}>
              Interview Progress
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Question {currentQuestionNumber} of ~{targetCount}</span>
              <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                {Math.round((currentQuestionNumber / targetCount) * 100)}%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'var(--border-subtle)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: `${(currentQuestionNumber / targetCount) * 100}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Days Covered Live Tracker */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Curriculum Days Covered
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: daysCovered.length >= 4 ? 'var(--accent-success)' : 'var(--accent-warn)' }}>
                  {daysCovered.length} days (min ≥4)
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {daysCovered.map((d) => (
                  <span
                    key={d}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-secondary)',
                      backgroundColor: 'rgba(34, 211, 199, 0.12)',
                      padding: '2px 7px',
                      borderRadius: '4px',
                    }}
                  >
                    Day {d}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Live Indicator Bar (Communication signal estimate) */}
          <LiveIndicatorBar signalEstimate={liveSignalEstimate} />

          {/* Candidate Card Snippet */}
          <Card padding="14px 16px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden' }}>
                {/* eslint-disable-next-next/no-img-element */}
                <img src={candidate.member.avatar} alt={candidate.member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700 }}>{candidate.member.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{candidate.member.role}</p>
              </div>
            </div>
          </Card>

          {/* End Interview Early Button */}
          <Button variant="ghost" size="sm" onClick={() => setShowEndModal(true)} style={{ color: 'var(--text-muted)' }}>
            End interview early
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Ending Early */}
      {showEndModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <Card padding="28px" style={{ maxWidth: '440px', width: '100%', borderRadius: '20px' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', color: 'var(--accent-warn)' }}>
              <ShieldAlert size={24} />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>End Interview Early?</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Ending the session now will finalize evaluation based on responses submitted so far ({turnsHistory.length} turns across {daysCovered.length} curriculum days).
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="secondary" size="md" onClick={() => setShowEndModal(false)}>
                Continue Interview
              </Button>
              <Button variant="destructive" size="md" onClick={onEndEarly}>
                Yes, Finalize Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
