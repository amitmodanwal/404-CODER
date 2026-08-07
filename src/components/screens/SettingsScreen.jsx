import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { 
  Sun, 
  Moon, 
  Laptop, 
  User, 
  Sliders, 
  Check, 
  Save, 
  AlertTriangle, 
  Trash2, 
  ShieldAlert 
} from 'lucide-react';

export const SettingsScreen = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { user, setUser, settings, setSettings } = useApp();

  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : 'Alex');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ')[1] || 'Mercer' : 'Mercer');
  const [email, setEmail] = useState(user?.email || 'alex.mercer@company.com');

  const [techLevel, setTechLevel] = useState(settings?.defaultTechLevel || 'Mid-Level Engineer');
  const [personaTone, setPersonaTone] = useState(settings?.aiPersonaTone || 'Professional');

  const [autoScore, setAutoScore] = useState(settings?.autoScore ?? true);
  const [recordAudio, setRecordAudio] = useState(settings?.recordAudioVideo ?? true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      name: `${firstName} ${lastName}`,
      role: user?.role || 'Technical Recruiter',
      email
    });
    setSettings({
      defaultTechLevel: techLevel,
      aiPersonaTone: personaTone,
      autoScore,
      recordAudioVideo: recordAudio
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="border-b pb-6 dark:border-[#1E293B] light:border-[#E2E8F0]">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-[#F8FAFC] light:text-[#0F172A]">
            Settings
          </h1>
          <span className="rounded-full bg-[#6C3BFF]/10 border border-[#8B5CF6]/30 px-3 py-1 font-mono text-xs text-[#8B5CF6] font-semibold">
            Preferences & Account
          </span>
        </div>
        <p className="mt-1 text-xs dark:text-[#94A3B8] light:text-[#64748B]">
          Manage your account profile, appearance mode, and default interview evaluation preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Info & Preferences (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Profile Information Editor */}
          <form onSubmit={handleSave} className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
              <User className="h-4 w-4" />
              <span>Profile Information</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6C3BFF] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg shadow-md">
                {firstName[0]}{lastName[0]}
              </div>
              <div>
                <h4 className="font-bold text-sm dark:text-white light:text-slate-900">{firstName} {lastName}</h4>
                <p className="text-xs text-slate-400">{user?.role || 'Technical Recruiter'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">FIRST NAME</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none focus:border-[#6C3BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">LAST NAME</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none focus:border-[#6C3BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none focus:border-[#6C3BFF]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="flex items-center space-x-1 text-xs font-bold text-[#10B981]">
                  <Check className="h-4 w-4" />
                  <span>Changes saved successfully!</span>
                </span>
              )}
              <button
                type="submit"
                className="ml-auto flex items-center space-x-2 rounded-xl bg-[#6C3BFF] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#5b2ee6]"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          {/* Interview Preferences */}
          <div className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#06B6D4] uppercase tracking-wider">
              <Sliders className="h-4 w-4" />
              <span>Interview Preferences</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Default Technical Level</label>
                <select
                  value={techLevel}
                  onChange={(e) => setTechLevel(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors dark:border-slate-800 dark:bg-[#0B1220] dark:text-white light:border-slate-300 light:bg-slate-50 focus:outline-none"
                >
                  <option value="Junior Engineer">Junior Engineer</option>
                  <option value="Mid-Level Engineer">Mid-Level Engineer</option>
                  <option value="Senior Staff Engineer">Senior Staff Engineer</option>
                  <option value="Principal Architect">Principal Architect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">AI Persona Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Friendly', 'Professional', 'Rigorous'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setPersonaTone(t)}
                      className={`rounded-xl border py-2.5 text-xs font-bold transition-all ${
                        personaTone === t
                          ? 'border-[#6C3BFF] bg-[#6C3BFF]/20 text-[#8B5CF6]'
                          : 'dark:border-slate-800 dark:bg-[#0B1220] dark:text-slate-400 light:border-slate-200 light:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automation Checkboxes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between rounded-xl border p-3 dark:border-slate-800 dark:bg-[#0B1220]">
                  <div>
                    <div className="text-xs font-bold dark:text-white light:text-slate-900">Auto-Score Candidates</div>
                    <div className="text-[10px] text-slate-400">Generate a score immediately after interview concludes.</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={autoScore}
                    onChange={(e) => setAutoScore(e.target.checked)}
                    className="h-4 w-4 accent-[#6C3BFF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 dark:border-slate-800 dark:bg-[#0B1220]">
                  <div>
                    <div className="text-xs font-bold dark:text-white light:text-slate-900">Record Audio & Video</div>
                    <div className="text-[10px] text-slate-400">Store recordings for manual review later.</div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={recordAudio}
                    onChange={(e) => setRecordAudio(e.target.checked)}
                    className="h-4 w-4 accent-[#6C3BFF] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone: Permanently Delete Account Block */}
          <div className="rounded-2xl border border-rose-500/30 p-6 space-y-4 bg-rose-500/5 shadow-lg">
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4" />
              <span>Danger Zone</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Delete Account</div>
                <div className="text-[10px] text-rose-300">Permanently delete your account and all associated data.</div>
              </div>

              <button
                type="button"
                onClick={() => alert("Account deletion requires admin confirmation.")}
                className="rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/30"
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Appearance Dedicated Mode Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border p-6 space-y-5 dark:border-[#1E293B] dark:bg-[#111A2E] light:border-[#E2E8F0] light:bg-white shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              <Sun className="h-4 w-4" />
              <span>Appearance</span>
            </div>

            <p className="text-xs text-slate-400">Customize the interface theme.</p>

            <div className="space-y-3">
              {/* Light Mode Button */}
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`w-full flex items-center justify-between rounded-xl border p-4 transition-all ${
                  themeMode === 'light'
                    ? 'border-[#6C3BFF] bg-[#6C3BFF]/15 ring-2 ring-[#6C3BFF]/40 text-[#8B5CF6]'
                    : 'dark:border-slate-800 dark:bg-[#0B1220]/60 dark:text-slate-300 light:border-slate-300 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-bold">Light</span>
                </div>
                {themeMode === 'light' && <Check className="h-4 w-4 text-[#8B5CF6]" />}
              </button>

              {/* Dark Mode Button */}
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`w-full flex items-center justify-between rounded-xl border p-4 transition-all ${
                  themeMode === 'dark'
                    ? 'border-[#6C3BFF] bg-[#6C3BFF]/15 ring-2 ring-[#6C3BFF]/40 text-[#8B5CF6]'
                    : 'dark:border-slate-800 dark:bg-[#0B1220]/60 dark:text-slate-300 light:border-slate-300 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs font-bold">Dark</span>
                </div>
                {themeMode === 'dark' && <Check className="h-4 w-4 text-[#8B5CF6]" />}
              </button>

              {/* System Default Button */}
              <button
                type="button"
                onClick={() => setThemeMode('system')}
                className={`w-full flex items-center justify-between rounded-xl border p-4 transition-all ${
                  themeMode === 'system'
                    ? 'border-[#6C3BFF] bg-[#6C3BFF]/15 ring-2 ring-[#6C3BFF]/40 text-[#8B5CF6]'
                    : 'dark:border-slate-800 dark:bg-[#0B1220]/60 dark:text-slate-300 light:border-slate-300 light:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Laptop className="h-5 w-5 text-teal-400" />
                  <span className="text-xs font-bold">System</span>
                </div>
                {themeMode === 'system' && <Check className="h-4 w-4 text-[#8B5CF6]" />}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
