import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
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
import { authService, interviewService } from '@/services/api';

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
  startInterview: (config?: InterviewConfig) => void;
  endInterview: (feedback: InterviewFeedback) => void;

  // Progress
  progressData: ProgressData | null;
  loadProgressData: () => Promise<void>;

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
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  // Resume
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);

  // UI State
  const [showDomainSelect, setShowDomainSelect] = useState(false);
  const [showInterviewSetup, setShowInterviewSetup] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    };

    initializeAuth();
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const result = await authService.login({ email, password });

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
      return true;
    } else {
      console.error('Login failed:', result.message);
      return false;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, profession: string, password: string): Promise<boolean> => {
    const result = await authService.register({ name, email, profession, password });

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
      setShowDomainSelect(true);
      return true;
    } else {
      console.error('Signup failed:', result.message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    // Don't clear progress data on logout - keep it in localStorage
    setUser(null);
    setIsAuthenticated(false);
    setCurrentInterview(null);
    setInterviewConfig(null);
    setCurrentResume(null);
    // Keep progress data in state but clear user-specific data
    setCurrentPage('landing');
  }, []);

  const setDomain = useCallback(async (domain: Domain) => {
    if (user) {
      try {
        // In a real implementation, you would update the user's domain on the server
        const updatedUser = { ...user, domain };
        setUser(updatedUser);
        setShowDomainSelect(false);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Error updating domain:', error);
      }
    }
  }, [user]);

  const upgradePlan = useCallback(async (plan: PlanType) => {
    if (user) {
      try {
        // In a real implementation, you would update the user's plan on the server
        const updatedUser = { ...user, plan };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error upgrading plan:', error);
      }
    }
  }, [user]);

  const startInterview = useCallback((config?: InterviewConfig) => {
    const configToUse = config || interviewConfig;
    if (configToUse && user) {
      const newSession: InterviewSession = {
        id: Date.now().toString(),
        userId: user.id,
        config: configToUse,
        questions: [],
        answers: [],
        startedAt: new Date(),
      };
      setCurrentInterview(newSession);
      setCurrentPage('interview');
    }
  }, [interviewConfig, user]);

  const endInterview = useCallback(async (feedback: InterviewFeedback) => {
    if (currentInterview && user) {
      // Update the interview session with end time and feedback
      const updatedInterview: InterviewSession = {
        ...currentInterview,
        endedAt: new Date(),
        feedback,
      };

      // Save the interview to the database
      const result = await interviewService.saveInterview({
        userId: user.id,
        config: updatedInterview.config,
        questions: updatedInterview.questions,
        answers: updatedInterview.answers,
        feedback: updatedInterview.feedback
      });

      // Also save to localStorage for persistence
      try {
        const existingInterviews = JSON.parse(localStorage.getItem(`interviews_${user.id}`) || '[]');
        existingInterviews.push(updatedInterview);
        localStorage.setItem(`interviews_${user.id}`, JSON.stringify(existingInterviews));
      } catch (error) {
        console.error('Error saving interview to localStorage:', error);
      }

      if (result.success) {
        setCurrentInterview(updatedInterview);
        setCurrentPage('progress');

        // Reload progress data to reflect the new interview
        await loadProgressData();
      } else {
        console.error('Error saving interview:', result.message);
        // Still navigate to progress page even if save failed
        setCurrentInterview(updatedInterview);
        setCurrentPage('progress');
      }
    }
  }, [currentInterview, user]);

  const loadProgressData = useCallback(async () => {
    if (user) {
      try {
        // Try to load from localStorage first
        const savedProgress = localStorage.getItem(`progress_${user.id}`);
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          setProgressData(parsedProgress);
          return;
        }

        // Try to fetch from service (simulated)
        const result = await interviewService.getUserInterviewHistory(user.id);

        // Get interviews from localStorage as fallback
        const localStorageInterviews = JSON.parse(localStorage.getItem(`interviews_${user.id}`) || '[]');
        const allInterviews = result.success ? [...result.interviews, ...localStorageInterviews] : localStorageInterviews;

        if (allInterviews.length > 0) {
          // Calculate progress based on all interviews (service + localStorage)
          const totalInterviews = allInterviews.length;
          const totalDuration = allInterviews.reduce((sum: number, interview: any) => {
            if (interview.startedAt && interview.endedAt) {
              const duration = (new Date(interview.endedAt).getTime() - new Date(interview.startedAt).getTime()) / (1000 * 60); // in minutes
              return sum + duration;
            }
            return sum;
          }, 0);

          // Calculate average scores
          const avgScores = allInterviews.reduce((acc: { overall: number, confidence: number, communication: number, technical: number }, interview: any) => {
            if (interview.feedback) {
              acc.overall += interview.feedback.overallScore || 0;
              acc.confidence += interview.feedback.confidenceScore || 0;
              acc.communication += interview.feedback.communicationScore || 0;
              acc.technical += interview.feedback.technicalScore || 0;
            }
            return acc;
          }, { overall: 0, confidence: 0, communication: 0, technical: 0 });

          const count = allInterviews.length || 1;
          const avgOverall = Math.round(avgScores.overall / count);
          const avgConfidence = Math.round(avgScores.confidence / count);
          const avgCommunication = Math.round(avgScores.communication / count);
          const avgTechnical = Math.round(avgScores.technical / count);

          const progressData: ProgressData = {
            totalInterviews,
            totalDuration: Math.round(totalDuration),
            currentStreak: user.streak,
            longestStreak: user.streak,
            weaknessRadar: {
              clarity: avgCommunication,
              structure: avgCommunication,
              technicalDepth: avgTechnical,
              confidence: avgConfidence,
              relevance: avgOverall
            },
            recentSessions: allInterviews.slice(0, 5), // Last 5 interviews
            improvementTrend: allInterviews.map((interview: any) => ({
              date: new Date(interview.createdAt || interview.startedAt).toISOString().split('T')[0],
              score: interview.feedback?.overallScore || 70
            }))
          };

          // Save to localStorage
          localStorage.setItem(`progress_${user.id}`, JSON.stringify(progressData));
          setProgressData(progressData);
        } else {
          // If no interviews exist, try to load from localStorage or use default
          const savedProgress = localStorage.getItem(`progress_${user.id}`);
          if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            setProgressData(parsedProgress);
          } else {
            // Default progress data
            const defaultProgress: ProgressData = {
              totalInterviews: 0,
              totalDuration: 0,
              currentStreak: user.streak,
              longestStreak: user.streak,
              weaknessRadar: {
                clarity: 70,
                structure: 70,
                technicalDepth: 70,
                confidence: 70,
                relevance: 70
              },
              recentSessions: [],
              improvementTrend: []
            };
            localStorage.setItem(`progress_${user.id}`, JSON.stringify(defaultProgress));
            setProgressData(defaultProgress);
          }
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
        // Try to load from localStorage as fallback
        try {
          const savedProgress = localStorage.getItem(`progress_${user.id}`);
          if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            setProgressData(parsedProgress);
          } else {
            // Final fallback
            setProgressData({
              totalInterviews: 0,
              totalDuration: 0,
              currentStreak: user.streak,
              longestStreak: user.streak,
              weaknessRadar: {
                clarity: 70,
                structure: 70,
                technicalDepth: 70,
                confidence: 70,
                relevance: 70
              },
              recentSessions: [],
              improvementTrend: []
            });
          }
        } catch (localStorageError) {
          console.error('Error with localStorage:', localStorageError);
          // Ultimate fallback
          setProgressData({
            totalInterviews: 0,
            totalDuration: 0,
            currentStreak: user.streak,
            longestStreak: user.streak,
            weaknessRadar: {
              clarity: 70,
              structure: 70,
              technicalDepth: 70,
              confidence: 70,
              relevance: 70
            },
            recentSessions: [],
            improvementTrend: []
          });
        }
      }
    }
  }, [user]);

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
    loadProgressData,
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
