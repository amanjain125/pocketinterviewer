// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  profession: 'college_student' | 'recent_graduate' | 'professional';
  domain: Domain;
  plan: PlanType;
  streak: number;
  joinedAt: Date;
}

export type Domain = 
  | 'computer_science' 
  | 'civil' 
  | 'ai_ml' 
  | 'mechanical' 
  | 'electrical' 
  | 'others';

export type PlanType = 'freemium' | 'advanced' | 'full';

// Interview Types
export type InterviewType = 
  | 'behavioral' 
  | 'technical' 
  | 'rapid_fire' 
  | 'situational' 
  | 'hr_basics';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type InterviewMode = 
  | 'normal' 
  | 'stress' 
  | 'distraction' 
  | 'panel' 
  | 'full';

export interface InterviewConfig {
  type: InterviewType;
  difficulty: DifficultyLevel;
  mode: InterviewMode;
  duration: number; // in minutes
}

export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewConfig;
  questions: Question[];
  answers: Answer[];
  startedAt: Date;
  endedAt?: Date;
  feedback?: InterviewFeedback;
}

export interface Question {
  id: string;
  text: string;
  type: InterviewType;
  followUpTo?: string;
}

export interface Answer {
  questionId: string;
  text: string;
  audioUrl?: string;
  duration: number; // in seconds
  timestamp: Date;
}

export interface InterviewFeedback {
  overallScore: number;
  confidenceScore: number;
  communicationScore: number;
  technicalScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  weaknessRadar: WeaknessRadar;
}

export interface WeaknessRadar {
  clarity: number;
  structure: number;
  technicalDepth: number;
  confidence: number;
  relevance: number;
}

// Resume Types
export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  parsedContent?: ResumeContent;
  uploadedAt: Date;
}

export interface ResumeContent {
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

// Full Interview Round Types
export type InterviewRound = 
  | 'introduction' 
  | 'project' 
  | 'technical' 
  | 'behavioral' 
  | 'rapid_fire' 
  | 'closing';

export interface FullInterviewSession extends InterviewSession {
  resumeId: string;
  rounds: RoundSession[];
  currentRound: InterviewRound;
  resumeUnderstandingScore?: number;
  projectDepthScore?: number;
  stressHandlingScore?: number;
}

export interface RoundSession {
  round: InterviewRound;
  questions: Question[];
  answers: Answer[];
  feedback?: RoundFeedback;
}

export interface RoundFeedback {
  round: InterviewRound;
  score: number;
  comments: string[];
}

// Panel Interviewer Types
export interface PanelInterviewer {
  id: string;
  name: string;
  role: 'lead' | 'interruptor' | 'observer';
  avatar: string;
  personality: string;
}

export interface PanelSession {
  interviewers: PanelInterviewer[];
  currentInterviewer: string;
  interruptions: Interruption[];
}

export interface Interruption {
  timestamp: number;
  interviewerId: string;
  message: string;
}

// Progress Types
export interface ProgressData {
  totalInterviews: number;
  totalDuration: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  weaknessRadar: WeaknessRadar;
  recentSessions: InterviewSession[];
  improvementTrend: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  score: number;
}

// Navigation Types
export type Page = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'domain-select' 
  | 'dashboard' 
  | 'interview' 
  | 'progress' 
  | 'pro' 
  | 'profile' 
  | 'modes' 
  | 'panel' 
  | 'full-interview';

// UI Types
export interface NavItem {
  label: string;
  page: Page;
  requiresAuth: boolean;
  planRequired?: PlanType[];
}
