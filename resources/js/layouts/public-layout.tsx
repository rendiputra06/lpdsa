import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';
import BackToTop from '@/components/public/back-to-top';
import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    // Scroll to top on page navigation
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [url]);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-neutral-950">
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-univrab-blue focus:text-white focus:rounded-md"
            >
                Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
        </div>
    );
}
