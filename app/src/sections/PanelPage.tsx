import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Users, 
  Mic, 
  MicOff,
  MessageSquare,
  User,
  Play,
  Info
} from 'lucide-react';

const interviewers = [
  {
    id: 'lead',
    name: 'Sarah',
    role: 'Lead Interviewer',
    description: 'Asks main questions and guides the interview flow',
    personality: 'Professional and thorough',
    avatar: '👩‍💼',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'interruptor',
    name: 'Mike',
    role: 'The Challenger',
    description: 'Throws curveballs and challenges your answers',
    personality: 'Direct and probing',
    avatar: '👨‍💼',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'observer',
    name: 'Lisa',
    role: 'The Observer',
    description: 'Listens carefully and asks follow-up questions',
    personality: 'Analytical and detail-oriented',
    avatar: '👩‍💻',
    color: 'from-green-500 to-emerald-500',
  },
];

export function PanelPage() {
  const { navigateTo, user } = useAppState();
  const [isListening, setIsListening] = useState(false);
  const [currentSpeaker] = useState('lead');
  const [showIntro, setShowIntro] = useState(true);

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

  if (showIntro) {
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
            {interviewers.map((interviewer) => (
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
            <Button onClick={() => setShowIntro(false)} className="btn-primary px-12">
              <Play className="w-5 h-5 mr-2" />
              Start Panel Interview
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
              onClick={() => setShowIntro(true)}
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold">Panel Interview</h1>
              <p className="text-white/50 text-sm">3 interviewers • 15-20 minutes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-white text-sm">Panel Active</span>
          </div>
        </div>

        {/* Panel Grid */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {interviewers.map((interviewer) => {
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
          {/* Question Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card-violet p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#FF4EC2]" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Current Question from {interviewers.find(i => i.id === currentSpeaker)?.name}</p>
                </div>
              </div>
              <p className="text-white text-lg leading-relaxed">
                Tell me about a time when you had to deal with a difficult team member. 
                How did you handle the situation and what was the outcome?
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
                <p className="text-white/30 italic">
                  {isListening ? 'Start speaking...' : 'Click the microphone to start answering'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setIsListening(!isListening)}
                  className={isListening ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'}
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

                <Button className="btn-secondary">
                  <User className="w-4 h-4 mr-2" />
                  Pass to Next
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card-violet p-4">
              <h3 className="text-white font-semibold mb-3">Interview Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Questions</span>
                  <span className="text-white">3 / 8</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF4EC2] rounded-full" style={{ width: '37.5%' }} />
                </div>
              </div>
            </div>

            <div className="card-violet p-4">
              <h3 className="text-white font-semibold mb-3">Active Interviewers</h3>
              <div className="space-y-2">
                {interviewers.map((interviewer) => (
                  <div key={interviewer.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${currentSpeaker === interviewer.id ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
                    <span className={currentSpeaker === interviewer.id ? 'text-white' : 'text-white/50'}>
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
