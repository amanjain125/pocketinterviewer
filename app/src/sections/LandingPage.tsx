import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MessageSquare, 
  TrendingUp, 
  Zap, 
  Users, 
  Target, 
  Briefcase,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function LandingPage() {
  const { navigateTo } = useAppState();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const interviewTypesRef = useRef<HTMLDivElement>(null);
  const modesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        '.hero-left-card',
        { x: '-60vw', rotation: -8, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.hero-right-card',
        { x: '60vw', rotation: 10, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Feature cards stagger
      gsap.fromTo(
        '.feature-card',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // How it works steps
      gsap.fromTo(
        '.step-card',
        { y: 60, rotation: -2, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Interview types
      gsap.fromTo(
        '.interview-type-card',
        { y: 70, scale: 0.96, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: interviewTypesRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Testimonials
      gsap.fromTo(
        '.testimonial-card',
        { y: 60, rotation: -1, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Pricing cards
      gsap.fromTo(
        '.pricing-card',
        { y: 70, scale: 0.97, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pricingRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // FAQ items
      gsap.fromTo(
        '.faq-item',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#2B0B57]">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-4 sm:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Card - Headline */}
          <div className="hero-left-card card-violet p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 gradient-blob opacity-50" />
            
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-display font-black leading-[0.95] mb-6">
                Practice<br />
                interviews<br />
                <span className="text-[#FF4EC2]">anywhere.</span>
              </h1>
              
              <p className="text-white/70 text-lg mb-8 max-w-md">
                AI-generated questions, voice answers, and instant feedback. 
                Build confidence for your next big opportunity.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigateTo('signup')}
                  className="btn-primary"
                >
                  Start practicing
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection(howItWorksRef)}
                  className="btn-secondary"
                >
                  See how it works
                </Button>
              </div>
            </div>
          </div>

          {/* Right Card - Visual */}
          <div className="hero-right-card card-violet p-8 sm:p-12 flex items-center justify-center relative min-h-[400px]">
            <div className="absolute inset-0 gradient-blob opacity-30 animate-blob-drift" />
            
            <div className="relative z-10 text-center">
              <div className="text-[150px] sm:text-[180px] leading-none animate-float-slow">
                💼
              </div>
              <div className="absolute top-8 right-8 text-5xl animate-rotate-slow">
                ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-4">
              Everything you need to <span className="text-[#FF4EC2]">nail</span> interviews
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From practice to feedback, we&apos;ve got you covered at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="feature-card card-violet p-8 interactive-card">
              <div className="w-14 h-14 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mb-6">
                <Mic className="w-7 h-7 text-[#FF4EC2]" />
              </div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Practice like it&apos;s real
              </h3>
              <p className="text-white/60">
                Pick your domain. Answer voice questions. Get follow-ups that feel human.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card card-violet p-8 interactive-card">
              <div className="w-14 h-14 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-7 h-7 text-[#FF4EC2]" />
              </div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Feedback that&apos;s clear
              </h3>
              <p className="text-white/60">
                Strengths, improvements, and a confidence score—delivered right after every session.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card card-violet p-8 interactive-card">
              <div className="w-14 h-14 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#FF4EC2]" />
              </div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Track your growth
              </h3>
              <p className="text-white/60">
                Streaks, session history, and a weakness radar that keeps you moving forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 px-4 sm:px-8 bg-[#4B2086]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-4">
              How it works
            </h2>
            <p className="text-white/60 text-lg">
              Three steps to a better interview performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="step-card card-violet-dark p-8 relative">
              <div className="absolute top-4 right-4 text-6xl opacity-20 font-display font-black text-[#FF4EC2]">
                01
              </div>
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Choose your interview type
              </h3>
              <p className="text-white/60">
                Behavioral, technical, rapid fire, or situational. Pick a difficulty that matches your goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card card-violet-dark p-8 relative">
              <div className="absolute top-4 right-4 text-6xl opacity-20 font-display font-black text-[#FF4EC2]">
                02
              </div>
              <div className="text-5xl mb-6">🎤</div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Answer with your voice
              </h3>
              <p className="text-white/60">
                Talk naturally. We transcribe, listen, and follow up like a real interviewer.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card card-violet-dark p-8 relative">
              <div className="absolute top-4 right-4 text-6xl opacity-20 font-display font-black text-[#FF4EC2]">
                03
              </div>
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-xl text-white font-display font-bold mb-3">
                Get feedback & improve
              </h3>
              <p className="text-white/60">
                See what you nailed, what to refine, and exactly how to practice next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Types Section */}
      <section ref={interviewTypesRef} className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-2">
                Interview types
              </h2>
              <p className="text-white/60">
                From first impressions to deep technical rounds.
              </p>
            </div>
            <Button 
              onClick={() => navigateTo('signup')}
              className="btn-secondary"
            >
              Explore all types
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🗣️', title: 'Behavioral', desc: '"Tell me about a time..." practice with follow-ups.' },
              { emoji: '💻', title: 'Technical', desc: 'Domain-specific questions with explanations.' },
              { emoji: '⚡', title: 'Rapid Fire', desc: 'Quick Q&A to build speed and clarity.' },
              { emoji: '🎭', title: 'Situational', desc: 'Handle pressure, conflict, and deadlines.' },
              { emoji: '🤝', title: 'HR Basics', desc: 'Salary, relocation, and career goals.' },
            ].map((type, i) => (
              <div key={i} className="interview-type-card card-violet p-6 interactive-card">
                <div className="text-4xl mb-4">{type.emoji}</div>
                <h3 className="text-lg text-white font-display font-bold mb-2">
                  {type.title}
                </h3>
                <p className="text-white/60 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section ref={modesRef} className="py-20 px-4 sm:px-8 bg-[#4B2086]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-4">
              Modes that match your goals
            </h2>
            <p className="text-white/60 text-lg">
              Push your limits with advanced practice modes.
            </p>
          </div>

          <div className="space-y-8">
            {/* Stress Mode */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 card-violet-dark p-8 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl text-white font-display font-bold">Stress Mode</h3>
                </div>
                <p className="text-white/60">
                  Time pressure + sudden follow-ups. Train calm under fire with unexpected interruptions and rapid questioning.
                </p>
              </div>
              <div className="w-full lg:w-48 h-48 card-violet-dark flex items-center justify-center">
                <span className="text-8xl">⏱️</span>
              </div>
            </div>

            {/* Distraction Mode */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-8">
              <div className="flex-1 card-violet-dark p-8 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl text-white font-display font-bold">Distraction Mode</h3>
                </div>
                <p className="text-white/60">
                  Interruptions while you speak. Learn to recover smoothly and maintain focus despite distractions.
                </p>
              </div>
              <div className="w-full lg:w-48 h-48 card-violet-dark flex items-center justify-center">
                <span className="text-8xl">🎯</span>
              </div>
            </div>

            {/* Panel Mode */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 card-violet-dark p-8 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl text-white font-display font-bold">Panel Mode</h3>
                </div>
                <p className="text-white/60">
                  Three interviewers. One lead, one interruptor, one observer. Experience the real panel interview dynamic.
                </p>
              </div>
              <div className="w-full lg:w-48 h-48 card-violet-dark flex items-center justify-center">
                <span className="text-8xl">👥</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-4">
              What people say
            </h2>
            <p className="text-white/60 text-lg">
              Real stories from real users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                emoji: '👩‍💼', 
                name: 'Aisha', 
                role: 'Product Manager',
                quote: 'I went from rambling to structured answers in two weeks. The feedback is incredibly actionable.' 
              },
              { 
                emoji: '👨‍🎓', 
                name: 'Ben', 
                role: 'New Grad',
                quote: 'The feedback is honest and actionable. Like having a coach in your pocket 24/7.' 
              },
              { 
                emoji: '👩‍💻', 
                name: 'Carmen', 
                role: 'Career Switcher',
                quote: 'Panel mode made the real thing feel easy. I was prepared for every curveball.' 
              },
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-card card-violet p-8">
                <div className="text-5xl mb-6">{testimonial.emoji}</div>
                <p className="text-white/80 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 px-4 sm:px-8 bg-[#4B2086]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-4">
              Pricing
            </h2>
            <p className="text-white/60 text-lg">
              Start free, upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Freemium */}
            <div className="pricing-card card-violet-dark p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl text-white font-display font-bold mb-2">Freemium</h3>
                <div className="text-4xl text-white font-display font-black">Free</div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Micro interviews', 'Progress stories', 'Weakness radar', 'Streaks', 'Basic feedback'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4EC2]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigateTo('signup')}
                className="w-full btn-secondary"
              >
                Get started
              </Button>
            </div>

            {/* Advanced */}
            <div className="pricing-card card-violet p-8 border-2 border-[#FF4EC2]/60 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF4EC2] text-white text-xs font-bold px-4 py-1 rounded-full">
                POPULAR
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl text-white font-display font-bold mb-2">Advanced Practice</h3>
                <div className="text-4xl text-white font-display font-black">$12<span className="text-lg text-white/50">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Freemium', 'Stress Mode', 'Distraction Mode', 'Panel Interviewer', 'Detailed analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4EC2]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigateTo('signup')}
                className="w-full btn-primary"
              >
                Start trial
              </Button>
            </div>

            {/* Full Interview */}
            <div className="pricing-card card-violet-dark p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl text-white font-display font-bold mb-2">Full Interview</h3>
                <div className="text-4xl text-white font-display font-black">$29<span className="text-lg text-white/50">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Advanced', '30-minute full interview', 'Resume-based questioning', 'Multiple rounds', 'Detailed feedback'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <CheckCircle2 className="w-5 h-5 text-[#FF4EC2]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigateTo('signup')}
                className="w-full btn-secondary"
              >
                Start trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-12 text-center">
            FAQ
          </h2>

          <div className="space-y-4">
            {[
              { q: 'Do I need to prepare questions?', a: 'No! Our AI generates personalized questions based on your domain and experience level.' },
              { q: 'How long is a session?', a: 'Micro interviews are 3-5 minutes. Full interviews can be up to 30 minutes with multiple rounds.' },
              { q: 'Is my data private?', a: 'Absolutely. All your interview data, recordings, and feedback are encrypted and never shared.' },
              { q: 'Can I practice for a specific company?', a: 'Yes! Our AI can tailor questions based on company culture and known interview styles.' },
              { q: 'What devices are supported?', a: 'Pocket Interviewer works on any device with a web browser and microphone.' },
              { q: 'How do I cancel?', a: 'You can cancel anytime from your account settings. No questions asked.' },
            ].map((faq, i) => (
              <div key={i} className="faq-item card-violet p-6">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-white/60 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 sm:px-8 bg-[#4B2086]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="text-4xl sm:text-5xl text-white font-display font-black mb-6">
                Ready to nail your next interview?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg">
                Start with a free micro interview. Upgrade when you&apos;re ready to go deeper.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigateTo('signup')}
                  className="btn-primary"
                >
                  Start practicing
                  <Briefcase className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection(pricingRef)}
                  className="btn-secondary"
                >
                  View pricing
                </Button>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="card-violet p-12 flex items-center justify-center min-h-[300px] relative">
              <div className="absolute inset-0 gradient-blob opacity-30" />
              <div className="relative z-10 text-center">
                <div className="text-[150px] leading-none animate-float">
                  🚀
                </div>
                <div className="absolute top-8 right-8 text-5xl animate-rotate-slow">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#4B2086] rounded-xl flex items-center justify-center text-2xl">
                💼
              </div>
              <span className="font-display font-bold text-xl text-white">
                Pocket Interviewer
              </span>
            </div>
            <p className="text-white/50 mb-6">Practice interviews. Anywhere.</p>
            <div className="flex items-center gap-6 text-white/50 text-sm">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Twitter</button>
              <button className="hover:text-white transition-colors">LinkedIn</button>
            </div>
            <div className="mt-8 flex items-center gap-1 text-white/30 text-xs">
              <Star className="w-3 h-3" />
              <span>Made with care for job seekers everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
