"use client";

import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useState } from 'react';
import api from '@/lib/api';
import { AlertCircle, CheckCircle2, Save, Lock } from 'lucide-react';

const settingsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const securitySchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

function SecuritySection() {
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SecurityFormValues>({
        resolver: zodResolver(securitySchema),
    });

    const onSubmit = async (data: SecurityFormValues) => {
        setLoading(true);
        setStatus(null);
        try {
            await api.put('/auth/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            setStatus({ type: 'success', message: 'Password changed successfully!' });
            reset();
        } catch (error: unknown) {
            let message = 'Failed to change password.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data: { message: string } } };
                message = err.response?.data?.message || message;
            }
            setStatus({
                type: 'error',
                message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('currentPassword')}
                        error={errors.currentPassword?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('newPassword')}
                            error={errors.newPassword?.message}
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                        />
                    </div>

                    {status && (
                        <div
                            className={`flex items-center space-x-2 p-4 rounded-xl transition-all duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                }`}
                        >
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} variant="secondary" className="w-full md:w-auto">
                        Change Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    const { user, setUser } = useAuth();
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const onSubmit = async (data: SettingsFormValues) => {
        setLoading(true);
        setStatus(null);
        try {
            const response = await api.put('/auth/profile', data);
            setUser({ ...user, ...response.data.user });
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error: unknown) {
            let message = 'Failed to update profile.';
            if (typeof error === 'object' && error !== null && 'response' in error) {
                const err = error as { response: { data: { message: string } } };
                message = err.response?.data?.message || message;
            }
            setStatus({
                type: 'error',
                message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your account preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <Input
                            label="Email Address"
                            placeholder="john@example.com"
                            {...register('email')}
                            error={errors.email?.message}
                        />

                        {status && (
                            <div
                                className={`flex items-center space-x-2 p-4 rounded-xl transition-all duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                    }`}
                            >
                                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        )}

                        <Button type="submit" isLoading={loading} className="w-full md:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <SecuritySection />
        </div>
    );
}
