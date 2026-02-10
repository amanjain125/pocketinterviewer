import { useState, useRef } from 'react';
import { useAppState } from '@/hooks/useAppState';
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
  ChevronRight
} from 'lucide-react';

const rounds = [
  { id: 'introduction', name: 'Introduction', duration: '3-5 min', icon: '👋' },
  { id: 'project', name: 'Project Round', duration: '5-7 min', icon: '💼' },
  { id: 'technical', name: 'Technical Round', duration: '7-10 min', icon: '💻' },
  { id: 'behavioral', name: 'Behavioral Round', duration: '5-7 min', icon: '🗣️' },
  { id: 'rapid_fire', name: 'Rapid Fire', duration: '3-5 min', icon: '⚡' },
  { id: 'closing', name: 'Closing Round', duration: '2-3 min', icon: '🎯' },
];

export function FullInterviewPage() {
  const { navigateTo, user, currentResume, setResume } = useAppState();
  const [step, setStep] = useState<'upload' | 'review' | 'interview' | 'complete'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload and analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadedFile(file);
    setResume({
      id: '1',
      userId: user?.id || '',
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      uploadedAt: new Date(),
      parsedContent: {
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Machine Learning'],
        projects: [
          { name: 'E-commerce Platform', description: 'Full-stack web application', technologies: ['React', 'Node.js', 'MongoDB'] },
          { name: 'AI Chatbot', description: 'Conversational AI assistant', technologies: ['Python', 'TensorFlow', 'NLP'] },
        ],
        experience: [
          { company: 'Tech Corp', role: 'Software Engineer', duration: '2022-Present', description: 'Full-stack development' },
        ],
        education: [
          { institution: 'University of Technology', degree: 'Bachelor', field: 'Computer Science', year: '2022' },
        ],
      },
    });
    
    setIsUploading(false);
    setStep('review');
  };

  const startInterview = () => {
    setStep('interview');
  };

  const nextRound = () => {
    if (currentRound < rounds.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setStep('complete');
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
              <div className="flex items-center gap-2 text-white/60">
                <Clock className="w-4 h-4" />
                <span>{round.duration}</span>
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
            </div>
            <p className="text-white text-lg leading-relaxed">
              {currentRound === 0 && "Tell me about yourself and walk me through your background."}
              {currentRound === 1 && "Can you describe your E-commerce Platform project in detail? What was your specific role and what technologies did you use?"}
              {currentRound === 2 && "Explain how you would design a scalable notification system. What considerations would you keep in mind?"}
              {currentRound === 3 && "Tell me about a time when you had to learn a new technology quickly. How did you approach it?"}
              {currentRound === 4 && "What's your greatest strength? What's your biggest weakness?"}
              {currentRound === 5 && "Do you have any questions for us?"}
            </p>
          </div>

          {/* Answer Controls */}
          <div className="card-violet p-6">
            <div className="flex items-center justify-center gap-4">
              <Button className="btn-primary px-8">
                <Mic className="w-5 h-5 mr-2" />
                Answer
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentRound(Math.max(0, currentRound - 1))}
              disabled={currentRound === 0}
              className="btn-secondary"
            >
              Previous Round
            </Button>
            <Button onClick={nextRound} className="btn-primary">
              {currentRound < rounds.length - 1 ? 'Next Round' : 'Finish Interview'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
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
