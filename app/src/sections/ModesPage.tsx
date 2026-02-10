import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  Clock,
  AlertTriangle,
  Volume2,
  Play,
  Info
} from 'lucide-react';

const modes = [
  {
    id: 'stress',
    name: 'Stress Mode',
    icon: Zap,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    description: 'Experience time pressure and sudden follow-ups that test your ability to think on your feet.',
    features: [
      'Countdown timer for each question',
      'Unexpected follow-up questions',
      'Reduced thinking time',
      'Performance under pressure analysis',
    ],
    difficulty: 'Hard',
    duration: '5-7 min',
  },
  {
    id: 'distraction',
    name: 'Distraction Mode',
    icon: Target,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/20',
    description: 'Practice maintaining focus while dealing with interruptions and background noise.',
    features: [
      'Simulated background noise',
      'Random interruptions during answers',
      'Focus recovery tracking',
      'Concentration score',
    ],
    difficulty: 'Medium',
    duration: '4-6 min',
  },
];

export function ModesPage() {
  const { navigateTo, user } = useAppState();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const canAccessModes = user?.plan === 'advanced' || user?.plan === 'full';

  if (!canAccessModes) {
    return (
      <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4">
        <div className="card-violet p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-[#FF4EC2]" />
          </div>
          <h2 className="text-2xl text-white font-display font-bold mb-4">
            Upgrade to Access Advanced Modes
          </h2>
          <p className="text-white/60 mb-6">
            Stress Mode and Distraction Mode are available with the Advanced Practice plan.
          </p>
          <Button onClick={() => navigateTo('pro')} className="btn-primary">
            View Plans
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl text-white font-display font-bold">Advanced Modes</h1>
            <p className="text-white/60">Push your limits with challenging practice modes</p>
          </div>
        </div>

        {/* Mode Cards */}
        <div className="space-y-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;

            return (
              <div 
                key={mode.id}
                className={`card-violet overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-[#FF4EC2]' : ''}`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Icon */}
                    <div className={`w-20 h-20 ${mode.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-10 h-10 text-transparent bg-gradient-to-br ${mode.color} bg-clip-text`} style={{ color: mode.id === 'stress' ? '#ef4444' : '#eab308' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl text-white font-semibold">{mode.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          mode.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {mode.difficulty}
                        </span>
                      </div>
                      <p className="text-white/60 mb-4">{mode.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mode.features.map((feature, i) => (
                          <span key={i} className="flex items-center gap-1 text-white/50 text-sm bg-white/5 px-3 py-1 rounded-full">
                            <Info className="w-3 h-3" />
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-white/40 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {mode.duration}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button 
                      onClick={() => setSelectedMode(isSelected ? null : mode.id)}
                      className={isSelected ? 'btn-primary' : 'btn-secondary'}
                    >
                      {isSelected ? 'Selected' : 'Select Mode'}
                    </Button>
                  </div>
                </div>

                {/* Expanded Settings */}
                {isSelected && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-4">
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold">Mode Settings</span>
                      </div>
                      <p className="text-white/60 text-sm">
                        This mode will simulate a high-pressure environment. You&apos;ll have limited time 
                        to answer and may face unexpected interruptions.
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Start {mode.name}
                      </Button>
                      <Button variant="outline" className="btn-secondary">
                        <Volume2 className="w-4 h-4 mr-2" />
                        Preview Audio
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 card-violet p-6">
          <h3 className="text-white font-semibold mb-4">Tips for Advanced Modes</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Take a deep breath before starting',
              'Focus on the question, not the pressure',
              'It\'s okay to pause and think',
              'Practice regular mode first',
              'Use these modes sparingly',
              'Review your performance after each session',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#FF4EC2] text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-white/60 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
