import { useState, useRef, useEffect } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Crown,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Mic,
  Play,
  Pause,
  ChevronRight,
  MicOff,
  Volume2
} from 'lucide-react';

const rounds = [
  { id: 'introduction', name: 'Introduction', duration: '5 min', durationSeconds: 300, icon: '👋' },
  { id: 'project', name: 'Project Round', duration: '8 min', durationSeconds: 480, icon: '💼' },
  { id: 'technical', name: 'Technical Round', duration: '8 min', durationSeconds: 480, icon: '💻' },
  { id: 'behavioral', name: 'Behavioral Round', duration: '5 min', durationSeconds: 300, icon: '🗣️' },
  { id: 'rapid_fire', name: 'Rapid Fire', duration: '3 min', durationSeconds: 180, icon: '⚡' },
  { id: 'closing', name: 'Closing Round', duration: '1 min', durationSeconds: 60, icon: '🎯' },
];

export function FullInterviewPage() {
  const { navigateTo, user, currentResume, setResume } = useAppState();
  const [step, setStep] = useState<'upload' | 'review' | 'interview' | 'complete'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Array<{ question: string; answer: string; round: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech recognition
  const {
    transcript,
    finalTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const canAccessFull = user?.plan === 'full';

  if (!canAccessFull) {
    return (
      <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4">
        <div className="card-violet p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-[#FF4EC2]" />
          </div>
          <h2 className="text-2xl text-white font-display font-bold mb-4">
            Upgrade to Full Interview
          </h2>
          <p className="text-white/60 mb-6">
            Full Interview mode with resume analysis and multiple rounds is available with the Full Interview plan.
          </p>
          <Button onClick={() => navigateTo('pro')} className="btn-primary">
            View Plans
          </Button>
        </div>
      </div>
    );
  }

  // Generate question based on resume and round
  const generateQuestion = async (roundIndex: number, previousAnswer: string = '', isFirstQuestion: boolean = false) => {
    setIsGenerating(true);
    const round = rounds[roundIndex];
    let question = '';

    // Hardcoded logic for Introduction Round start
    if (round.id === 'introduction' && isFirstQuestion) {
      question = "Tell me about yourself and your background.";
      setCurrentQuestion(question);
      setQuestionHistory(prev => [...prev, question]);

      const utterance = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(utterance);
      setIsGenerating(false);
      return;
    }

    try {
      const prompt = `
        Generate a professional interview question for the "${round.name}" round.
        
        CANDIDATE CONTEXT:
        Skills: ${currentResume?.parsedContent?.skills.join(', ') || 'General'}
        Projects: ${currentResume?.parsedContent?.projects.map(p => p.name).join(', ') || 'None'}
        Experience: ${currentResume?.parsedContent?.experience.map(e => e.role).join(', ') || 'None'}
        
        PREVIOUS CONTEXT:
        Last Question: ${currentQuestion}
        Candidate Answer: ${previousAnswer}
        Question History (DO NOT REPEAT): ${questionHistory.join(' | ')}
        
        REQUIREMENTS:
        - Generate ONE specific, challenging question relevant to their background
        
        STRICT ROUND GUIDELINES:
        - If "Introduction": Ask ONLY about their background, education, or interest in the role. NO technical questions.
        - If "Project Round": Ask a question SPECIFICALLY about a project listed in CANDIDATE CONTEXT (e.g., "${currentResume?.parsedContent?.projects[0]?.name || 'a recent project'}"). Ask about challenges or implementation.
        - If "Technical Round": Ask a deep technical question about a skill listed in CANDIDATE CONTEXT (e.g., "${currentResume?.parsedContent?.skills[0] || 'your core stack'}"). Do NOT ask generic questions.
        - If "Behavioral Round": Ask ONLY STAR method scenario questions (conflict, challenge, etc.).
        - If "Rapid Fire": Ask short, quick technical questions (max 1 sentence).
        - If "Closing Round": Ask if they have questions or provide a closing remark.

        - Return ONLY the question text, no intro/outro.
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: prompt,
          stream: false
        })
      });

      const data = await response.json();
      const questionMatch = data.response.match(/[^.!?]+[.!?]/);
      question = questionMatch ? questionMatch[0] : `Tell me about your experience with ${currentResume?.parsedContent?.skills[0] || 'software development'}.`;

      setCurrentQuestion(question);
      setQuestionHistory(prev => [...prev, question]);

      // Auto-speak question
      const utterance = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('Error generating question:', error);
      setCurrentQuestion("Tell me about your background and experience.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let extractedText = '';

      // Extract text based on file type
      if (file.type === 'application/pdf') {
        const { extractTextFromPDF } = await import('@/utils/pdfUtils');
        extractedText = await extractTextFromPDF(file);
      } else {
        // Text based file
        extractedText = await file.text();
      }

      console.log('Extracted text length:', extractedText.length);
      console.log('Preview:', extractedText.substring(0, 100));

      if (!extractedText || extractedText.length < 50) {
        alert('Could not extract text from this file. Please try converting to a simple text PDF or .txt file.');
        throw new Error('Insufficient text extracted');
      }

      // Analyze with Ollama
      const analysisPrompt = `
        Analyze this resume text and extract the following information in JSON format:
        - skills (array of strings)
        - projects (array of objects with name, description, technologies)
        - experience (array of objects with company, role, duration, description)
        
        RESUME TEXT:
        ${extractedText.substring(0, 3000)} // Limit length for model
        
        Return ONLY valid JSON matching this structure:
        {
          "skills": ["skill1", "skill2"],
          "projects": [{"name": "...", "description": "...", "technologies": ["..."]}],
          "experience": [{"company": "...", "role": "...", "duration": "...", "description": "..."}]
        }
      `;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt: analysisPrompt,
          stream: false,
          options: { temperature: 0.2 }
        })
      });

      const data = await response.json();
      const jsonMatch = data.response.match(/\{[\s\S]*\}/);

      let parsedContent = {
        skills: [],
        projects: [],
        experience: [],
        education: []
      };

      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }

      setUploadedFile(file);
      setResume({
        id: Date.now().toString(),
        userId: user?.id || '',
        fileUrl: URL.createObjectURL(file), // Create temporary URL
        fileName: file.name,
        uploadedAt: new Date(),
        parsedContent: parsedContent
      });

      setStep('review');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      // Fallback for demo/error
      setResume({
        id: '1',
        userId: user?.id || '',
        fileUrl: '',
        fileName: file.name,
        uploadedAt: new Date(),
        parsedContent: {
          skills: ['Manual Entry Required'],
          projects: [],
          experience: [],
          education: []
        }
      });
      setStep('review');
    } finally {
      setIsUploading(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    let interval: any;

    if (step === 'interview' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    stopListening();
    setStep('interview');
    setCurrentRound(0);
    setTimeLeft(rounds[0].durationSeconds);
    setQuestionCount(1);
    setQuestionHistory([]);
    setAnswers([]);
    generateQuestion(0, '', true);
  };

  const saveInterview = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5000/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          config: { type: 'full', rounds: rounds },
          questions: answers.map((a, i) => ({ id: i.toString(), text: a.question, type: 'text' })),
          answers: answers.map((a, i) => ({ questionId: i.toString(), text: a.answer, timestamp: new Date() })),
          feedback: { overallScore: 0, summary: 'Pending Analysis' }, // Placeholder for now
          type: 'full'
        })
      });

      if (!response.ok) throw new Error('Failed to save interview');
      console.log('Interview saved successfully');
    } catch (error) {
      console.error('Error saving interview:', error);
    }
  };

  const nextRound = () => {
    stopListening();
    if (currentRound < rounds.length - 1) {
      const next = currentRound + 1;
      setCurrentRound(next);
      setTimeLeft(rounds[next].durationSeconds);
      setQuestionCount(1);
      setQuestionHistory([]);
      generateQuestion(next, finalTranscript);
      resetTranscript();
    } else {
      saveInterview();
      setStep('complete');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      handleAnswerComplete();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleAnswerComplete = async () => {
    // Wait for final transcript processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save answer
    if (finalTranscript) {
      setAnswers(prev => [...prev, {
        question: currentQuestion,
        answer: finalTranscript,
        round: rounds[currentRound].name
      }]);
    }

    // Auto-generate next question if under limit (3)
    if (questionCount < 3) {
      setQuestionCount(prev => prev + 1);
      generateQuestion(currentRound, finalTranscript);
    }
  };

  // Upload Step
  if (step === 'upload') {
    return (
      <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigateTo('dashboard')}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl text-white font-display font-bold">Full Interview</h1>
              <p className="text-white/60">30-minute comprehensive interview experience</p>
            </div>
          </div>

          {/* Upload Card */}
          <div className="card-violet p-8 text-center">
            <div className="w-20 h-20 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-[#FF4EC2]" />
            </div>

            <h2 className="text-2xl text-white font-semibold mb-4">
              Upload Your Resume
            </h2>
            <p className="text-white/60 mb-8">
              Our AI will analyze your resume and generate personalized questions based on your experience, skills, and projects.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-primary"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Select Resume (PDF/DOC)
                </>
              )}
            </Button>

            <p className="text-white/40 text-sm mt-4">
              Supported formats: PDF, DOC, DOCX • Max size: 5MB
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🤖', title: 'AI Analysis', desc: 'Resume parsing & insights' },
              { icon: '🎯', title: 'Personalized', desc: 'Questions tailored to you' },
              { icon: '📊', title: 'Detailed Feedback', desc: 'Round-by-round analysis' },
            ].map((item, i) => (
              <div key={i} className="card-violet p-4 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="text-white font-medium text-sm">{item.title}</h4>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Review Step
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setStep('upload')}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl text-white font-display font-bold">Resume Review</h1>
              <p className="text-white/60">Verify the extracted information</p>
            </div>
          </div>

          {/* Resume Analysis */}
          <div className="card-violet p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Resume Analyzed</h3>
                <p className="text-white/50 text-sm">{uploadedFile?.name}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Skills */}
              <div>
                <h4 className="text-white/60 text-sm mb-2">Skills Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {currentResume?.parsedContent?.skills.map((skill, i) => (
                    <span key={i} className="bg-[#FF4EC2]/20 text-[#FF4EC2] px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-white/60 text-sm mb-2">Projects</h4>
                <div className="space-y-2">
                  {currentResume?.parsedContent?.projects.map((project, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <p className="text-white font-medium">{project.name}</p>
                      <p className="text-white/50 text-sm">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-white/60 text-sm mb-2">Experience</h4>
                {currentResume?.parsedContent?.experience.map((exp, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white font-medium">{exp.role} at {exp.company}</p>
                    <p className="text-white/50 text-sm">{exp.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Rounds */}
          <div className="card-violet p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Interview Rounds</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {rounds.map((round, i) => (
                <div key={round.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  <span className="text-2xl">{round.icon}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{round.name}</p>
                    <p className="text-white/50 text-xs">{round.duration}</p>
                  </div>
                  <span className="text-white/30 text-xs">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={startInterview} className="w-full btn-primary">
            <Play className="w-5 h-5 mr-2" />
            Start Full Interview
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Interview Step
  if (step === 'interview') {
    const round = rounds[currentRound];

    return (
      <div className="min-h-screen bg-[#2B0B57] pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="card-violet p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{round.icon}</span>
                <div>
                  <h2 className="text-white font-semibold">{round.name}</h2>
                  <p className="text-white/50 text-sm">Round {currentRound + 1} of {rounds.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-white">
                    Question {questionCount} <span className="text-white/40">/ 3+</span>
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-[#FF4EC2]' : ''}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF4EC2] to-[#ff8ad8] rounded-full transition-all duration-500"
                style={{ width: `${((currentRound + 1) / rounds.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="card-violet p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#FF4EC2]" />
              </div>
              <span className="text-white/60 text-sm">AI Interviewer</span>
              <button
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(currentQuestion);
                  window.speechSynthesis.speak(utterance);
                }}
                className="ml-auto text-[#FF4EC2] hover:text-[#ff6fd1] transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white text-lg leading-relaxed">
              {isGenerating ? "Generating relevant question..." : currentQuestion}
            </p>
          </div>

          {/* Answer Controls */}
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

            <div className="flex items-center justify-center gap-4">
              <Button
                className={isListening ? 'bg-red-500 hover:bg-red-600' : 'btn-primary px-8'}
                onClick={toggleListening}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Answer
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentRound(Math.max(0, currentRound - 1))}
                disabled={currentRound === 0}
                className="btn-secondary"
              >
                Previous Round
              </Button>
              <Button
                onClick={nextRound}
                className={`btn-primary ${questionCount < 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={questionCount < 3}
              >
                {currentRound < rounds.length - 1 ? 'Next Round' : 'Finish Interview'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            {questionCount < 3 && (
              <p className="text-white/30 text-xs text-center">
                Please answer at least {3 - questionCount} more question{questionCount !== 2 ? 's' : ''} to proceed
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Complete Step
  return (
    <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4">
      <div className="card-violet p-8 text-center max-w-md">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl text-white font-display font-bold mb-4">
          Interview Complete!
        </h2>
        <p className="text-white/60 mb-6">
          Great job completing the full interview! Your detailed feedback report is being generated.
        </p>
        <div className="space-y-3">
          <Button onClick={() => navigateTo('progress')} className="w-full btn-primary">
            View Detailed Feedback
          </Button>
          <Button onClick={() => setStep('upload')} variant="outline" className="w-full btn-secondary">
            Start New Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
