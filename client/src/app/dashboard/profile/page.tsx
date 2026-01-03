"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { User, Mail, Calendar, Settings as SettingsIcon, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">View and manage your personal information.</p>
                </div>
                <Link href="/dashboard/settings">
                    <Button variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10">
                        <SettingsIcon className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="flex flex-col items-center text-center h-full">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
                            <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'User'}</h2>
                        <p className="text-cyan-400 mb-6 bg-cyan-500/5 px-3 py-1 rounded-full text-sm border border-cyan-500/10">{user.email}</p>

                        <div className="w-full border-t border-white/5 pt-6 mt-auto">
                            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span>Account Verified</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
                                    <p className="text-white font-semibold text-lg">{user.name || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                                    <p className="text-white font-semibold text-lg">{user.email}</p>
                                </div>
                            </div>

                            <div className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Member Since</p>
                                    <p className="text-white font-semibold text-lg">
                                        {/* Since user interface doesn't strictly have createdAt typed sometimes, use a default */}
                                        {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'Recent'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
