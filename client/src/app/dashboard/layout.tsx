"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, CheckSquare, Settings, LogOut, User, Download, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { downloadSchemas } from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex font-outfit text-gray-100 selection:bg-cyan-500/30">
            {/* Floating Glass Sidebar */}
            <aside className="fixed left-4 top-4 bottom-4 w-72 glass-card rounded-3xl flex flex-col z-50">
                <div className="p-8 pb-4">
                    <Link href="/dashboard" className="block">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 tracking-tight">
                            Scalable
                        </h1>
                    </Link>
                    <p className="text-xs text-gray-400 mt-1 ml-1 tracking-widest uppercase">Workspace</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={cn(
                                    'relative flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden',
                                    isActive ? 'text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'text-gray-400 hover:text-white'
                                )}>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon className={cn('w-5 h-5 relative z-10 transition-colors', isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400')} />
                                    <span className="font-medium relative z-10">{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mx-4 mb-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-white">{user.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        onClick={logout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-80 mr-4 my-4 flex flex-col relative z-0">
                <header className="h-20 mb-6 glass-card rounded-3xl flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-white">
                            {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                        </h2>
                        <p className="text-xs text-gray-400">Welcome back, {user.name?.split(' ')[0]}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                try {
                                    const schemas = await downloadSchemas();
                                    const blob = new Blob([JSON.stringify(schemas, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'app-schemas.json';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                } catch (error) {
                                    console.error('Failed to download schemas:', error);
                                    alert('Failed to download schemas');
                                }
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Schemas
                        </Button>

                        <Link href="/dashboard/support">
                            <Button size="sm" variant="outline">
                                <LifeBuoy className="w-4 h-4 mr-2" />
                                Support
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 glass-card rounded-3xl p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
