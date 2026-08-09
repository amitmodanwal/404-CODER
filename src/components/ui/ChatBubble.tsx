'use client';

import React, { useState } from 'react';
import { Bot, User, CornerDownRight } from 'lucide-react';
import { Badge } from './Badge';

export interface ChatBubbleProps {
  sender: 'interviewer' | 'candidate';
  content: string;
  timestamp?: string;
  isFollowUp?: boolean;
  moduleTitle?: string;
  dayNumber?: number;
  difficulty?: string;
  avatarUrl?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  timestamp,
  isFollowUp = false,
  moduleTitle,
  dayNumber,
  difficulty,
  avatarUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInterviewer = sender === 'interviewer';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: isInterviewer ? 'row' : 'row-reverse',
        gap: '12px',
        margin: '14px 0',
        alignItems: 'flex-start',
      }}
      className="animate-fade-in"
    >
      {/* Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isInterviewer ? 'rgba(110, 91, 255, 0.15)' : 'var(--bg-elevated)',
          border: isInterviewer ? '1px solid rgba(110, 91, 255, 0.3)' : '1px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isInterviewer ? 'var(--accent-primary)' : 'var(--text-primary)',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {!isInterviewer && avatarUrl ? (
          // eslint-disable-next-next/no-img-element
          <img src={avatarUrl} alt="Candidate Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : isInterviewer ? (
          <Bot size={20} />
        ) : (
          <User size={20} />
        )}
      </div>

      {/* Bubble Container */}
      <div
        style={{
          maxWidth: '82%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isInterviewer ? 'flex-start' : 'flex-end',
        }}
      >
        {/* Header Tags (Interviewer only) */}
        {isInterviewer && (moduleTitle || dayNumber || isFollowUp) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            {isFollowUp && (
              <Badge variant="status" size="sm" icon={<CornerDownRight size={12} />}>
                Follow-up Question
              </Badge>
            )}
            {dayNumber && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-secondary)',
                  backgroundColor: 'rgba(34, 211, 199, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Day {dayNumber}
              </span>
            )}
            {moduleTitle && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {moduleTitle}
              </span>
            )}
          </div>
        )}

        {/* Message Box */}
        <div
          style={{
            position: 'relative',
            backgroundColor: isInterviewer ? 'var(--bg-surface)' : 'var(--accent-primary)',
            color: isInterviewer ? 'var(--text-primary)' : '#FFFFFF',
            border: isInterviewer ? '1px solid var(--border-subtle)' : 'none',
            borderRadius: isInterviewer ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
            padding: '14px 18px',
            boxShadow: 'var(--shadow-card)',
            fontSize: '14.5px',
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          className={isInterviewer ? 'ai-gradient-top-border' : ''}
        >
          {content}
        </div>

        {/* Timestamp on hover or inline */}
        {timestamp && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '4px',
              opacity: isHovered ? 1 : 0.6,
              transition: 'opacity 0.15s ease',
            }}
          >
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
