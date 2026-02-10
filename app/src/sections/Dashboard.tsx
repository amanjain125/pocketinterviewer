import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  TrendingUp, 
  Target, 
  Flame, 
  Clock, 
  Award,
  ChevronRight,
  Zap,
  Users,
  Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function Dashboard() {
  const { user, progressData, setShowInterviewSetup, navigateTo } = useAppState();

  const getDomainLabel = (domain: string) => {
    const labels: Record<string, string> = {
      computer_science: 'Computer Science',
      civil: 'Civil Engineering',
      ai_ml: 'AI / ML',
      mechanical: 'Mechanical',
      electrical: 'Electrical',
      others: 'Custom Domain',
    };
    return labels[domain] || domain;
  };

  const getPlanBadge = (plan: string) => {
    const badges: Record<string, { label: string; color: string; icon: React.ElementType }> = {
      freemium: { label: 'Free', color: 'bg-white/20', icon: Award },
      advanced: { label: 'Advanced', color: 'bg-[#FF4EC2]/30', icon: Zap },
      full: { label: 'Pro', color: 'bg-yellow-500/30', icon: Crown },
    };
    return badges[plan] || badges.freemium;
  };

  const planBadge = getPlanBadge(user?.plan || 'freemium');
  const PlanIcon = planBadge.icon;

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl sm:text-4xl text-white font-display font-bold">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${planBadge.color}`}>
                <PlanIcon className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{planBadge.label}</span>
              </div>
            </div>
            <p className="text-white/60">
              {getDomainLabel(user?.domain || '')} • {user?.profession === 'college_student' ? 'College Student' : user?.profession === 'recent_graduate' ? 'Recent Graduate' : 'Professional'}
            </p>
          </div>

          <Button 
            onClick={() => setShowInterviewSetup(true)}
            className="btn-primary"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Micro Interview
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Current Streak */}
          <div className="card-violet p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <span className="streak-fire text-2xl">🔥</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Current Streak</p>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.currentStreak || 0} <span className="text-lg text-white/50">days</span>
            </p>
          </div>

          {/* Total Interviews */}
          <div className="card-violet p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-[#FF4EC2]" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Total Interviews</p>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalInterviews || 0}
            </p>
          </div>

          {/* Practice Time */}
          <div className="card-violet p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Practice Time</p>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.totalDuration || 0} <span className="text-lg text-white/50">min</span>
            </p>
          </div>

          {/* Longest Streak */}
          <div className="card-violet p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-white/60 text-sm mb-1">Longest Streak</p>
            <p className="text-3xl text-white font-display font-bold">
              {progressData?.longestStreak || 0} <span className="text-lg text-white/50">days</span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Progress Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Improvement Trend */}
            <div className="card-violet p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#FF4EC2]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Improvement Trend</h3>
                    <p className="text-white/50 text-sm">Your confidence score over time</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => navigateTo('progress')}
                  className="text-[#FF4EC2] hover:text-[#ff6fd1] hover:bg-[#FF4EC2]/10"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData?.improvementTrend || []}>
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#4B2086', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Confidence']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#FF4EC2" 
                      strokeWidth={3}
                      dot={{ fill: '#FF4EC2', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#FF4EC2' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigateTo('progress')}
                className="card-violet p-6 text-left interactive-card group"
              >
                <div className="w-12 h-12 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FF4EC2]/30 transition-colors">
                  <Target className="w-6 h-6 text-[#FF4EC2]" />
                </div>
                <h3 className="text-white font-semibold mb-1">View Progress</h3>
                <p className="text-white/50 text-sm">Check your interview history and feedback</p>
              </button>

              <button 
                onClick={() => navigateTo('pro')}
                className="card-violet p-6 text-left interactive-card group"
              >
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Upgrade Plan</h3>
                <p className="text-white/50 text-sm">Unlock advanced features and modes</p>
              </button>
            </div>
          </div>

          {/* Right Column - Weakness Radar & Recent */}
          <div className="space-y-6">
            {/* Skill Performance Gauges */}
            <div className="card-violet p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Skill Performance</h3>
                  <p className="text-white/50 text-sm">Real-time skill assessment</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Clarity', value: progressData?.weaknessRadar.clarity || 75 },
                  { label: 'Structure', value: progressData?.weaknessRadar.structure || 68 },
                  { label: 'Technical Depth', value: progressData?.weaknessRadar.technicalDepth || 82 },
                  { label: 'Confidence', value: progressData?.weaknessRadar.confidence || 70 },
                  { label: 'Relevance', value: progressData?.weaknessRadar.relevance || 85 },
                ].map((item, index) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <h4 className="text-white font-medium mb-2">{item.label}</h4>
                    
                    {/* Circular gauge visualization */}
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {/* Background circle */}
                      <div className="absolute w-full h-full rounded-full border-4 border-gray-700"></div>
                      
                      {/* Progress circle */}
                      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={index === 0 ? "#818cf8" : index === 1 ? "#60a5fa" : index === 2 ? "#34d399" : index === 3 ? "#fbbf24" : "#f87171"}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(item.value / 100) * 283}, 283`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      
                      {/* Value indicator */}
                      <div className="relative z-10 text-center">
                        <span className="text-sm font-bold text-white">{item.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            {user?.plan === 'freemium' && (
              <div className="card-violet p-6 border border-[#FF4EC2]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#FF4EC2]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Unlock Advanced</h3>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-white/60 text-sm">
                    <Zap className="w-4 h-4 text-[#FF4EC2]" />
                    Stress Mode
                  </li>
                  <li className="flex items-center gap-2 text-white/60 text-sm">
                    <Target className="w-4 h-4 text-[#FF4EC2]" />
                    Distraction Mode
                  </li>
                  <li className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4 text-[#FF4EC2]" />
                    Panel Interviewer
                  </li>
                </ul>
                <Button 
                  onClick={() => navigateTo('pro')}
                  className="w-full btn-primary"
                >
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
