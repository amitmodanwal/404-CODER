import React from 'react';
import { 
  Building2, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Terminal,
  CheckCircle,
  Headphones
} from 'lucide-react';

export const ContactUs = () => {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 space-y-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#6C3BFF]/40 bg-[#6C3BFF]/10 px-3.5 py-1 text-[10px] font-pixel text-[#8B5CF6] tracking-wider uppercase">
          <Terminal className="h-3.5 w-3.5 text-[#8B5CF6]" />
          <span>CONTACT_US // SYNAPSE_AI</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl dark:text-white light:text-slate-900">
          Enterprise Contact & Support Details
        </h1>
        <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B]">
          Direct channels for technical support, enterprise SLA inquiries, and platform security.
        </p>
      </div>

      {/* Grid of Contact Information Cards - STRICTLY STATIC NO FORM ELEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Support Emails */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C3BFF]/15 text-[#8B5CF6]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base dark:text-white light:text-slate-900">Enterprise Email Support</h3>
              <p className="text-xs text-slate-400">Direct Inquiries & Support</p>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-[#0B1220] border border-slate-800 text-[#8B5CF6]">
              support@synapseai.com
            </div>
            <div className="p-2.5 rounded-xl bg-[#0B1220] border border-slate-800 text-[#06B6D4]">
              enterprise@synapseai.com
            </div>
          </div>
        </div>

        {/* Global Headquarters */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base dark:text-white light:text-slate-900">Headquarters Address</h3>
              <p className="text-xs text-slate-400">Silicon Valley Tech Campus</p>
            </div>
          </div>

          <p className="text-xs dark:text-[#94A3B8] light:text-[#64748B] leading-relaxed">
            500 AI Innovation Boulevard, Suite 400<br />
            San Francisco, CA 94107, United States
          </p>
        </div>

        {/* Support Hours */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-[#F59E0B]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base dark:text-white light:text-slate-900">Support Hours & Global Operations</h3>
              <p className="text-xs text-slate-400">24/7 Monitoring</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Enterprise Priority Tier:</span>
              <strong className="text-[#10B981]">24 / 7 / 365 Live</strong>
            </div>
            <div className="flex justify-between">
              <span>Standard Support Tier:</span>
              <strong className="text-slate-300">Mon – Fri (08:00 – 20:00 PST)</strong>
            </div>
          </div>
        </div>

        {/* SLA Guarantees */}
        <div className="rounded-2xl border p-6 space-y-4 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#06B6D4]/15 text-[#06B6D4]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base dark:text-white light:text-slate-900">SLA Guarantees & Uptime</h3>
              <p className="text-xs text-slate-400">High Availability Platform</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
              <span>99.99% Guaranteed Platform API Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
              <span>&lt; 15-Minute Emergency SLA Response Time</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
              <span>SOC2 Type II & GDPR Compliant Infrastructure</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
