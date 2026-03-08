import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm", className)}>
            {children}
        </div>
    );
}

export function CardHeader({ title, subtitle, className }: { title: string; subtitle?: React.ReactNode; className?: string }) {
    return (
        <div className={cn("p-4 border-b border-zinc-800/50", className)}>
            <h3 className="text-zinc-200 font-medium tracking-tight flex items-center justify-between">{title}</h3>
            {subtitle && <div className="text-zinc-500 text-sm mt-0.5">{subtitle}</div>}
        </div>
    );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("p-4", className)}>
            {children}
        </div>
    );
}
