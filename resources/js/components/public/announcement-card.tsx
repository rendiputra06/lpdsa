import { Link } from '@inertiajs/react';
import { Calendar, ArrowRight, FileText, ArrowUpRight, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { formatDate } from '@/lib/format';

interface AnnouncementCardProps {
    announcement: any;
    variant?: 'grid' | 'horizontal' | 'official' | 'compact';
    className?: string;
}

function getCardExcerpt(announcement: any): string {
    if (announcement.excerpt && typeof announcement.excerpt === 'string' && announcement.excerpt.trim()) {
        return announcement.excerpt.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
    }

    if (announcement.content && typeof announcement.content === 'string') {
        const plain = announcement.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();

        return plain.length > 140 ? plain.slice(0, 140) + '...' : plain;
    }

    return '';
}

export default function AnnouncementCard({
    announcement,
    variant = 'grid',
    className = '',
}: AnnouncementCardProps) {
    const detailUrl = `/announcements/${announcement.slug}`;
    const categoryName = announcement.category?.name || 'Umum';
    const dateFormatted = formatDate(announcement.published_at);
    const excerptText = getCardExcerpt(announcement);

    // Collect images for multi-image slide support
    const galleryImages: string[] = [];

    if (announcement.images && announcement.images.length > 0) {
        announcement.images.forEach((img: any) => {
            if (img.image_path) {
galleryImages.push(img.image_path);
}
        });
    } else if (announcement.thumbnail) {
        galleryImages.push(announcement.thumbnail);
    }

    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const hasMultipleImages = galleryImages.length > 1;
    const currentImagePath = galleryImages[currentImgIndex] || announcement.thumbnail;
    const hasThumbnail = Boolean(currentImagePath);

    const handlePrevSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const handleNextSlide = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % galleryImages.length);
    };

    // 1. Horizontal layout (Berita Terkini style on homepage)
    if (variant === 'horizontal') {
        return (
            <article className={`group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
                <div className="sm:w-36 sm:h-28 h-44 w-full shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-800 relative select-none">
                    {hasThumbnail ? (
                        <img
                            key={currentImagePath}
                            src={`/storage/${currentImagePath}`}
                            alt={announcement.title}
                            loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-brand-50 to-gold-50 dark:from-neutral-800 dark:to-neutral-900">
                            <FileText className="h-8 w-8 text-brand-700/40 dark:text-gold-400/40" />
                        </div>
                    )}

                    {/* Multi-image slide controls on card */}
                    {hasMultipleImages && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrevSlide}
                                aria-label="Foto sebelumnya"
                                className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-brand-700 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                            >
                                <ChevronLeft className="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextSlide}
                                aria-label="Foto selanjutnya"
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/60 hover:bg-brand-700 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                            >
                                <ChevronRight className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-1 inset-x-0 flex justify-center gap-1 z-10 pointer-events-none">
                                {galleryImages.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1 rounded-full transition-all ${
                                            i === currentImgIndex ? 'w-3 bg-gold-400' : 'w-1 bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400 mb-1.5">
                            <Calendar className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400 shrink-0" />
                            <span className="truncate">{dateFormatted}</span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 break-words overflow-hidden group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors leading-snug">
                            <Link href={detailUrl} className="break-words">{announcement.title}</Link>
                        </h3>
                        {excerptText && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 break-words overflow-hidden leading-relaxed">
                                {excerptText}
                            </p>
                        )}
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800/80">
                        <span className="text-[11px] font-semibold text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                            {categoryName}
                        </span>
                        <Link
                            href={detailUrl}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-gold-400 hover:underline shrink-0"
                        >
                            <span>Baca</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </article>
        );
    }

    // 2. Official Announcement card (Univrab Pengumuman style with pill RESMI)
    if (variant === 'official') {
        return (
            <article className={`group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-400 dark:hover:border-neutral-700 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/60 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-brand-400 animate-pulse" />
                            Resmi
                        </span>
                        <span className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {dateFormatted}
                        </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 break-words overflow-hidden group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors leading-snug">
                        <Link href={detailUrl} className="break-words">{announcement.title}</Link>
                    </h3>

                    {excerptText && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 break-words overflow-hidden leading-relaxed">
                            {excerptText}
                        </p>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-neutral-400 font-medium truncate max-w-[150px]">
                        {categoryName}
                    </span>
                    <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-gold-400 group-hover:translate-x-1 transition-transform shrink-0"
                    >
                        <span>Buka Dokumen</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </article>
        );
    }

    // 3. Compact layout for sidebar
    if (variant === 'compact') {
        return (
            <article className={`group py-3.5 border-b border-slate-100 dark:border-neutral-800 last:border-b-0 overflow-hidden min-w-0 ${className}`}>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400 truncate max-w-[120px]">
                        {categoryName}
                    </span>
                    <span>•</span>
                    <span className="shrink-0">{dateFormatted}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-neutral-200 line-clamp-2 break-words overflow-hidden group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                    <Link href={detailUrl} className="break-words">{announcement.title}</Link>
                </h4>
            </article>
        );
    }

    // 4. Standard Grid card (Archive page & related cards)
    return (
        <article className={`group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 hover:shadow-xl transition-all duration-300 ${className}`}>
            <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-neutral-800 relative select-none">
                {hasThumbnail ? (
                    <img
                        key={currentImagePath}
                        src={`/storage/${currentImagePath}`}
                        alt={announcement.title}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-brand-50 via-slate-50 to-gold-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
                        <div className="text-center">
                            <div className="h-12 w-12 rounded-xl bg-brand-700/10 dark:bg-gold-400/10 flex items-center justify-center mx-auto mb-2 text-brand-700 dark:text-gold-400">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-neutral-500 tracking-wider uppercase">
                                LPDSA UNIVRAB
                            </span>
                        </div>
                    </div>
                )}

                {/* Category Badge on Top-Left */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs text-brand-700 dark:text-gold-400 shadow-xs border border-white/40 dark:border-neutral-800">
                        {categoryName}
                    </span>
                </div>

                {/* Multi-Image Counter / Badge on Top-Right */}
                {hasMultipleImages && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs z-10">
                        <Camera className="h-3 w-3 text-gold-400" />
                        <span>
                            {currentImgIndex + 1}/{galleryImages.length}
                        </span>
                    </div>
                )}

                {/* Multi-image slide arrows on card hover */}
                {hasMultipleImages && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrevSlide}
                            aria-label="Foto sebelumnya"
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-brand-700 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 shadow-md"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNextSlide}
                            aria-label="Foto selanjutnya"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-brand-700 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20 shadow-md"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        {/* Slide Dots Indicator */}
                        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                            {galleryImages.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all ${
                                        i === currentImgIndex ? 'w-4 bg-gold-400' : 'w-1.5 bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400 shrink-0" />
                        <span>{dateFormatted}</span>
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 break-words overflow-hidden group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors leading-snug mb-2">
                        <Link href={detailUrl} className="break-words">{announcement.title}</Link>
                    </h3>

                    {excerptText && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 line-clamp-2 break-words overflow-hidden leading-relaxed">
                            {excerptText}
                        </p>
                    )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-neutral-400 font-medium truncate max-w-[150px]">
                        {announcement.author?.name || 'Admin LPDSA'}
                    </span>
                    <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1 font-semibold text-brand-700 dark:text-gold-400 group-hover:translate-x-1 transition-transform shrink-0"
                    >
                        <span>Selengkapnya</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
