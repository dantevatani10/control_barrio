import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'neutral' | 'info';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
    const variantStyles = {
        success: 'bg-green-100 text-green-700',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-orange-100 text-orange-700',
        neutral: 'bg-slate-100 text-slate-700',
        info: 'bg-blue-100 text-blue-700',
    };

    return (
        <span
            className={clsx(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
