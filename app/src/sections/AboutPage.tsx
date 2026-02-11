import { useAppState } from '@/hooks/useAppState';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Heart, Target } from 'lucide-react';

export function AboutPage() {
    const { navigateTo } = useAppState();

    return (
        <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-display font-black mb-6">
                    Empowering your <br />
                    <span className="text-[#FF4EC2]">career journey.</span>
                </h1>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                    We believe everyone deserves a fair shot at their dream job. Pocket Interviewer was built to democratize interview preparation.
                </p>
            </div>

            {/* Mission */}
            <div className="max-w-7xl mx-auto mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card-violet p-8 text-center">
                        <div className="w-16 h-16 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Target className="w-8 h-8 text-[#FF4EC2]" />
                        </div>
                        <h3 className="text-xl text-white font-display font-bold mb-3">Our Mission</h3>
                        <p className="text-white/60">
                            To provide accessible, high-quality interview coaching to everyone, regardless of their background or budget.
                        </p>
                    </div>
                    <div className="card-violet p-8 text-center">
                        <div className="w-16 h-16 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-[#FF4EC2]" />
                        </div>
                        <h3 className="text-xl text-white font-display font-bold mb-3">Community First</h3>
                        <p className="text-white/60">
                            We're building a community of confident professionals who support each other's growth and success.
                        </p>
                    </div>
                    <div className="card-violet p-8 text-center">
                        <div className="w-16 h-16 bg-[#FF4EC2]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-[#FF4EC2]" />
                        </div>
                        <h3 className="text-xl text-white font-display font-bold mb-3">Human-Centered AI</h3>
                        <p className="text-white/60">
                            We use AI to enhance human potential, providing personalized feedback that feels natural and constructive.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Nova */}
            <div className="max-w-7xl mx-auto mb-20 text-center">
                <h2 className="text-3xl sm:text-4xl text-white font-display font-black mb-12">
                    Meet Team <span className="text-[#FF4EC2]">Nova</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Aman R Jain */}
                    <div className="card-violet p-8 relative group hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            A
                        </div>
                        <h3 className="text-xl text-white font-bold mb-1">Aman R Jain</h3>
                        <p className="text-[#FF4EC2] font-medium mb-4">Founder & Lead Developer</p>
                        <p className="text-white/60 text-sm">
                            Visionary behind Pocket Interviewer, driving the technical architecture and core AI integration.
                        </p>
                    </div>

                    {/* Kalyani Birajdar */}
                    <div className="card-violet p-8 relative group hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            K
                        </div>
                        <h3 className="text-xl text-white font-bold mb-1">Kalyani Birajdar</h3>
                        <p className="text-[#FF4EC2] font-medium mb-4">UI/UX Designer & Frontend Engineer</p>
                        <p className="text-white/60 text-sm">
                            Crafting the intuitive, glassmorphic interface and ensuring a seamless user experience.
                        </p>
                    </div>

                    {/* Mansi */}
                    <div className="card-violet p-8 relative group hover:scale-105 transition-transform duration-300">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#FF4EC2] to-[#4B2086] rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            M
                        </div>
                        <h3 className="text-xl text-white font-bold mb-1">Mansi</h3>
                        <p className="text-[#FF4EC2] font-medium mb-4">QA Lead & Backend Engineer</p>
                        <p className="text-white/60 text-sm">
                            Ensuring platform stability, rigorous testing, and robust backend performance.
                        </p>
                    </div>
                </div>
            </div>



            {/* Story Section */}
            <div className="max-w-5xl mx-auto mb-20 bg-[#4B2086] rounded-3xl p-8 sm:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 gradient-blob opacity-30" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl text-white font-display font-bold mb-4">Our Story</h2>
                        <p className="text-white/70 mb-4 leading-relaxed">
                            Pocket Interviewer started with a simple observation: practicing for interviews is awkward. Mock interviews with friends feels forced, and practicing in the mirror doesn't give you feedback.
                        </p>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            We wanted to create a safe space where you can stumble, stutter, and then improve—without judgement. By combining voice recognition with advanced AI, we've created a private coach that's always available when you are.
                        </p>
                        <Button onClick={() => navigateTo('signup')} className="btn-primary">
                            Join our journey
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                    <div className="flex justify-extreme md:justify-center">
                        <div className="text-[120px] leading-none animate-float">🚀</div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl text-white font-display font-bold mb-6">Ready to start practicing?</h2>
                <Button onClick={() => navigateTo('signup')} className="btn-secondary px-8 py-6 text-lg">
                    Get Started Now
                </Button>
            </div>
        </div>
    );
}
