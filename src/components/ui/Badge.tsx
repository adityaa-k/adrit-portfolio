import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'danger' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    };

    return (
        <span
            className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}
            {...props}
        />
    );
}
