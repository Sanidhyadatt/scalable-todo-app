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
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/register', data);
            login(response.data.token, response.data.user);
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'response' in err) {
                const apiError = err as { response: { data: { message: string } } };
                setError(apiError.response?.data?.message || 'Registration failed');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-outfit text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-2">
                        Join ScalableApp
                    </h1>
                    <p className="text-gray-400">Create your account to get started.</p>
                </div>

                <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-indigo-900/20">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                                <Input
                                    placeholder="Full Name"
                                    {...register('name')}
                                    className="pl-12"
                                    error={errors.name?.message}
                                />
                            </div>

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
                            className="w-full h-12 text-base shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-500"
                            isLoading={loading}
                        >
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>

                        <div className="text-center text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
