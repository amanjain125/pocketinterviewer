declare module '@/services/api' {
  export const authService: {
    register: (userData: any) => Promise<any>;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
    getCurrentUser: () => Promise<any>;
  };

  export const interviewService: {
    saveInterview: (interviewData: any) => Promise<any>;
    getUserInterviewHistory: (userId: string) => Promise<any>;
    getInterview: (interviewId: string) => Promise<any>;
  };
}