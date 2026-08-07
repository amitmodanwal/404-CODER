import React, { createContext, useContext, useState } from 'react';
import { candidatesData } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current active candidate (selected from candidates.json)
  const [selectedCandidate, setSelectedCandidate] = useState(candidatesData.candidates[0]);

  // Current session & active report
  const [activeSession, setActiveSession] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Recruiter Auth session
  const [user, setUser] = useState({
    name: 'Alex Mercer',
    role: 'Technical Recruiter',
    email: 'alex.mercer@company.com'
  });

  // Settings state
  const [settings, setSettings] = useState({
    defaultTechLevel: 'Mid-Level Engineer',
    aiPersonaTone: 'Professional',
    autoScore: true,
    recordAudioVideo: true
  });

  const selectCandidateById = (id) => {
    const cand = candidatesData.candidates.find(c => c.member.id === id);
    if (cand) setSelectedCandidate(cand);
  };

  return (
    <AppContext.Provider value={{
      selectedCandidate,
      setSelectedCandidate,
      selectCandidateById,
      activeSession,
      setActiveSession,
      reportData,
      setReportData,
      user,
      setUser,
      settings,
      setSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
