"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, loading } = useAuth();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError('');
            // In a real app, you would call the API here.
            // For now, we'll simulate a login call or use the context's login directly if it handles API.
            // Assuming context login expects a token and user object, we might need an API call first.

            // Let's assume the AuthContext or a separate API utility handles the actual fetch
            // But based on previous context code, login takes (token, user).
            // So we need to fetch first.

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            login(result.token, result.user);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                const error = err as { message: string } | { response?: { data?: { message?: string } } };
                if ('response' in error && error.response?.data?.message) {
                    setError(error.response.data.message);
                } else if ('message' in error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-2">
                        ScalableApp
                    </h1>
                    <p className="text-gray-400">Welcome back! Please enter your details.</p>
                </div>

                <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-cyan-900/20">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <Input
                                    placeholder="Email Address"
                                    {...register('email')}
                                    className="pl-12"
                                    error={errors.email?.message}
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password')}
                                    className="pl-12"
                                    error={errors.password?.message}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base shadow-lg shadow-cyan-500/20"
                            isLoading={isSubmitting || loading}
                        >
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
