import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Building2, 
  Brain, 
  Cog, 
  Zap, 
  MoreHorizontal,
  ArrowRight,
  Loader2
} from 'lucide-react';
import type { Domain } from '@/types';

const domains: { id: Domain; label: string; icon: React.ElementType; description: string }[] = [
  { 
    id: 'computer_science', 
    label: 'Computer Science', 
    icon: Monitor,
    description: 'Software engineering, web dev, algorithms, system design'
  },
  { 
    id: 'civil', 
    label: 'Civil Engineering', 
    icon: Building2,
    description: 'Structural design, construction, project management'
  },
  { 
    id: 'ai_ml', 
    label: 'AI / ML', 
    icon: Brain,
    description: 'Machine learning, deep learning, data science'
  },
  { 
    id: 'mechanical', 
    label: 'Mechanical', 
    icon: Cog,
    description: 'Product design, manufacturing, thermodynamics'
  },
  { 
    id: 'electrical', 
    label: 'Electrical', 
    icon: Zap,
    description: 'Circuit design, power systems, electronics'
  },
  { 
    id: 'others', 
    label: 'Others', 
    icon: MoreHorizontal,
    description: 'Custom domain - specify your field'
  },
];

export function DomainSelect() {
  const { setDomain, user } = useAppState();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [customDomain, setCustomDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedDomain) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setDomain(selectedDomain);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#2B0B57] flex items-center justify-center px-4 py-20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full gradient-blob opacity-30" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full gradient-blob opacity-20" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl sm:text-4xl text-white font-display font-bold mb-3">
            Welcome, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            Select your domain so we can tailor interview questions to your field
          </p>
        </div>

        {/* Domain Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {domains.map((domain) => {
            const Icon = domain.icon;
            const isSelected = selectedDomain === domain.id;

            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#FF4EC2] bg-[#FF4EC2]/10'
                    : 'border-white/10 bg-[#4B2086] hover:border-white/30 hover:bg-[#4B2086]/80'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#FF4EC2]' : 'bg-white/10'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-[#FF4EC2] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold mb-1">{domain.label}</h3>
                <p className="text-white/50 text-sm">{domain.description}</p>
              </button>
            );
          })}
        </div>

        {/* Custom Domain Input */}
        {selectedDomain === 'others' && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-2">
            <label className="block text-white/80 text-sm mb-2">
              Specify your domain
            </label>
            <input
              type="text"
              placeholder="e.g., Finance, Marketing, Healthcare..."
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="w-full px-4 py-3 bg-[#4B2086] border border-white/10 text-white rounded-xl focus:border-[#FF4EC2] focus:ring-2 focus:ring-[#FF4EC2]/20 input-glow placeholder:text-white/40"
            />
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedDomain || isLoading || (selectedDomain === 'others' && !customDomain)}
            className="btn-primary px-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip option */}
        <p className="text-center text-white/40 text-sm mt-6">
          You can change this later in your profile settings
        </p>
      </div>
    </div>
  );
}
