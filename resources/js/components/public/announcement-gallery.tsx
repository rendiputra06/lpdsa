import { X, ChevronLeft, ChevronRight, Maximize2, Camera } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { AnnouncementImage } from '@/types/announcement';

interface AnnouncementGalleryProps {
    images: AnnouncementImage[];
    title?: string;
    selectedIndex?: number | null;
    onSelectIndex?: (index: number | null) => void;
}

export default function AnnouncementGallery({
    images = [],
    title = 'Dokumentasi Kegiatan',
    selectedIndex,
    onSelectIndex,
}: AnnouncementGalleryProps) {
    const [internalIndex, setInternalIndex] = useState<number | null>(null);

    const isControlled = selectedIndex !== undefined;
    const activeIndex = isControlled ? selectedIndex : internalIndex;

    const updateActiveIndex = useCallback(
        (updater: number | null | ((prev: number | null) => number | null)) => {
            const nextVal = typeof updater === 'function' ? updater(activeIndex) : updater;

            if (onSelectIndex) {
                onSelectIndex(nextVal);
            }

            if (!isControlled) {
                setInternalIndex(nextVal);
            }
        },
        [activeIndex, isControlled, onSelectIndex]
    );

    const handleOpen = (index: number) => {
        updateActiveIndex(index);
    };

    const handleClose = useCallback(() => {
        updateActiveIndex(null);
    }, [updateActiveIndex]);

    const handlePrev = useCallback(() => {
        if (activeIndex === null) {
            return;
        }

        updateActiveIndex(activeIndex > 0 ? activeIndex - 1 : images.length - 1);
    }, [activeIndex, images.length, updateActiveIndex]);

    const handleNext = useCallback(() => {
        if (activeIndex === null) {
            return;
        }

        updateActiveIndex(activeIndex < images.length - 1 ? activeIndex + 1 : 0);
    }, [activeIndex, images.length, updateActiveIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        if (activeIndex === null) {
            return;
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent background scrolling while modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [activeIndex, handleClose, handlePrev, handleNext]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className="mt-10 pt-8 border-t border-slate-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-gold-400 flex items-center justify-center">
                        <Camera className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                            {title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                            {images.length} foto dokumentasi resmi
                        </p>
                    </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500 hidden sm:inline">
                    Klik foto untuk memperbesar
                </span>
            </div>

            {/* Gallery Grid */}
            <div className={cn(
                "grid gap-4",
                images.length === 1 && "grid-cols-1",
                images.length === 2 && "grid-cols-1 sm:grid-cols-2",
                images.length >= 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            )}>
                {images.map((img, idx) => (
                    <div
                        key={img.id || idx}
                        onClick={() => handleOpen(idx)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-neutral-800 border border-slate-200/80 dark:border-neutral-700/80 shadow-xs hover:shadow-md transition-all flex flex-col"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                                src={`/storage/${img.image_path}`}
                                alt={img.caption || `Dokumentasi ${idx + 1}`}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                                    <Maximize2 className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {img.caption && (
                            <div className="p-3 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800">
                                <p className="text-xs font-medium text-slate-700 dark:text-neutral-300 line-clamp-2">
                                    {img.caption}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox Modal (Fullscreen Image Viewer) */}
            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
                    onClick={handleClose}
                >
                    {/* Top Bar: Counter & Close */}
                    <div
                        className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md">
                            {activeIndex + 1} / {images.length}
                        </span>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                            aria-label="Tutup"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
                                aria-label="Sebelumnya"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
                                aria-label="Selanjutnya"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Center Image Container */}
                    <div
                        className="relative max-h-[85vh] max-w-5xl flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={`/storage/${images[activeIndex].image_path}`}
                            alt={images[activeIndex].caption || 'Dokumentasi'}
                            className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
                        />

                        {/* Caption Bar */}
                        {images[activeIndex].caption && (
                            <div className="mt-3 max-w-2xl px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-center text-sm font-medium text-white/90">
                                {images[activeIndex].caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
