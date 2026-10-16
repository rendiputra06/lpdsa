import { Link } from '@inertiajs/react';
import React from 'react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeroProps {
    breadcrumbs?: BreadcrumbItem[];
    eyebrow?: string;
    title: string;
    meta?: React.ReactNode;
    children?: React.ReactNode;
}

export default function PageHero({
    breadcrumbs,
    eyebrow,
    title,
    meta,
    children,
}: PageHeroProps) {
    return (
        <section aria-label={title} className="bg-white dark:bg-neutral-950 border-b border-slate-200/80 dark:border-neutral-800/80 pt-8 pb-10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mb-6">
                        <Link href="/" className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors">
                            Beranda
                        </Link>
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                <span className="text-slate-300 dark:text-neutral-600">&gt;</span>
                                {crumb.href ? (
                                    <Link href={crumb.href} className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-slate-800 dark:text-neutral-200 truncate max-w-xs sm:max-w-md">
                                        {crumb.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}

                {eyebrow && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-0.5 w-6 bg-gold-600 dark:bg-gold-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-700 dark:text-gold-400">
                            {eyebrow}
                        </span>
                    </div>
                )}

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                    {title}
                </h1>

                {meta && (
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
                        {meta}
                    </div>
                )}

                {children}

                {/* Decorative gold rule */}
                <div className="mt-8 h-px w-full bg-linear-to-r from-gold-500/40 via-gold-400/20 to-transparent" />
            </div>
        </section>
    );
}
