import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Zap, 
  Crown, 
  Star,
  ArrowLeft,
  Users,
  Target,
  Clock,
  FileText,
  Shield
} from 'lucide-react';

const plans = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Star,
    color: 'bg-white/20',
    features: [
      '5 micro interviews per day',
      'Basic progress tracking',
      'Weakness radar',
      'Streak counter',
      'Basic feedback',
      'Community support',
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    id: 'advanced',
    name: 'Advanced Practice',
    price: 12,
    period: 'month',
    description: 'For serious interview prep',
    icon: Zap,
    color: 'bg-[#FF4EC2]/30',
    popular: true,
    features: [
      'Everything in Freemium',
      'Unlimited micro interviews',
      'Stress Mode',
      'Distraction Mode',
      'Panel Interviewer',
      'Detailed analytics',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    disabled: false,
  },
  {
    id: 'full',
    name: 'Full Interview',
    price: 29,
    period: 'month',
    description: 'The complete experience',
    icon: Crown,
    color: 'bg-yellow-500/30',
    features: [
      'Everything in Advanced',
      '30-minute full interviews',
      'Resume-based questioning',
      'Multiple interview rounds',
      'AI resume analysis',
      'Detailed round feedback',
      '1-on-1 coaching sessions',
      'Dedicated support',
    ],
    cta: 'Start Free Trial',
    disabled: false,
  },
];

const featureComparison = [
  { feature: 'Micro Interviews', freemium: '5/day', advanced: 'Unlimited', full: 'Unlimited' },
  { feature: 'Stress Mode', freemium: false, advanced: true, full: true },
  { feature: 'Distraction Mode', freemium: false, advanced: true, full: true },
  { feature: 'Panel Interviewer', freemium: false, advanced: true, full: true },
  { feature: 'Full Interview (30 min)', freemium: false, advanced: false, full: true },
  { feature: 'Resume Analysis', freemium: false, advanced: false, full: true },
  { feature: 'Detailed Feedback', freemium: 'Basic', advanced: 'Advanced', full: 'Comprehensive' },
  { feature: 'Support', freemium: 'Community', advanced: 'Priority', full: 'Dedicated' },
];

export function ProPage() {
  const { user, upgradePlan, navigateTo } = useAppState();

  const handleUpgrade = (planId: string) => {
    upgradePlan(planId as any);
    // In a real app, this would open a payment modal
    alert(`Upgrading to ${planId} plan! (Demo)`);
  };

  return (
    <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl text-white font-display font-bold">Upgrade Your Plan</h1>
            <p className="text-white/60">Unlock advanced features and modes</p>
          </div>
        </div>

        {/* Current Plan Banner */}
        <div className="card-violet p-6 mb-8 border border-[#FF4EC2]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-[#FF4EC2]" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Current Plan</p>
                <h2 className="text-xl text-white font-semibold capitalize">
                  {user?.plan || 'Freemium'}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/60 text-sm">Interviews today</p>
                <p className="text-white font-semibold">2 / 5 used</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-right">
                <p className="text-white/60 text-sm">Resets in</p>
                <p className="text-white font-semibold">14 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = user?.plan === plan.id;

            return (
              <div 
                key={plan.id} 
                className={`relative card-violet p-6 ${plan.popular ? 'border-2 border-[#FF4EC2]/60' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF4EC2] text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-1">{plan.name}</h3>
                  <p className="text-white/50 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl text-white font-display font-bold">${plan.price}</span>
                    <span className="text-white/50">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <div className="w-5 h-5 bg-[#FF4EC2]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#FF4EC2]" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrentPlan || plan.disabled}
                  className={`w-full ${isCurrentPlan ? 'btn-secondary opacity-50' : plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="card-violet p-6 mb-8">
          <h2 className="text-xl text-white font-semibold mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/60 font-medium py-3 px-4">Feature</th>
                  <th className="text-center text-white/60 font-medium py-3 px-4">Freemium</th>
                  <th className="text-center text-white/60 font-medium py-3 px-4">Advanced</th>
                  <th className="text-center text-white/60 font-medium py-3 px-4">Full</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.freemium === 'boolean' ? (
                        row.freemium ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-white/20">—</span>
                        )
                      ) : (
                        <span className="text-white/70">{row.freemium}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.advanced === 'boolean' ? (
                        row.advanced ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-white/20">—</span>
                        )
                      ) : (
                        <span className="text-white/70">{row.advanced}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.full === 'boolean' ? (
                        row.full ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-white/20">—</span>
                        )
                      ) : (
                        <span className="text-white/70">{row.full}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Zap, title: 'Stress Mode', desc: 'Train under time pressure' },
            { icon: Target, title: 'Distraction Mode', desc: 'Learn to recover smoothly' },
            { icon: Users, title: 'Panel Mode', desc: 'Multiple interviewer simulation' },
            { icon: FileText, title: 'Resume Analysis', desc: 'AI-powered resume insights' },
            { icon: Clock, title: 'Full Interviews', desc: '30-minute complete sessions' },
            { icon: Shield, title: 'Priority Support', desc: 'Get help when you need it' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="card-violet p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FF4EC2]" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                  <p className="text-white/50 text-xs">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">Have questions about our plans?</p>
          <Button variant="outline" className="btn-secondary">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
