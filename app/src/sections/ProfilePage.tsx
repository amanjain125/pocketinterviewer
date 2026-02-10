import { useState } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Mail, 
  Briefcase,
  Target,
  Crown,
  Edit2,
  Save,
  X,
  CheckCircle2
} from 'lucide-react';

const domains = [
  { id: 'computer_science', label: 'Computer Science', icon: '💻' },
  { id: 'civil', label: 'Civil Engineering', icon: '🏗️' },
  { id: 'ai_ml', label: 'AI / ML', icon: '🧠' },
  { id: 'mechanical', label: 'Mechanical', icon: '⚙️' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'others', label: 'Others', icon: '🔧' },
];

export function ProfilePage() {
  const { user, navigateTo, setDomain } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(user?.domain || '');

  const getDomainLabel = (domainId: string) => {
    return domains.find(d => d.id === domainId)?.label || domainId;
  };

  const getDomainIcon = (domainId: string) => {
    return domains.find(d => d.id === domainId)?.icon || '🎯';
  };

  const getPlanDetails = (plan: string) => {
    const plans: Record<string, { name: string; color: string; features: string[] }> = {
      freemium: { 
        name: 'Freemium', 
        color: 'bg-white/20',
        features: ['5 micro interviews/day', 'Basic progress', 'Streaks']
      },
      advanced: { 
        name: 'Advanced Practice', 
        color: 'bg-[#FF4EC2]/30',
        features: ['Unlimited interviews', 'Stress & Distraction modes', 'Panel interviewer']
      },
      full: { 
        name: 'Full Interview', 
        color: 'bg-yellow-500/30',
        features: ['Everything in Advanced', '30-min full interviews', 'Resume analysis', '1-on-1 coaching']
      },
    };
    return plans[plan] || plans.freemium;
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API
    setIsEditing(false);
  };

  const handleDomainChange = () => {
    setDomain(selectedDomain as any);
    setShowDomainModal(false);
  };

  const planDetails = getPlanDetails(user?.plan || 'freemium');

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl text-white font-display font-bold">Your Profile</h1>
            <p className="text-white/60">Manage your account and preferences</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card-violet p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] rounded-2xl flex items-center justify-center text-3xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white w-48"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSaveProfile}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(user?.name || '');
                      }}
                      className="btn-secondary"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl text-white font-semibold">{user?.name}</h2>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-[#FF4EC2] text-sm flex items-center gap-1 hover:underline"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit name
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${planDetails.color}`}>
              <span className="text-white text-sm font-medium">{planDetails.name}</span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Profession</p>
                <p className="text-white capitalize">{user?.profession?.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                {getDomainIcon(user?.domain || '')}
              </div>
              <div className="flex-1">
                <p className="text-white/50 text-sm">Domain</p>
                <p className="text-white">{getDomainLabel(user?.domain || '')}</p>
              </div>
              <button 
                onClick={() => setShowDomainModal(true)}
                className="text-[#FF4EC2] text-sm hover:underline"
              >
                Change
              </button>
            </div>

            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white/60" />
              </div>
              <div className="flex-1">
                <p className="text-white/50 text-sm">Plan</p>
                <p className="text-white">{planDetails.name}</p>
              </div>
              {user?.plan === 'freemium' && (
                <button 
                  onClick={() => navigateTo('pro')}
                  className="text-[#FF4EC2] text-sm hover:underline"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Features */}
        <div className="card-violet p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Your Plan Features</h3>
          <ul className="space-y-3">
            {planDetails.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <CheckCircle2 className="w-5 h-5 text-[#FF4EC2]" />
                {feature}
              </li>
            ))}
          </ul>
          {user?.plan !== 'full' && (
            <Button 
              onClick={() => navigateTo('pro')} 
              className="w-full mt-6 btn-primary"
            >
              Upgrade Plan
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card-violet p-4 text-center">
            <Target className="w-6 h-6 text-[#FF4EC2] mx-auto mb-2" />
            <p className="text-white/50 text-sm">Member Since</p>
            <p className="text-white font-semibold">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
            </p>
          </div>
          <div className="card-violet p-4 text-center">
            <Briefcase className="w-6 h-6 text-[#FF4EC2] mx-auto mb-2" />
            <p className="text-white/50 text-sm">Interviews</p>
            <p className="text-white font-semibold">12 Completed</p>
          </div>
          <div className="card-violet p-4 text-center">
            <Crown className="w-6 h-6 text-[#FF4EC2] mx-auto mb-2" />
            <p className="text-white/50 text-sm">Current Streak</p>
            <p className="text-white font-semibold">5 Days 🔥</p>
          </div>
        </div>

        {/* Domain Change Modal */}
        {showDomainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-backdrop">
            <div className="card-violet p-6 max-w-md w-full">
              <h3 className="text-white font-semibold mb-4">Change Domain</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedDomain === domain.id
                        ? 'border-[#FF4EC2] bg-[#FF4EC2]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{domain.icon}</span>
                    <span className="text-white text-sm">{domain.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowDomainModal(false)}
                  variant="outline"
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDomainChange}
                  className="flex-1 btn-primary"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
