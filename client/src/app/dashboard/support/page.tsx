"use client";

import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Mail, MessageSquare, LifeBuoy, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const supportSchema = z.object({
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

type SupportFormValues = z.infer<typeof supportSchema>;

export default function SupportPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupportFormValues>({
        resolver: zodResolver(supportSchema),
    });

    const onSubmit = async (data: SupportFormValues) => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">How can we help?</h1>
                <p className="text-gray-400 text-lg">Our team is here to support you in every step of your journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-[#111111]/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transition-all hover:border-blue-500/30 group">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                        <p className="text-gray-500 text-sm">Response within 24 hours</p>
                        <p className="text-blue-500 text-sm mt-2 font-medium">support@scalableapp.com</p>
                    </div>

                    <div className="bg-[#111111]/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transition-all hover:border-purple-500/30 group">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                        <p className="text-gray-500 text-sm">Available Mon-Fri, 9am-6pm</p>
                        <p className="text-purple-500 text-sm mt-2 font-medium">Start a conversation</p>
                    </div>

                    <div className="bg-[#111111]/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 transition-all hover:border-orange-500/30 group">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <LifeBuoy className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Knowledge Base</h3>
                        <p className="text-gray-500 text-sm">Find answers in our docs</p>
                        <p className="text-orange-500 text-sm mt-2 font-medium">Browse articles</p>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-[#111111]/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Subject</label>
                                <input
                                    {...register('subject')}
                                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="How can we help?"
                                />
                                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Message</label>
                                <textarea
                                    {...register('message')}
                                    rows={6}
                                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
                            </div>

                            {submitted && (
                                <div className="flex items-center space-x-2 p-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <p className="text-sm">Message sent successfully! We'll get back to you soon.</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                isLoading={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
