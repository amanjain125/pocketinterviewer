import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Star,
  Clock,
  Mic,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';

// Mock interview history
const mockInterviewHistory = [
  {
    id: '1',
    type: 'behavioral',
    difficulty: 'medium',
    date: '2024-01-29',
    duration: 4,
    score: 82,
    feedback: {
      overallScore: 82,
      confidenceScore: 78,
      communicationScore: 85,
      technicalScore: 80,
      strengths: ['Clear articulation', 'Good examples', 'Structured answers'],
      improvements: ['Add more metrics', 'Be more concise'],
      summary: 'Strong performance with well-structured responses.',
      weaknessRadar: { clarity: 85, structure: 80, technicalDepth: 75, confidence: 78, relevance: 88 },
    },
  },
  {
    id: '2',
    type: 'technical',
    difficulty: 'hard',
    date: '2024-01-27',
    duration: 6,
    score: 75,
    feedback: {
      overallScore: 75,
      confidenceScore: 70,
      communicationScore: 78,
      technicalScore: 82,
      strengths: ['Strong technical knowledge', 'Good problem breakdown'],
      improvements: ['Explain trade-offs better', 'Practice edge cases'],
      summary: 'Good technical depth but could improve communication of complex concepts.',
      weaknessRadar: { clarity: 72, structure: 78, technicalDepth: 85, confidence: 70, relevance: 82 },
    },
  },
  {
    id: '3',
    type: 'rapid_fire',
    difficulty: 'easy',
    date: '2024-01-25',
    duration: 3,
    score: 88,
    feedback: {
      overallScore: 88,
      confidenceScore: 90,
      communicationScore: 86,
      technicalScore: 85,
      strengths: ['Quick thinking', 'Confident delivery', 'Clear answers'],
      improvements: ['Elaborate more when needed'],
      summary: 'Excellent quick responses with high confidence.',
      weaknessRadar: { clarity: 90, structure: 85, technicalDepth: 82, confidence: 90, relevance: 88 },
    },
  },
];

export function ProgressPage() {
  const { navigateTo, progressData } = useAppState();
  const [expandedInterview, setExpandedInterview] = useState<string | null>(null);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      behavioral: 'Behavioral',
      technical: 'Technical',
      rapid_fire: 'Rapid Fire',
      situational: 'Situational',
      hr_basics: 'HR Basics',
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'text-green-400 bg-green-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      hard: 'text-red-400 bg-red-500/20',
    };
    return colors[difficulty] || 'text-white bg-white/10';
  };

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl text-white font-display font-bold">Your Progress</h1>
            <p className="text-white/60">Track your interview journey</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#FF4EC2]" />
              </div>
              <span className="text-white/60 text-sm">Total Interviews</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalInterviews || 12}
            </p>
          </div>

          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white/60 text-sm">Avg Score</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {Math.round(mockInterviewHistory.reduce((acc, i) => acc + i.score, 0) / mockInterviewHistory.length)}%
            </p>
          </div>

          <div className="card-violet p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/60 text-sm">Practice Time</span>
            </div>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalDuration || 45} <span className="text-lg text-white/50">min</span>
            </p>
          </div>
        </div>

        {/* Weakness Radar */}
        <div className="card-violet p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Weakness Radar</h3>
              <p className="text-white/50 text-sm">Areas to focus on</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Clarity', value: progressData?.weaknessRadar.clarity || 75 },
              { label: 'Structure', value: progressData?.weaknessRadar.structure || 68 },
              { label: 'Technical Depth', value: progressData?.weaknessRadar.technicalDepth || 82 },
              { label: 'Confidence', value: progressData?.weaknessRadar.confidence || 70 },
              { label: 'Relevance', value: progressData?.weaknessRadar.relevance || 85 },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#FF4EC2"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(item.value / 100) * 226} 226`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold">{item.value}%</span>
                  </div>
                </div>
                <p className="text-white/60 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview History */}
        <div>
          <h2 className="text-xl text-white font-semibold mb-4">Interview History</h2>
          <div className="space-y-4">
            {mockInterviewHistory.map((interview) => {
              const isExpanded = expandedInterview === interview.id;

              return (
                <div key={interview.id} className="card-violet overflow-hidden">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedInterview(isExpanded ? null : interview.id)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getDifficultyColor(interview.difficulty)}`}>
                        <span className="text-xl font-bold">{interview.score}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-semibold">
                          {getTypeLabel(interview.type)} Interview
                        </h3>
                        <p className="text-white/50 text-sm">
                          {new Date(interview.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })} • {interview.duration} min • {interview.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(interview.score / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-white/10 pt-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Scores */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Scores</h4>
                          <div className="space-y-3">
                            {[
                              { label: 'Overall', value: interview.feedback.overallScore },
                              { label: 'Confidence', value: interview.feedback.confidenceScore },
                              { label: 'Communication', value: interview.feedback.communicationScore },
                              { label: 'Technical', value: interview.feedback.technicalScore },
                            ].map((score) => (
                              <div key={score.label}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-white/60">{score.label}</span>
                                  <span className="text-white">{score.value}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#FF4EC2] to-[#ff8ad8] rounded-full"
                                    style={{ width: `${score.value}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div>
                          <h4 className="text-white font-semibold mb-3">Strengths</h4>
                          <ul className="space-y-2 mb-4">
                            {interview.feedback.strengths.map((strength, i) => (
                              <li key={i} className="flex items-center gap-2 text-green-400 text-sm">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                {strength}
                              </li>
                            ))}
                          </ul>

                          <h4 className="text-white font-semibold mb-3">Areas to Improve</h4>
                          <ul className="space-y-2">
                            {interview.feedback.improvements.map((improvement, i) => (
                              <li key={i} className="flex items-center gap-2 text-orange-400 text-sm">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mt-4 p-4 bg-white/5 rounded-xl">
                        <p className="text-white/80 text-sm">{interview.feedback.summary}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" className="btn-secondary text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
