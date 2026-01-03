"use client";

import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { CheckSquare, Clock, AlertCircle, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

export default function DashboardPage() {
    const { user } = useAuth();

    const stats = [
        { name: 'Total Tasks', value: '12', icon: CheckSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { name: 'In Progress', value: '4', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
        { name: 'Pending', value: '6', icon: AlertCircle, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { name: 'Completed', value: '2', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ];

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <motion.div variants={item}>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                    Hello, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-400 text-lg">Here's what's happening with your tasks today.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.name} variants={item}>
                            <div className={cn(
                                "group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 border bg-white/5 backdrop-blur-xl",
                                stat.border
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 mb-1">{stat.name}</p>
                                        <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                    </div>
                                    <div className={cn("p-3 rounded-2xl", stat.bg)}>
                                        <Icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-xs text-gray-500">
                                    <TrendingUp className="w-3 h-3 mr-1 text-emerald-400" />
                                    <span className="text-emerald-400 font-medium mr-1">+2.5%</span> from last week
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="glass-card rounded-3xl h-[400px] border border-white/10 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-cyan-400" />
                                Activity Overview
                            </h3>
                            <select className="bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50">
                                <option>This Week</option>
                                <option>This Month</option>
                            </select>
                        </div>
                        <div className="flex-1 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 flex items-center justify-center group relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <p className="text-gray-500 z-10 font-medium">Chart visualization placeholder</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <div className="glass-card rounded-3xl h-[400px] border border-white/10 p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group flex items-center space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                        <CheckSquare className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
                                            Task "{i === 1 ? 'API Integration' : 'UI Design'}" completed
                                        </p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
