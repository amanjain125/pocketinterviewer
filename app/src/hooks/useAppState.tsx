import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { 
  User, 
  Domain, 
  PlanType, 
  InterviewConfig, 
  InterviewSession, 
  InterviewFeedback,
  ProgressData,
  Page,
  Resume
} from '@/types';

interface AppState {
  // Navigation
  currentPage: Page;
  navigateTo: (page: Page) => void;
  
  // User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, profession: string, password: string) => Promise<boolean>;
  logout: () => void;
  setDomain: (domain: Domain) => void;
  upgradePlan: (plan: PlanType) => void;
  
  // Interview
  currentInterview: InterviewSession | null;
  interviewConfig: InterviewConfig | null;
  setInterviewConfig: (config: InterviewConfig) => void;
  startInterview: () => void;
  endInterview: (feedback: InterviewFeedback) => void;
  
  // Progress
  progressData: ProgressData | null;
  
  // Resume
  currentResume: Resume | null;
  setResume: (resume: Resume) => void;
  
  // UI State
  showDomainSelect: boolean;
  setShowDomainSelect: (show: boolean) => void;
  showInterviewSetup: boolean;
  setShowInterviewSetup: (show: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Mock data for demonstration
const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  profession: 'college_student',
  domain: 'computer_science',
  plan: 'freemium',
  streak: 5,
  joinedAt: new Date(),
};

const mockProgressData: ProgressData = {
  totalInterviews: 12,
  totalDuration: 45,
  currentStreak: 5,
  longestStreak: 8,
  weaknessRadar: {
    clarity: 75,
    structure: 68,
    technicalDepth: 82,
    confidence: 70,
    relevance: 85,
  },
  recentSessions: [],
  improvementTrend: [
    { date: '2024-01-01', score: 65 },
    { date: '2024-01-08', score: 70 },
    { date: '2024-01-15', score: 72 },
    { date: '2024-01-22', score: 78 },
    { date: '2024-01-29', score: 82 },
  ],
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  
  // User
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Interview
  const [currentInterview, setCurrentInterview] = useState<InterviewSession | null>(null);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  
  // Progress
  const [progressData] = useState<ProgressData | null>(mockProgressData);
  
  // Resume
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  
  // UI State
  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [showInterviewSetup, setShowInterviewSetup] = useState(false);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, call API
    if (email && password) {
      setUser(mockUser);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, profession: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, call API
    if (name && email && profession && password) {
      const newUser: User = {
        ...mockUser,
        name,
        email,
        profession: profession as any,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      setShowDomainSelect(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentInterview(null);
    setInterviewConfig(null);
    setCurrentResume(null);
    setCurrentPage('landing');
  }, []);

  const setDomain = useCallback((domain: Domain) => {
    if (user) {
      setUser({ ...user, domain });
      setShowDomainSelect(false);
      setCurrentPage('dashboard');
    }
  }, [user]);

  const upgradePlan = useCallback((plan: PlanType) => {
    if (user) {
      setUser({ ...user, plan });
    }
  }, [user]);

  const startInterview = useCallback(() => {
    if (interviewConfig) {
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        userId: user?.id || 'guest',
        config: interviewConfig,
        questions: [],
        answers: [],
        startedAt: new Date(),
      };
      setCurrentInterview(newSession);
      setCurrentPage('interview');
    }
  }, [interviewConfig, user]);

  const endInterview = useCallback((feedback: InterviewFeedback) => {
    if (currentInterview) {
      setCurrentInterview({
        ...currentInterview,
        endedAt: new Date(),
        feedback,
      });
      setCurrentPage('progress');
    }
  }, [currentInterview]);

  const setResume = useCallback((resume: Resume) => {
    setCurrentResume(resume);
  }, []);

  const value: AppState = {
    currentPage,
    navigateTo,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    setDomain,
    upgradePlan,
    currentInterview,
    interviewConfig,
    setInterviewConfig,
    startInterview,
    endInterview,
    progressData,
    currentResume,
    setResume,
    showDomainSelect,
    setShowDomainSelect,
    showInterviewSetup,
    setShowInterviewSetup,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
