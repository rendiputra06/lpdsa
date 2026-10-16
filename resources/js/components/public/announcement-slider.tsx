import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Camera } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import type { AnnouncementImage } from '@/types/announcement';

interface AnnouncementSliderProps {
    images?: AnnouncementImage[];
    thumbnail?: string | null;
    title: string;
    onOpenLightbox?: (index: number) => void;
    autoPlayInterval?: number;
    className?: string;
}

export default function AnnouncementSlider({
    images = [],
    thumbnail = null,
    title,
    onOpenLightbox,
    autoPlayInterval = 5000,
    className = '',
}: AnnouncementSliderProps) {
    // Build normalized slide list
    const slides: { id: number; path: string; caption?: string | null; isCover?: boolean }[] = [];

    if (images && images.length > 0) {
        images.forEach((img) => {
            slides.push({
                id: img.id,
                path: img.image_path,
                caption: img.caption,
                isCover: img.is_cover,
            });
        });
    } else if (thumbnail) {
        slides.push({
            id: 0,
            path: thumbnail,
            caption: title,
            isCover: true,
        });
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const total = slides.length;

    // Autoplay effect
    useEffect(() => {
        if (!isPlaying || isHovered || total <= 1) {
return;
}

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [isPlaying, isHovered, total, autoPlayInterval]);

    if (total === 0) {
return null;
}

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) {
return;
}

        const diff = touchStartX.current - e.changedTouches[0].clientX;

        if (diff > 50) {
            goToNext();
        } else if (diff < -50) {
            goToPrev();
        }

        touchStartX.current = null;
    };

    const currentSlide = slides[currentIndex];

    // Single image fallback view
    if (total === 1) {
        return (
            <div className={`mb-8 overflow-hidden rounded-2xl bg-slate-100 dark:bg-neutral-800 border border-slate-200/60 dark:border-neutral-700/60 shadow-xs relative group ${className}`}>
                <img
                    src={`/storage/${currentSlide.path}`}
                    alt={currentSlide.caption || title}
                    fetchPriority="high"
                    className="w-full max-h-[500px] object-cover cursor-pointer"
                    onClick={() => onOpenLightbox && onOpenLightbox(0)}
                />
                {onOpenLightbox && (
                    <button
                        type="button"
                        onClick={() => onOpenLightbox(0)}
                        aria-label="Perbesar foto"
                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </button>
                )}
                {currentSlide.caption && (
                    <div className="p-3 text-xs text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 italic">
                        {currentSlide.caption}
                    </div>
                )}
            </div>
        );
    }

    return (
        <section
            aria-label="Slider Dokumentasi Pengumuman"
            className={`mb-8 space-y-3 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Slide Frame */}
            <div
                className="relative overflow-hidden rounded-2xl bg-neutral-950 aspect-16/10 sm:aspect-16/9 max-h-[520px] shadow-lg border border-slate-200/60 dark:border-neutral-800 select-none group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image */}
                <div
                    className="w-full h-full cursor-pointer flex items-center justify-center bg-black/30"
                    onClick={() => onOpenLightbox && onOpenLightbox(currentIndex)}
                >
                    <img
                        key={currentSlide.id}
                        src={`/storage/${currentSlide.path}`}
                        alt={currentSlide.caption || `${title} - Foto ${currentIndex + 1}`}
                        fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
                        className="w-full h-full object-cover transition-opacity duration-500 animate-fadeIn"
                    />
                </div>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                {/* Top Bar with Counter & Lightbox trigger */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between text-white z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md border border-white/20 shadow-sm">
                        <Camera className="h-3.5 w-3.5 text-gold-400" />
                        <span>
                            {currentIndex + 1} / {total} Foto
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setIsPlaying(!isPlaying)}
                            aria-label={isPlaying ? 'Jeda otomatis' : 'Mulai putar otomatis'}
                            className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer"
                        >
                            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </button>

                        {onOpenLightbox && (
                            <button
                                type="button"
                                onClick={() => onOpenLightbox(currentIndex)}
                                aria-label="Lihat ukuran penuh"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                                <Maximize2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Perbesar</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Left Navigation Arrow */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToPrev();
                    }}
                    aria-label="Foto Sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-brand-700 text-slate-800 hover:text-white dark:bg-neutral-900/90 dark:text-white dark:hover:bg-brand-700 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                    }}
                    aria-label="Foto Selanjutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/90 hover:bg-brand-700 text-slate-800 hover:text-white dark:bg-neutral-900/90 dark:text-white dark:hover:bg-brand-700 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Bottom Caption & Indicators */}
                <div className="absolute bottom-3 inset-x-3 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 pointer-events-none">
                    <div className="pointer-events-auto max-w-lg">
                        {currentSlide.caption ? (
                            <p className="text-xs sm:text-sm text-white/95 font-medium bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 line-clamp-2">
                                {currentSlide.caption}
                            </p>
                        ) : (
                            <span />
                        )}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5 pointer-events-auto bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Buka foto ke-${idx + 1}`}
                                className={`h-2 rounded-full transition-all cursor-pointer ${
                                    idx === currentIndex
                                        ? 'w-6 bg-gold-400'
                                        : 'w-2 bg-white/50 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Thumbnail Strip Navigation */}
            {total > 1 && total <= 10 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {slides.map((slide, idx) => (
                        <button
                            key={slide.id}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Pilih slide ${idx + 1}`}
                            className={`h-16 w-24 sm:h-20 sm:w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                                idx === currentIndex
                                    ? 'border-brand-700 dark:border-gold-400 shadow-md scale-102'
                                    : 'border-slate-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={`/storage/${slide.path}`}
                                alt={slide.caption || `Thumbnail ${idx + 1}`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                            {slide.isCover && (
                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold-500 text-neutral-950 uppercase tracking-tighter shadow-xs">
                                    Cover
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}
