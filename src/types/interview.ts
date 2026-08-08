export interface CandidateMember {
  name: string;
  role: string;
  yearsExperience: string;
  education: string;
  statusBadge: string;
  avatar: string;
}

export interface CandidateSignals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
  passRate: number;
}

export interface CandidateMission {
  day: number;
  title: string;
  completed: boolean;
  skipped: boolean;
  attempts: number;
  firstTry: boolean;
}

export interface Candidate {
  id: string;
  member: CandidateMember;
  signals: CandidateSignals;
  missions: CandidateMission[];
}

export interface CurriculumDay {
  day: number;
  moduleId: number;
  title: string;
  topics: string[];
}

export interface CurriculumModule {
  id: number;
  title: string;
  dayRange: string;
  days: number[];
  description: string;
}

export interface CurriculumData {
  title: string;
  totalDays: number;
  modules: CurriculumModule[];
  days: CurriculumDay[];
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface QuestionMeta {
  moduleTitle: string;
  dayNumber: number;
  difficulty: DifficultyLevel;
}

export interface QuestionData {
  id: string;
  question: string;
  meta: QuestionMeta;
  isFollowUp: boolean;
}

export interface InterviewTurn {
  id: string;
  question: QuestionData;
  candidateAnswer?: string;
  timestamp: string;
  liveSignalEstimate?: number; // 0-100 communication signal
}

export interface CategoryScore {
  moduleTitle: string;
  score: number; // 0-100
  questionsCount: number;
}

export interface ActionableNextStep {
  text: string;
  dayNumber?: number;
  moduleTitle?: string;
}

export interface FeedbackReport {
  overallScore: number; // 0-100
  difficultyUsed: DifficultyLevel;
  date: string;
  durationMinutes: number;
  candidateName: string;
  candidateRole: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  next: ActionableNextStep[];
  categoryBreakdown: CategoryScore[];
}

export interface ApiInterviewRequest {
  action: 'start' | 'respond' | 'finish';
  sessionId: string;
  candidateId: string;
  answer?: string;
  difficulty?: DifficultyLevel;
  length?: 'standard' | 'extended';
  focusModules?: number[];
}

export interface ApiInterviewResponse {
  done: boolean;
  sessionId: string;
  currentQuestion?: QuestionData;
  daysCovered?: number[];
  feedback?: FeedbackReport;
  error?: string;
}
