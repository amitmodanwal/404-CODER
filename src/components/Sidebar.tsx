'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BarChart3, FileText, Sun, Moon, LogOut, Sparkles, Info } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Candidate } from '@/types/interview';

export interface SidebarProps {
  candidate?: Candidate | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ candidate }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analysis', href: '/analysis', icon: BarChart3 },
    { label: 'Reports', href: '/reports', icon: FileText },
  ];

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore
    }
    router.push('/login');
  };

  return (
    <aside className="app-sidebar"
      style={{
        width: '250px',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        height: '100dvh',
        flexShrink: 0,
        overflowY: 'auto',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Top Header & Navigation */}
      <div>
        {/* Synapse_AI Wordmark */}
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            marginBottom: '32px',
            padding: '0 8px',
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
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              AI Interview Agent v4
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'rgba(110, 91, 255, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(110, 91, 255, 0.25)' : '1px solid transparent',
                  transition: 'all 0.18s ease',
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Theme Toggle, About & Sign Out */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {candidate && candidate.member && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-elevated)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {candidate.member.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={candidate.member.avatar} alt={candidate.member.name || 'Candidate'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : candidate.member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {candidate.member.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {candidate.member.role}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', flexWrap: 'wrap', gap: '6px' }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <Link
            href="/about"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 8px',
            }}
          >
            <Info size={14} />
            About
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: 'var(--accent-danger)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 8px',
            }}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
