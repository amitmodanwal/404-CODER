import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Laptop, 
  Sparkles, 
  Plus, 
  Cpu, 
  Menu, 
  X, 
  Settings, 
  UserCheck 
} from 'lucide-react';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();
  const { user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Landing' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us', isPixel: true },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'setup', label: 'Start Interview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'performance', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300 dark:border-[#1E293B] dark:bg-[#0B1220]/90 light:border-[#E2E8F0] light:bg-[#F8FAFC]/90">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between px-6 py-3 lg:px-10">
        
        {/* Brand Logo: Synapse_AI with purple tag */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex cursor-pointer items-center space-x-3 group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C3BFF] to-[#8B5CF6] p-0.5 shadow-lg shadow-[#6C3BFF]/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0B1220] dark:bg-[#0B1220] light:bg-[#FFFFFF]">
              <Cpu className="h-5 w-5 text-[#8B5CF6]" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-sans text-xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
              Synapse<span className="text-[#8B5CF6]">_AI</span>
            </span>
            <span className="rounded-full bg-[#6C3BFF]/20 border border-[#8B5CF6]/40 px-2 py-0.5 font-mono text-[10px] font-bold text-[#8B5CF6]">
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center space-x-1 lg:flex">
          {navLinks.map((item) => {
            if (item.isPixel) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`font-pixel ml-1.5 rounded-md border px-2.5 py-1.5 text-[10px] tracking-wider uppercase transition-all ${
                    currentView === item.id
                      ? 'bg-[#6C3BFF]/30 text-[#8B5CF6] border-[#8B5CF6] shadow-[0_0_10px_rgba(108,59,255,0.4)] scale-105'
                      : 'bg-[#6C3BFF]/10 text-[#8B5CF6] border-[#6C3BFF]/30 hover:bg-[#6C3BFF]/20 hover:border-[#8B5CF6]'
                  }`}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                  currentView === item.id
                    ? 'bg-[#6C3BFF]/15 text-[#8B5CF6] border border-[#8B5CF6]/30'
                    : 'dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-[#111A2E] light:text-[#64748B] light:hover:text-[#0F172A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls & Quick Action Button */}
        <div className="hidden items-center space-x-3 lg:flex">
          
          {/* Global Theme Toggle Switch (Dark / Light / System) */}
          <div className="flex items-center rounded-xl border p-1 dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white shadow-sm">
            <button
              onClick={() => setThemeMode('light')}
              title="Light Mode"
              className={`p-1.5 rounded-lg transition-colors ${themeMode === 'light' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-lg transition-colors ${themeMode === 'dark' ? 'bg-[#6C3BFF]/25 text-[#8B5CF6] font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setThemeMode('system')}
              title="System Default"
              className={`p-1.5 rounded-lg transition-colors ${themeMode === 'system' ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Laptop className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Recruiter Session Button / Auth */}
          <button
            onClick={() => setCurrentView('auth')}
            className="flex items-center space-x-2 rounded-xl border px-3 py-1.5 font-sans text-xs font-semibold dark:border-slate-800 dark:bg-[#111A2E] dark:text-[#F8FAFC] light:border-slate-300 light:bg-white"
          >
            <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] flex items-center justify-center text-[10px] text-white font-bold">
              AM
            </div>
            <span>{user?.name || 'Alex Mercer'}</span>
          </button>

          {/* Quick Action: + New Interview Button */}
          <button
            onClick={() => setCurrentView('setup')}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#6C3BFF]/25 hover:shadow-xl hover:shadow-[#6C3BFF]/35 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Interview</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg border dark:border-slate-800 dark:bg-[#111A2E] light:border-slate-300 light:bg-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="border-b px-6 pb-6 pt-2 lg:hidden dark:border-slate-800 dark:bg-[#0B1220] light:border-slate-300 light:bg-white">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setCurrentView(link.id); setMobileOpen(false); }}
                className={`text-left py-2 text-xs font-semibold ${link.isPixel ? 'font-pixel text-[#8B5CF6]' : 'dark:text-white light:text-slate-900'}`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setCurrentView('setup'); setMobileOpen(false); }}
              className="flex items-center justify-center space-x-2 rounded-xl bg-[#6C3BFF] py-2 text-xs font-bold text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>+ New Interview</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
