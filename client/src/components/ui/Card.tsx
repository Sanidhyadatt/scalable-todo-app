"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card = ({ children, className, hover = true }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } : {}}
            className={cn(
                'glass-card rounded-2xl p-6 transition-all duration-300',
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('mb-4 border-b border-white/5 pb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 className={cn('text-xl font-bold text-white', className)}>{children}</h3>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
);
