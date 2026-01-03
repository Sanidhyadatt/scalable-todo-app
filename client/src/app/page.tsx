"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, BarChart2, Globe } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">

      {/* Dynamic Background Elements for Landing Page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl w-full text-center space-y-12 relative z-10"
      >
        <motion.div variants={item} className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Now Available in v2.0</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-outfit tracking-tight leading-[1]">
            MANAGE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              EFFORTLESSLY
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience the future of project management. Built for speed, designed for scale,
            and crafted with a premium aesthetic that makes work feel like play.
          </p>
        </motion.div>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 h-14 text-base font-bold shadow-lg shadow-cyan-500/25 bg-cyan-500 hover:bg-cyan-400 text-black border-none"
            onClick={() => router.push('/register')}
          >
            Get Started Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-10 h-14 text-base font-bold border-white/10 hover:bg-white/5 hover:text-white"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          {[
            {
              icon: Shield,
              title: 'Secure by Design',
              desc: 'Enterprise-grade security with JWT authentication and bcrypt hashing standards.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10'
            },
            {
              icon: BarChart2,
              title: 'Real-time Insights',
              desc: 'Visualize your progress with instant analytics and dynamic reporting dashboards.',
              color: 'text-amber-400',
              bg: 'bg-amber-500/10'
            },
            {
              icon: Globe,
              title: 'Global Scale',
              desc: 'Architected on Next.js to handle high traffic with sub-second latency.',
              color: 'text-pink-400',
              bg: 'bg-pink-500/10'
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="group p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl text-left hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
