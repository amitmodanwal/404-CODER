import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// All 12 Complete Screens
import { LandingPage } from './components/screens/LandingPage';
import { AboutUs } from './components/screens/AboutUs';
import { ContactUs } from './components/screens/ContactUs';
import { AuthScreen } from './components/screens/AuthScreen';
import { DashboardPage } from './components/screens/DashboardPage';
import { StartInterviewScreen } from './components/screens/StartInterviewScreen';
import { LiveConsole } from './components/screens/LiveConsole';
import { PostInterviewReport } from './components/screens/PostInterviewReport';
import { FullTranscriptScreen } from './components/screens/FullTranscriptScreen';
import { PerformanceAnalyticsScreen } from './components/screens/PerformanceAnalyticsScreen';
import { CurriculumMapScreen } from './components/screens/CurriculumMapScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

export const MainAppRouter = () => {
  // 12 Routed Screens: 'landing' | 'about' | 'contact' | 'auth' | 'dashboard' | 'setup' | 'live_console' | 'analytics' | 'transcript' | 'performance' | 'curriculum' | 'settings'
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#6C3BFF]/30 transition-colors duration-300">
      
      {/* Top Navbar & Sidebar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Container */}
      <main className="flex-grow">
        {currentView === 'landing' && <LandingPage setCurrentView={setCurrentView} />}
        {currentView === 'about' && <AboutUs setCurrentView={setCurrentView} />}
        {currentView === 'contact' && <ContactUs />}
        {currentView === 'auth' && <AuthScreen setCurrentView={setCurrentView} />}
        {currentView === 'dashboard' && <DashboardPage setCurrentView={setCurrentView} />}
        {currentView === 'setup' && <StartInterviewScreen setCurrentView={setCurrentView} />}
        {currentView === 'live_console' && <LiveConsole setCurrentView={setCurrentView} />}
        {currentView === 'analytics' && <PostInterviewReport setCurrentView={setCurrentView} />}
        {currentView === 'transcript' && <FullTranscriptScreen setCurrentView={setCurrentView} />}
        {currentView === 'performance' && <PerformanceAnalyticsScreen setCurrentView={setCurrentView} />}
        {currentView === 'curriculum' && <CurriculumMapScreen setCurrentView={setCurrentView} />}
        {currentView === 'settings' && <SettingsScreen />}
      </main>

      {/* Persistent Enterprise Footer (Suppressed during Live AI Console) */}
      {currentView !== 'live_console' && (
        <Footer setCurrentView={setCurrentView} />
      )}

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainAppRouter />
      </AppProvider>
    </ThemeProvider>
  );
}
