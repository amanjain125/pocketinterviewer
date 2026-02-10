import { useState, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Users,
  Mic,
  MicOff,
  MessageSquare,
  Play,
  Info,
  Volume2
} from 'lucide-react';

// Define the three AI interviewers
const panelInterviewers = [
  {
    id: 'lead',
    name: 'Sarah',
    role: 'Lead Interviewer',
    description: 'Asks main questions and guides the interview flow',
    personality: 'Professional and thorough',
    avatar: '👩‍💼',
    color: 'from-blue-500 to-cyan-500',
    behavior: 'main' // Main interviewer asks primary questions
  },
  {
    id: 'interruptor',
    name: 'Mike',
    role: 'The Challenger',
    description: 'Throws curveballs and challenges your answers',
    personality: 'Direct and probing',
    avatar: '👨‍💼',
    color: 'from-red-500 to-orange-500',
    behavior: 'interrupt' // Interrupts during answers
  },
  {
    id: 'observer',
    name: 'Lisa',
    role: 'The Observer',
    description: 'Listens carefully and asks follow-up questions',
    personality: 'Analytical and detail-oriented',
    avatar: '👩‍💻',
    color: 'from-green-500 to-emerald-500',
    behavior: 'observe' // Observes and asks clarifying questions
  },
];

export function PanelPage() {
  const { navigateTo, user, interviewConfig } = useAppState();

  // Speech recognition hooks
  const {
    transcript,
    finalTranscript,
    isListening: isRecording,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState('lead');
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'active' | 'feedback'>('intro');
  const [interruptions, setInterruptions] = useState<{ timestamp: number, message: string, interviewerId: string }[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<{ question: string, answer: string, interviewerId: string }[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canAccessPanel = user?.plan === 'full';

  if (!canAccessPanel) {
    return (
      <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4">
        <div className="card-violet p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[#FF4EC2]" />
          </div>
          <h2 className="text-2xl text-white font-display font-bold mb-4">
            Upgrade to Access Panel Mode
          </h2>
          <p className="text-white/60 mb-6">
            Panel Interviewer mode is available with the Full Interview plan.
          </p>
          <Button onClick={() => navigateTo('pro')} className="btn-primary">
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  // Initialize the panel interview
  const startPanelInterview = async () => {
    setInterviewPhase('active');

    // Generate initial question using Ollama
    try {
      const questionPrompt = `
        Generate a professional interview question appropriate for ${interviewConfig?.type || 'behavioral'} interviews.
        Consider the difficulty level: ${interviewConfig?.difficulty || 'medium'}.
        Return only the question without any additional text.
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: questionPrompt,
          stream: false
        })
      });

      const data = await response.json();
      // Extract just the question from the response
      const questionMatch = data.response.match(/[^.!?]+[.!?]/);
      const question = questionMatch ? questionMatch[0] : "Tell me about a time when you faced a significant challenge at work or school.";

      setCurrentQuestion(question);
      setCurrentSpeaker('lead');
    } catch (error) {
      console.error('Error generating question with Ollama:', error);
      // Fallback question
      setCurrentQuestion("Tell me about a time when you faced a significant challenge at work or school.");
      setCurrentSpeaker('lead');
    }
  };

  // Handle interruptions from the interrupter
  useEffect(() => {
    if (interviewPhase === 'active' && isListening && currentSpeaker === 'lead') {
      // Set up interruption timer - check frequently
      const interruptionTimer = setInterval(() => {
        // 20% chance to interrupt every 4 seconds if user has spoken enough
        if (Math.random() > 0.8 && transcript.length > 50) {
          const interrupter = panelInterviewers.find(i => i.behavior === 'interrupt');
          if (interrupter) {
            const interruptionMessages = [
              "Excuse me, can you be more specific about that?",
              "I need more details on how exactly you handled that.",
              "That's interesting, but can you quantify your results?",
              "Hold on, I have a follow-up question about that.",
              "Can you elaborate on the impact of your decision?",
              "I'm not sure I understand, can you explain differently?"
            ];

            const randomMessage = interruptionMessages[Math.floor(Math.random() * interruptionMessages.length)];

            // Add interruption to history
            setInterruptions(prev => [...prev, {
              timestamp: Date.now(),
              message: randomMessage,
              interviewerId: interrupter.id
            }]);

            // Switch to interrupter temporarily
            setCurrentSpeaker(interrupter.id);

            // Play the interruption message using text-to-speech
            const utterance = new SpeechSynthesisUtterance(randomMessage);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);

            // Switch back to lead after a moment
            setTimeout(() => {
              setCurrentSpeaker('lead');
            }, 3000);
          }
        }
      }, 4000); // Check every 4 seconds

      return () => clearInterval(interruptionTimer);
    }
  }, [interviewPhase, isListening, currentSpeaker, transcript]);

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);

      // Add the question and answer to history
      if (finalTranscript) {
        setInterviewHistory(prev => [...prev, {
          question: currentQuestion,
          answer: finalTranscript,
          interviewerId: currentSpeaker
        }]);
      }

      // Decide who speaks next
      setTimeout(() => {
        const randomChance = Math.random();

        // 30% chance for Observer to ask a follow-up (if not already Observer)
        if (randomChance > 0.7 && currentSpeaker !== 'observer') {
          generateFollowUpQuestion();
        }
        // Otherwise, back to Lead (Sarah) or continue with Lead
        else {
          setCurrentSpeaker('lead');
          generateNewQuestion();
        }
      }, 2000);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  // Generate a follow-up question from the Observer
  const generateFollowUpQuestion = async () => {
    try {
      const observer = panelInterviewers.find(i => i.behavior === 'observe');
      if (!observer) return;

      setCurrentSpeaker(observer.id);

      const followUpPrompt = `
        Based on this answer: "${finalTranscript}", generate a short clarifying follow-up question.
        The question should seek more specific details or ask for examples.
        Return only the question without any intro text.
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: followUpPrompt,
          stream: false
        })
      });

      const data = await response.json();
      const questionMatch = data.response.match(/[^.!?]+[.!?]/);
      const followUpQuestion = questionMatch ? questionMatch[0] : "Can you provide a specific example of that?";

      setCurrentQuestion(followUpQuestion);

      // Play speech
      const utterance = new SpeechSynthesisUtterance(followUpQuestion);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error generating follow-up:', error);
      setCurrentQuestion("Can you provide a specific example of that?");
    }
  };

  // Generate a new question when moving to next
  const generateNewQuestion = async () => {
    try {
      const questionPrompt = `
        Generate a professional interview question appropriate for ${interviewConfig?.type || 'behavioral'} interviews.
        Consider the difficulty level: ${interviewConfig?.difficulty || 'medium'}.
        Based on the previous question: "${currentQuestion}" and answer: "${finalTranscript || 'N/A'}",
        generate a follow-up or new question that continues the interview flow.
        Return only the question without any additional text.
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: questionPrompt,
          stream: false
        })
      });

      const data = await response.json();
      // Extract just the question from the response
      const questionMatch = data.response.match(/[^.!?]+[.!?]/);
      const question = questionMatch ? questionMatch[0] : "Tell me about another example of when you demonstrated leadership.";

      setCurrentQuestion(question);

      // Play speech for lead interviewer too
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error generating question with Ollama:', error);
      // Fallback question
      setCurrentQuestion("Tell me about another example of when you demonstrated leadership.");
    }
  };

  // End the panel interview and generate feedback
  const endPanelInterview = async () => {
    setIsProcessing(true);

    try {
      // Log for debugging
      console.log('=== GENERATING FEEDBACK ===');
      console.log('Interview Q&A count:', interviewHistory.length);
      console.log('Interview data:', interviewHistory);

      // Build detailed Q&A text
      const qaText = interviewHistory.map((item, idx) =>
        `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer || 'No answer'}`
      ).join('\n\n');

      // Generate comprehensive feedback using Ollama
      const feedbackPrompt = `Analyze this panel interview. Provide specific feedback based on the ACTUAL answers given.

INTERVIEW TRANSCRIPT:
${qaText}

Context: ${interruptions.length} interruptions occurred
Recent answer: ${finalTranscript || 'None'}

Respond with ONLY valid JSON (no extra text):
{
  "overallScore": number,
  "confidenceScore": number,
  "communicationScore": number,
  "technicalScore": number,
  "strengths": ["specific strength", "another"],
  "improvements": ["specific improvement", "another"],
  "summary": "2-3 sentences about their performance",
  "weaknessRadar": {
    "clarity": number,
    "structure": number,
    "technicalDepth": number,
    "confidence": number,
    "relevance": number
  },
  "interviewerFeedback": {
    "lead": "feedback on main answers",
    "interrupter": "feedback on handling pressure",
    "observer": "feedback on details"
  }
}`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: feedbackPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 500
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Ollama response:', data);

      // Extract feedback from response
      try {
        const jsonString = data.response.match(/\{[\s\S]*\}/)?.[0];
        if (jsonString) {
          const parsedFeedback = JSON.parse(jsonString);
          console.log('✅ Successfully parsed AI feedback:', parsedFeedback);
          setFeedback(parsedFeedback);
          setInterviewPhase('feedback');
        } else {
          console.warn('⚠️ No JSON in response:', data.response);
          throw new Error('No JSON found in Ollama response');
        }
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        console.log('Raw response:', data.response);
        throw parseError;
      }
    } catch (error: any) {
      console.error('❌ Feedback generation error:', error);

      const isConnectionError = error.message && (
        error.message.includes('fetch') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('refused')
      );

      // Show helpful error in feedback
      setFeedback({
        overallScore: 0,
        confidenceScore: 0,
        communicationScore: 0,
        technicalScore: 0,
        strengths: ["Interview completed"],
        improvements: isConnectionError
          ? ["Install and run Ollama for AI feedback"]
          : ["Check browser console for error details"],
        summary: isConnectionError
          ? "⚠️ OLLAMA NOT RUNNING - Install from ollama.ai, run 'ollama pull llama3.2:3b', then 'ollama serve'. Open browser console (F12) for more details."
          : `⚠️ Error: ${error.message}. Check browser console (F12) for details.`,
        weaknessRadar: {
          clarity: 0,
          structure: 0,
          technicalDepth: 0,
          confidence: 0,
          relevance: 0
        },
        interviewerFeedback: {
          lead: "❌ AI feedback unavailable - see summary above",
          interrupter: "❌ AI feedback unavailable - see summary above",
          observer: "❌ AI feedback unavailable - see summary above"
        }
      });
      setInterviewPhase('feedback');
    }

    setIsProcessing(false);
  };

  if (interviewPhase === 'intro') {
    return (
      <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl text-white font-display font-bold">Panel Interviewer</h1>
              <p className="text-white/60">Experience a real panel interview dynamic</p>
            </div>
          </div>

          {/* Interviewers Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {panelInterviewers.map((interviewer) => (
              <div key={interviewer.id} className="card-violet p-6 text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${interviewer.color} flex items-center justify-center text-4xl`}>
                  {interviewer.avatar}
                </div>
                <h3 className="text-white font-semibold mb-1">{interviewer.name}</h3>
                <p className="text-[#FF4EC2] text-sm mb-3">{interviewer.role}</p>
                <p className="text-white/60 text-sm mb-2">{interviewer.description}</p>
                <p className="text-white/40 text-xs italic">&ldquo;{interviewer.personality}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="card-violet p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-[#FF4EC2]" />
              <h3 className="text-white font-semibold">How Panel Mode Works</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Sarah (Lead) will guide the interview and ask primary questions',
                'Mike (Challenger) will interrupt with tough follow-ups and stress tests',
                'Lisa (Observer) will listen and ask clarifying questions',
                'Each interviewer provides individual feedback at the end',
                'You\'ll receive a combined assessment with specific insights',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60">
                  <span className="w-6 h-6 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center flex-shrink-0 text-[#FF4EC2] text-xs font-bold">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button onClick={startPanelInterview} className="btn-primary px-12">
              <Play className="w-5 h-5 mr-2" />
              Start Panel Interview
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (interviewPhase === 'feedback') {
    if (isProcessing) {
      return (
        <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FF4EC2]/30 border-t-[#FF4EC2] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl text-white font-display font-bold mb-2">
              Analyzing your panel interview...
            </h2>
            <p className="text-white/60">
              Our AI is preparing your personalized feedback
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#2B0B57] pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setInterviewPhase('active')}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-white font-semibold">Panel Interview Results</h1>
                <p className="text-white/50 text-sm">Feedback from all interviewers</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-white text-sm">Panel Complete</span>
            </div>
          </div>

          {/* Overall Feedback */}
          <div className="card-violet p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h2 className="text-2xl text-white font-display font-bold">Interview Summary</h2>
                <p className="text-white/60">Your performance across all interviewers</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {Object.entries(feedback?.weaknessRadar || {}).map(([skill, value]) => {
                const skillLabels: Record<string, string> = {
                  clarity: 'Clarity',
                  structure: 'Structure',
                  technicalDepth: 'Technical Depth',
                  confidence: 'Confidence',
                  relevance: 'Relevance'
                };

                return (
                  <div key={skill} className="text-center">
                    <div className="text-2xl font-bold text-white">{value}%</div>
                    <div className="text-white/60 text-sm">{skillLabels[skill] || skill}</div>
                  </div>
                );
              })}
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Overall Performance</h3>
              <p className="text-white/80">{feedback?.summary || 'No summary available'}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {(feedback?.strengths || []).map((strength: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-green-400">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {(feedback?.improvements || []).map((improvement: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-orange-400">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Individual Interviewer Feedback */}
          <div className="card-violet p-6">
            <h3 className="text-white font-semibold mb-6">Individual Interviewer Feedback</h3>
            <div className="space-y-6">
              {panelInterviewers.map((interviewer) => (
                <div key={interviewer.id} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${interviewer.color} flex items-center justify-center text-xl flex-shrink-0`}>
                    {interviewer.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{interviewer.name} ({interviewer.role})</h4>
                    <p className="text-white/80">{feedback?.interviewerFeedback?.[interviewer.id] || 'No specific feedback provided'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => {
                setInterviewPhase('intro');
                resetTranscript();
              }}
              className="btn-secondary flex-1"
            >
              Start New Interview
            </Button>
            <Button
              onClick={() => navigateTo('dashboard')}
              className="btn-primary flex-1"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setInterviewPhase('intro');
                resetTranscript();
              }}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold">Panel Interview</h1>
              <p className="text-white/50 text-sm">3 interviewers • Multi-perspective feedback</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-white text-sm">Panel Active</span>
          </div>
        </div>

        {/* Panel Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {panelInterviewers.map((interviewer) => {
            const isActive = currentSpeaker === interviewer.id;

            return (
              <div
                key={interviewer.id}
                className={`card-violet p-4 transition-all duration-300 ${isActive ? 'ring-2 ring-[#FF4EC2]' : 'opacity-70'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${interviewer.color} flex items-center justify-center text-2xl`}>
                    {interviewer.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{interviewer.name}</h3>
                    <p className="text-white/50 text-sm">{interviewer.role}</p>
                  </div>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="voice-wave">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="voice-wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Interview Area */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Question & Answer Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Current Question */}
            <div className="card-violet p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#FF4EC2]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">
                    Current Question from {panelInterviewers.find(i => i.id === currentSpeaker)?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(currentQuestion);
                    utterance.rate = 0.9;
                    utterance.pitch = 1.0;
                    window.speechSynthesis.speak(utterance);
                  }}
                  className="ml-auto text-[#FF4EC2] hover:text-[#ff6fd1] transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {currentQuestion}
              </p>
            </div>

            {/* Answer Area */}
            <div className="card-violet p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-sm">Your Answer</span>
                {isListening && (
                  <div className="flex items-center gap-2 text-[#FF4EC2]">
                    <div className="voice-wave">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="voice-wave-bar" />
                      ))}
                    </div>
                    <span className="text-sm">Listening...</span>
                  </div>
                )}
              </div>

              <div className="min-h-[100px] bg-white/5 rounded-xl p-4 mb-4">
                {transcript ? (
                  <p className="text-white">{transcript}</p>
                ) : (
                  <p className="text-white/30 italic">
                    {isListening ? 'Start speaking...' : 'Click the microphone to start answering'}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Button
                  onClick={toggleListening}
                  disabled={!isSupported}
                  className={isListening ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Answering
                    </>
                  )}
                </Button>

                <Button
                  onClick={endPanelInterview}
                  className="btn-secondary"
                >
                  End Interview
                </Button>
              </div>
            </div>

            {/* Interruptions */}
            {interruptions.length > 0 && (
              <div className="card-violet p-4">
                <h4 className="text-white font-semibold mb-3">Interruptions</h4>
                <div className="space-y-3">
                  {interruptions.slice(-3).map((interruption, i) => {
                    const interviewer = panelInterviewers.find(iv => iv.id === interruption.interviewerId);
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${interviewer?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-sm flex-shrink-0`}>
                          {interviewer?.avatar || '?'}
                        </div>
                        <div>
                          <p className="text-white/80 text-sm">
                            <span className="font-medium">{interviewer?.name || 'Interviewer'}:</span> {interruption.message}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {new Date(interruption.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-violet p-4">
              <h3 className="text-white font-semibold mb-3">Interview Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Questions Asked</span>
                  <span className="text-white">{interviewHistory.length + 1}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Current Speaker</span>
                  <span className="text-white">{panelInterviewers.find(i => i.id === currentSpeaker)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Interruptions</span>
                  <span className="text-white">{interruptions.length}</span>
                </div>
              </div>
            </div>

            <div className="card-violet p-4">
              <h3 className="text-white font-semibold mb-3">Active Interviewers</h3>
              <div className="space-y-2">
                {panelInterviewers.map((interviewer) => (
                  <div key={interviewer.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${currentSpeaker === interviewer.id ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                    <span className={currentSpeaker === interviewer.id ? 'text-white font-medium' : 'text-white/50'}>
                      {interviewer.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-violet p-4 bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                <strong>Tip:</strong> Address each interviewer by name when responding to their questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
