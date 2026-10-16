import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import BackToTop from '@/components/public/back-to-top';
import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';
import TopBar from '@/components/public/top-bar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    // Scroll to top on page navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [url]);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-neutral-950 font-sans selection:bg-brand-700 selection:text-white">
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-700 focus:text-white focus:rounded-md focus:shadow-lg"
            >
                Skip to main content
            </a>
            <TopBar />
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
        </div>
    );
}
