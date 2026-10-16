import { ArrowUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
return null;
}

    return (
        <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 shadow-2xl bg-brand-700 hover:bg-brand-800 text-white dark:bg-gold-500 dark:hover:bg-gold-400 dark:text-neutral-950 transition-all hover:scale-110 cursor-pointer border border-white/20"
            size="icon"
            aria-label="Kembali ke atas"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
