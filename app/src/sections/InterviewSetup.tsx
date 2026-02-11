import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Code,
  Zap,
  Theater,
  Users,
  ArrowLeft,
  Clock,
  Loader2
} from 'lucide-react';
import type { InterviewType, DifficultyLevel } from '@/types';

const interviewTypes: { id: InterviewType; label: string; icon: React.ElementType; description: string; duration: string }[] = [
  {
    id: 'behavioral',
    label: 'Behavioral Round',
    icon: MessageSquare,
    description: '"Tell me about a time..." questions with follow-ups',
    duration: '3-5 min'
  },
  {
    id: 'technical',
    label: 'Technical Round',
    icon: Code,
    description: 'Domain-specific technical questions',
    duration: '5-7 min'
  },
  {
    id: 'rapid_fire',
    label: 'Rapid Fire',
    icon: Zap,
    description: 'Quick Q&A to build speed and clarity',
    duration: '2-3 min'
  },
  {
    id: 'situational',
    label: 'Situational Questions',
    icon: Theater,
    description: 'Handle pressure, conflict, and deadlines',
    duration: '4-6 min'
  },
  {
    id: 'hr_basics',
    label: 'HR Basics',
    icon: Users,
    description: 'Salary, relocation, and career goals',
    duration: '3-4 min'
  },
];

const difficultyLevels: { id: DifficultyLevel; label: string; description: string; color: string }[] = [
  {
    id: 'easy',
    label: 'Easy',
    description: 'Fundamental questions to build confidence',
    color: 'bg-green-500'
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Standard interview difficulty',
    color: 'bg-yellow-500'
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'Challenging questions for experts',
    color: 'bg-red-500'
  },
];

export function InterviewSetup() {
  const { setInterviewConfig, startInterview, setShowInterviewSetup, user } = useAppState();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!selectedType) return;

    setIsLoading(true);

    // Create interview config
    const typeConfig = interviewTypes.find(t => t.id === selectedType);
    const newConfig = {
      type: selectedType,
      difficulty: selectedDifficulty,
      mode: 'normal' as const,
      duration: typeConfig ? parseInt(typeConfig.duration) : 5,
    };

    // Update state for consistency
    setInterviewConfig(newConfig);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsLoading(false);
    setShowInterviewSetup(false);

    // Start interview immediately with the config
    startInterview(newConfig);
  };

  return (
    <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4 py-20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full gradient-blob opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full gradient-blob opacity-15" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Back button */}
        <button
          onClick={() => setShowInterviewSetup(false)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎤</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-display font-bold mb-2">
            Start Micro Interview
          </h1>
          <p className="text-white/60">
            Choose your interview type and difficulty level
          </p>
        </div>

        {/* Interview Types */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-4">Select Interview Type</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 ${isSelected
                      ? 'border-[#FF4EC2] bg-[#FF4EC2]/10'
                      : 'border-white/10 bg-[#4B2086] hover:border-white/30'
                    }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-[#FF4EC2]' : 'bg-white/10'
                      }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <Clock className="w-3 h-3" />
                      {type.duration}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{type.label}</h3>
                  <p className="text-white/50 text-xs">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h2 className="text-white font-semibold mb-4">Select Difficulty</h2>
          <div className="flex gap-3">
            {difficultyLevels.map((level) => {
              const isSelected = selectedDifficulty === level.id;

              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all duration-300 ${isSelected
                      ? 'border-[#FF4EC2] bg-[#FF4EC2]/10'
                      : 'border-white/10 bg-[#4B2086] hover:border-white/30'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <span className="text-white font-semibold">{level.label}</span>
                  </div>
                  <p className="text-white/50 text-xs">{level.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleStart}
            disabled={!selectedType || isLoading}
            className="btn-primary px-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Preparing interview...
              </>
            ) : (
              <>
                Start Interview
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <p className="text-center text-white/40 text-sm mt-6">
          Free plan: {user?.plan === 'freemium' ? '5' : 'Unlimited'} micro interviews per day
        </p>
      </div>
    </div>
  );
}
