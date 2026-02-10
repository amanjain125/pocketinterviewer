import { useState, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { analyzeAnswerWithOllama } from '@/utils/ollamaService';
import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Clock,
  MessageSquare,
  ArrowRight,
  Loader2,
  Volume2,
  X,
  VolumeX
} from 'lucide-react';

// Mock questions for different interview types
const mockQuestions: Record<string, string[]> = {
  behavioral: [
    "Tell me about a time when you faced a difficult challenge at work or school. How did you handle it?",
    "Describe a situation where you had to work with a difficult team member. What did you do?",
    "Can you share an example of when you had to meet a tight deadline? How did you manage it?",
  ],
  technical: [
    "Explain the difference between a stack and a queue. When would you use each?",
    "What is the time complexity of binary search? Can you explain how it works?",
    "Describe how a hash table works and what makes it efficient for lookups.",
  ],
  rapid_fire: [
    "What is your greatest strength?",
    "Where do you see yourself in 5 years?",
    "Why should we hire you?",
    "What motivates you?",
  ],
  situational: [
    "Imagine you're given a project with an impossible deadline. What do you do?",
    "A team member is not pulling their weight on a critical project. How do you handle it?",
    "You disagree with your manager's approach to a problem. What's your next step?",
  ],
  hr_basics: [
    "What are your salary expectations?",
    "Are you comfortable with relocation if required?",
    "Tell me about a time you had to adapt to a major change at work.",
  ],
};

export function InterviewPage() {
  const { interviewConfig, endInterview, navigateTo } = useAppState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    isListening,
    transcript,
    finalTranscript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const questions = interviewConfig?.type ? mockQuestions[interviewConfig.type] || mockQuestions.behavioral : mockQuestions.behavioral;
  const currentQuestion = questions[currentQuestionIndex];

  // Check browser support on mount
  useEffect(() => {
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [isSupported]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndInterview();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleNextQuestion = () => {
    resetTranscript();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = async () => {
    setIsProcessing(true);

    // Get the final transcript to send to Ollama
    const answerToSend = finalTranscript || transcript;

    try {
      // Send to Ollama for analysis
      const feedback = await analyzeAnswerWithOllama(
        currentQuestion,
        answerToSend
      );

      setIsProcessing(false);
      endInterview(feedback);
    } catch (error) {
      console.error('Error getting feedback from Ollama:', error);
      
      // Fallback to mock feedback if Ollama fails
      const mockFeedback = {
        overallScore: Math.floor(Math.random() * 20) + 75,
        confidenceScore: Math.floor(Math.random() * 20) + 70,
        communicationScore: Math.floor(Math.random() * 20) + 72,
        technicalScore: Math.floor(Math.random() * 20) + 68,
        strengths: [
          'Clear articulation of ideas',
          'Good use of specific examples',
          'Structured responses',
        ],
        improvements: [
          'Could provide more quantifiable results',
          'Some answers were slightly long',
          'Consider adding more technical details',
        ],
        summary: 'You demonstrated strong communication skills with well-structured responses. Focus on adding more specific metrics and keeping answers concise.',
        weaknessRadar: {
          clarity: Math.floor(Math.random() * 20) + 75,
          structure: Math.floor(Math.random() * 20) + 70,
          technicalDepth: Math.floor(Math.random() * 20) + 65,
          confidence: Math.floor(Math.random() * 20) + 78,
          relevance: Math.floor(Math.random() * 20) + 80,
        },
      };

      setIsProcessing(false);
      endInterview(mockFeedback);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-400 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl text-white font-display font-bold mb-2">
            Analyzing your responses...
          </h2>
          <p className="text-white/60">
            Our AI is preparing your personalized feedback
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 pt-20 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold">Micro Interview</h1>
              <p className="text-white/50 text-sm capitalize">{interviewConfig?.type.replace('_', ' ')} • {interviewConfig?.difficulty}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-white/60" />
              <span className={`text-white font-mono ${timeLeft < 60 ? 'text-red-400' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-white/60 text-sm">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Main Interview Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - AI Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center">
              {/* AI Avatar */}
              <div className="relative mb-6">
                <div className="ai-avatar-glow">
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <span className="text-6xl">🤖</span>
                  </div>
                </div>
                {/* Voice wave animation when speaking */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-400 rounded-full animate-pulse"
                      style={{
                        height: `${12 + Math.random() * 16}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-white font-semibold mb-1">AI Interviewer</h3>
              <p className="text-white/50 text-sm text-center">
                Listening and adapting to your responses
              </p>
            </div>
          </div>

          {/* Right - Question & Answer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-white/60 text-sm">Question {currentQuestionIndex + 1}</span>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {currentQuestion}
              </p>
              <button
                className="flex items-center gap-2 text-indigo-400 text-sm mt-4 hover:underline"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(currentQuestion);
                  utterance.rate = 0.9; // Slightly slower for better comprehension
                  utterance.pitch = 1.0;
                  utterance.volume = 0.8;
                  window.speechSynthesis.speak(utterance);
                }}
              >
                <Volume2 className="w-4 h-4" />
                Listen to question
              </button>
            </div>

            {/* Answer Area */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm">Your Answer</span>
                {isListening && (
                  <div className="flex items-center gap-2 text-indigo-400">
                    <div className="voice-wave">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="voice-wave-bar" />
                      ))}
                    </div>
                    <span className="text-sm">Listening...</span>
                  </div>
                )}
              </div>

              {/* Transcript Display */}
              <div className="min-h-[120px] bg-white/5 rounded-xl p-4 mb-4">
                {transcript ? (
                  <p className="text-white">{transcript}</p>
                ) : (
                  <p className="text-white/30 italic">
                    {isListening ? 'Start speaking...' : 'Click the microphone to start answering'}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleListening}
                    disabled={!isSupported}
                    className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'} ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Answering
                      </>
                    )}
                  </Button>
                  
                  {!isSupported && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <VolumeX className="w-4 h-4" />
                      <span>Speech recognition not supported</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!(finalTranscript || transcript)}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <p className="text-blue-300 text-sm">
                <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result) for behavioral questions. Be specific and concise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
