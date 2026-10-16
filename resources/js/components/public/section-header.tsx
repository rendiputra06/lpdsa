import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';

interface SectionHeaderProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    actionHref?: string;
    actionLabel?: string;
    align?: 'left' | 'center';
    className?: string;
}

export default function SectionHeader({
    eyebrow,
    title,
    description,
    actionHref,
    actionLabel,
    align = 'left',
    className = '',
}: SectionHeaderProps) {
    const isCenter = align === 'center';

    return (
        <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${
                isCenter ? 'text-center md:items-center' : ''
            } ${className}`}
        >
            <div className={`max-w-3xl ${isCenter ? 'mx-auto' : ''}`}>
                {eyebrow && (
                    <div className="inline-flex items-center gap-2 mb-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-gold-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400">
                            {eyebrow}
                        </span>
                    </div>
                )}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2.5 text-base sm:text-lg text-slate-600 dark:text-neutral-400 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {actionHref && actionLabel && (
                <div className={`shrink-0 ${isCenter ? 'mt-4' : 'mt-2 md:mt-0'}`}>
                    <Link
                        href={actionHref}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm font-semibold text-slate-700 dark:text-neutral-200 hover:border-brand-700 hover:text-brand-700 dark:hover:border-gold-400 dark:hover:text-gold-400 transition-all shadow-xs"
                    >
                        <span>{actionLabel}</span>
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
