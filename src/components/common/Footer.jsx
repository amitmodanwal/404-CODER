import React from 'react';
import { ShieldCheck, Lock, Cpu, Activity } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer className="w-full border-t transition-colors duration-300 dark:border-[#1E293B] dark:bg-[#0B1220] light:border-[#E2E8F0] light:bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1700px] px-6 py-8 lg:px-12">
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center space-y-2 md:items-start">
            <div 
              onClick={() => setCurrentView && setCurrentView('landing')}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C3BFF] to-[#8B5CF6]">
                <Cpu className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-sans text-base font-bold dark:text-[#F8FAFC] light:text-[#0F172A]">
                Synapse<span className="text-[#8B5CF6]">_AI</span>
              </span>
            </div>
            <p className="font-sans text-xs dark:text-[#94A3B8] light:text-[#64748B]">
              © 2026 Synapse_AI Inc. All rights reserved. 31-Day Cohort Evaluation Engine v2.0.
            </p>
          </div>

          {/* Compliance Badges & Latency Indicator */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Activity className="h-3.5 w-3.5 text-[#10B981] animate-pulse" />
              <span>Latency: 24ms • 99.99% Operational</span>
            </div>

            <div className="flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-medium dark:border-[#1E293B] dark:bg-[#111A2E] dark:text-[#06B6D4] light:border-[#E2E8F0] light:bg-white light:text-[#06B6D4] light:shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>SOC2 Type II Certified</span>
            </div>

            <div className="flex items-center space-x-1.5 rounded-full border px-3 py-1 text-xs font-medium dark:border-[#1E293B] dark:bg-[#111A2E] dark:text-[#10B981] light:border-[#E2E8F0] light:bg-white light:text-[#10B981] light:shadow-sm">
              <Lock className="h-3.5 w-3.5" />
              <span>GDPR Compliant</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 font-sans text-xs font-medium">
            <button
              onClick={() => setCurrentView && setCurrentView('about')}
              className="transition-colors hover:text-[#8B5CF6] dark:text-[#94A3B8] light:text-[#64748B]"
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentView && setCurrentView('contact')}
              className="transition-colors hover:text-[#8B5CF6] dark:text-[#94A3B8] light:text-[#64748B]"
            >
              Contact Us
            </button>
            <button
              onClick={() => setCurrentView && setCurrentView('settings')}
              className="transition-colors hover:text-[#8B5CF6] dark:text-[#94A3B8] light:text-[#64748B]"
            >
              Settings
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
