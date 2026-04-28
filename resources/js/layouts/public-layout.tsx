import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';
import React from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-neutral-950">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
