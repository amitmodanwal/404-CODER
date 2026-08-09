'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Sparkles, Terminal, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from './ui/Button';
import { Stepper, StepId } from './ui/Stepper';

export interface NavbarProps {
  currentStep?: StepId;
  onStartClick?: () => void;
  showStepper?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep = 'setup',
  onStartClick,
  showStepper = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
        padding: '12px 24px',
        transition: 'background-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Wordmark Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 10px rgba(110, 91, 255, 0.3)',
            }}
          >
            <Sparkles size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Synapse_AI
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-secondary)',
                  backgroundColor: 'rgba(34, 211, 199, 0.12)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                v4.0
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              AI Interview Agent
            </span>
          </div>
        </Link>

        {/* Stepper Rail (when inside session) */}
        {showStepper && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 16px' }}>
            <Stepper currentStep={currentStep} />
          </div>
        )}

        {/* Right Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/about"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
            }}
          >
            <Info size={15} />
            <span>About</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!showStepper && onStartClick && (
            <Button variant="primary" size="md" onClick={onStartClick} leftIcon={<Terminal size={16} />}>
              Start Interview
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
