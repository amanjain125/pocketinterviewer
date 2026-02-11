import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        // Simulate sending
        setTimeout(() => {
            setFormStatus('sent');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#2B0B57] pt-24 pb-12 px-4 sm:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl text-white font-display font-black mb-4">
                        Get in touch
                    </h1>
                    <p className="text-white/70 text-lg">
                        We'd love to hear from you. Questions, feedback, or just to say hello.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="card-violet p-8">
                            <h3 className="text-xl text-white font-display font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-[#FF4EC2]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Email</h4>
                                        <p className="text-white/60">novadigital162@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FF4EC2]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageSquare className="w-5 h-5 text-[#FF4EC2]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Phone</h4>
                                        <p className="text-white/60">+91 8095806569</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-violet-dark p-8">
                            <h3 className="text-xl text-white font-display font-bold mb-4">FAQ</h3>
                            <p className="text-white/60 mb-4">
                                Have a quick question? Check out our Frequently Asked Questions for instant answers.
                            </p>
                            <Button variant="outline" className="btn-secondary w-full">
                                Visit FAQ
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="card-violet p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4EC2]"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4EC2]"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Subject</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4EC2]">
                                    <option className="bg-[#2B0B57]">General Inquiry</option>
                                    <option className="bg-[#2B0B57]">Support</option>
                                    <option className="bg-[#2B0B57]">Feedback</option>
                                    <option className="bg-[#2B0B57]">Partnership</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#FF4EC2]"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full btn-primary"
                                disabled={formStatus !== 'idle'}
                            >
                                {formStatus === 'idle' && (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                                {formStatus === 'sending' && 'Sending...'}
                                {formStatus === 'sent' && 'Message Sent!'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
