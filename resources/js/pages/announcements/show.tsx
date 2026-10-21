import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    User,
    FileText,
    ExternalLink,
    MapPin,
    Clock,
    Users,
    Download,
    ArrowLeft,
} from 'lucide-react';
import React, { useState } from 'react';
import AnnouncementCard from '@/components/public/announcement-card';
import AnnouncementGallery from '@/components/public/announcement-gallery';
import AnnouncementSlider from '@/components/public/announcement-slider';
import PageHero from '@/components/public/page-hero';
import ShareButtons from '@/components/public/share-buttons';
import { formatDate } from '@/lib/format';

interface ShowProps {
    announcement: any;
    latestAnnouncements?: any[];
    relatedAnnouncements?: any[];
    categories?: any[];
}

export default function Show({
    announcement,
    latestAnnouncements = [],
    relatedAnnouncements = [],
    categories = [],
}: ShowProps) {
    const page = usePage();
    const sharedProps = page.props as Record<string, any>;
    const settings = sharedProps.settings || {};
    const baseUrl = sharedProps.appUrl || 'http://localhost:8000';

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const categoryName = announcement.category?.name || 'Umum';
    const dateFormatted = formatDate(announcement.published_at);
    const eventDetail = announcement.event_detail;

    const seoTitle = announcement.meta_title || announcement.title;
    const seoDescription =
        announcement.meta_description ||
        announcement.excerpt ||
        (announcement.content ? announcement.content.replace(/<[^>]*>/g, '').trim().substring(0, 160) : announcement.title);

    const rawImage = announcement.thumbnail
        ? `/storage/${announcement.thumbnail}`
        : settings.app_logo
          ? `/storage/${settings.app_logo}`
          : '/apple-touch-icon.png';
    const absoluteOgImage = rawImage.startsWith('http')
        ? rawImage
        : `${baseUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    const canonicalUrl = `${baseUrl}/announcements/${announcement.slug}`;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': announcement.type === 'event' ? 'Event' : 'NewsArticle',
            headline: announcement.title,
            description: seoDescription,
            datePublished: announcement.published_at,
            dateModified: announcement.updated_at || announcement.published_at,
            author: {
                '@type': 'Person',
                name: announcement.author?.name || 'Admin LPDSA',
            },
            publisher: {
                '@type': 'Organization',
                name: 'LPDSA Universitas Abdurrab',
                url: 'https://univrab.ac.id',
            },
            image: [absoluteOgImage],
            ...(announcement.type === 'event' && eventDetail
                ? {
                      name: announcement.title,
                      startDate: eventDetail.start_at,
                      endDate: eventDetail.end_at,
                      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                      eventStatus: 'https://schema.org/EventScheduled',
                      location: {
                          '@type': 'Place',
                          name: eventDetail.location || 'Universitas Abdurrab',
                          address: 'Jl. Riau Ujung No. 73, Tampan, Pekanbaru, Riau 28291',
                      },
                  }
                : {}),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Beranda',
                    item: `${baseUrl}/`,
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Pengumuman',
                    item: `${baseUrl}/announcements`,
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: announcement.title,
                },
            ],
        },
    ];

    return (
        <>
            <Head title={seoTitle}>
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:site_name" content={settings.app_name || 'LPDSA Universitas Abdurrab'} />
                <meta property="og:title" content={`${seoTitle} - ${settings.app_name || 'LPDSA Universitas Abdurrab'}`} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={absoluteOgImage} />
                <meta property="og:locale" content="id_ID" />
                {announcement.published_at && (
                    <meta property="article:published_time" content={announcement.published_at} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${seoTitle} - ${settings.app_name || 'LPDSA Universitas Abdurrab'}`} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={absoluteOgImage} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Head>

            {/* Page Hero with Univrab style (Breadcrumbs, Eyebrow, H1, Meta Bar) */}
            <PageHero
                breadcrumbs={[
                    { label: 'Pengumuman', href: '/announcements' },
                    { label: announcement.title },
                ]}
                eyebrow={categoryName}
                title={announcement.title}
                meta={
                    <>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                            <Calendar className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                            <span>{dateFormatted}</span>
                        </div>
                        <span className="text-slate-300 dark:text-neutral-700">•</span>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                            <User className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                            <span>{announcement.author?.name || 'Admin LPDSA'}</span>
                        </div>
                        {announcement.type === 'event' && (
                            <>
                                <span className="text-slate-300 dark:text-neutral-700">•</span>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-100 text-gold-800 dark:bg-gold-950/80 dark:text-gold-300">
                                    Agenda / Event
                                </span>
                            </>
                        )}
                    </>
                }
            />

            {/* Content Body with 2-Column Sidebar Layout */}
            <div className="bg-slate-50 dark:bg-neutral-950 py-12 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Main Article (Col 8) */}
                        <main className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-neutral-800 shadow-sm min-w-0 overflow-hidden">
                            {/* Image Showcase: Hero Slider when multiple images or single image */}
                            <AnnouncementSlider
                                images={announcement.images}
                                thumbnail={announcement.thumbnail}
                                title={announcement.title}
                                onOpenLightbox={(idx) => setLightboxIndex(idx)}
                            />

                            {/* Event Detail Widget (if type === 'event') */}
                            {announcement.type === 'event' && eventDetail && (
                                <div className="mb-10 rounded-2xl border-2 border-gold-400/40 bg-gold-50/50 dark:bg-neutral-950 dark:border-gold-500/30 p-6 sm:p-8">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gold-200 dark:border-neutral-800">
                                        <div className="h-8 w-8 rounded-lg bg-gold-500 text-neutral-950 flex items-center justify-center font-bold">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-none">
                                                Informasi Agenda & Pelaksanaan
                                            </h2>
                                            <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                                Jadwal resmi kegiatan
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                        {eventDetail.start_at && (
                                            <div className="flex items-start gap-2.5">
                                                <Clock className="h-4 w-4 text-gold-600 dark:text-gold-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold block text-slate-800 dark:text-neutral-200">Waktu Mulai:</span>
                                                    <span className="text-slate-600 dark:text-neutral-400">
                                                        {formatDate(eventDetail.start_at, true)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {eventDetail.location && (
                                            <div className="flex items-start gap-2.5">
                                                <MapPin className="h-4 w-4 text-gold-600 dark:text-gold-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold block text-slate-800 dark:text-neutral-200">Lokasi / Ruangan:</span>
                                                    <span className="text-slate-600 dark:text-neutral-400">
                                                        {eventDetail.location}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {eventDetail.speaker && (
                                            <div className="flex items-start gap-2.5">
                                                <User className="h-4 w-4 text-gold-600 dark:text-gold-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold block text-slate-800 dark:text-neutral-200">Narasumber / Pembicara:</span>
                                                    <span className="text-slate-600 dark:text-neutral-400">
                                                        {eventDetail.speaker}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {eventDetail.quota && (
                                            <div className="flex items-start gap-2.5">
                                                <Users className="h-4 w-4 text-gold-600 dark:text-gold-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <span className="font-bold block text-slate-800 dark:text-neutral-200">Kuota Peserta:</span>
                                                    <span className="text-slate-600 dark:text-neutral-400">
                                                        {eventDetail.quota} Orang
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {eventDetail.registration_link && (
                                        <div className="mt-6 pt-4 border-t border-gold-200 dark:border-neutral-800 flex justify-end">
                                            <a
                                                href={eventDetail.registration_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                                            >
                                                <span>Daftar Sekarang</span>
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Main Rich Content HTML */}
                            <article
                                className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-neutral-200 leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden
                                    prose-headings:font-extrabold prose-headings:text-slate-900 dark:prose-headings:text-white
                                    prose-a:text-brand-700 dark:prose-a:text-gold-400 hover:prose-a:underline
                                    prose-img:rounded-2xl prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: announcement.content }}
                            />

                            {/* Photo Gallery (Multi-Image Showcase) */}
                            {announcement.images && announcement.images.length > 0 && (
                                <AnnouncementGallery
                                    images={announcement.images}
                                    selectedIndex={lightboxIndex}
                                    onSelectIndex={setLightboxIndex}
                                />
                            )}

                            {/* Attachments Section */}
                            {announcement.attachments && announcement.attachments.length > 0 && (
                                <section aria-label="Lampiran Dokumen" className="mt-12 pt-8 border-t border-slate-200 dark:border-neutral-800">
                                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-brand-700 dark:text-gold-400" />
                                        <span>Dokumen Lampiran ({announcement.attachments.length})</span>
                                    </h2>

                                    <div className="space-y-3">
                                        {announcement.attachments.map((file: any) => {
                                            const isLink = file.type === 'link';
                                            const fileUrl = isLink ? file.path : `/storage/${file.path}`;

                                            return (
                                                <a
                                                    key={file.id}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/80 hover:border-brand-700 hover:bg-white dark:hover:bg-neutral-800 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 pr-4">
                                                        <div className="h-9 w-9 rounded-xl bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 text-brand-700 dark:text-gold-400 border border-slate-200 dark:border-neutral-700">
                                                            {isLink ? (
                                                                <ExternalLink className="h-4 w-4" />
                                                            ) : (
                                                                <FileText className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div className="truncate">
                                                            <span className="block text-sm font-bold text-slate-800 dark:text-neutral-200 group-hover:text-brand-700 dark:group-hover:text-gold-400 truncate">
                                                                {file.title || 'Dokumen Terlampir'}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                                {isLink ? 'Tautan Eksternal' : 'Unduhan Dokumen'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 group-hover:bg-brand-700 group-hover:text-white group-hover:border-brand-700 transition-colors">
                                                        {isLink ? 'Buka' : 'Unduh'}
                                                        {isLink ? <ExternalLink className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                                                    </span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* Share Buttons & Back link */}
                            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <Link
                                    href="/announcements"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:text-brand-700 dark:hover:text-gold-400 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Kembali ke Arsip Pengumuman</span>
                                </Link>

                                <ShareButtons title={announcement.title} />
                            </div>
                        </main>

                        {/* Sidebar Column (Col 4) */}
                        <aside className="lg:col-span-4 space-y-8">
                            {/* Widget: Pengumuman Terkait */}
                            {relatedAnnouncements && relatedAnnouncements.length > 0 && (
                                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm">
                                    <div className="border-b-2 border-brand-700 dark:border-gold-400 pb-3 mb-4">
                                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                            Pengumuman Terkait
                                        </h3>
                                    </div>

                                    <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                                        {relatedAnnouncements.map((item: any) => (
                                            <AnnouncementCard
                                                key={item.id}
                                                announcement={item}
                                                variant="compact"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Widget: Pengumuman Terbaru */}
                            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm">
                                <div className="border-b-2 border-brand-700 dark:border-gold-400 pb-3 mb-4">
                                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                        Pengumuman Terbaru
                                    </h3>
                                </div>

                                <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                                    {latestAnnouncements.length > 0 ? (
                                        latestAnnouncements.map((item: any) => (
                                            <AnnouncementCard
                                                key={item.id}
                                                announcement={item}
                                                variant="compact"
                                            />
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 py-3">
                                            Tidak ada pengumuman lainnya.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Widget: Kategori */}
                            {categories.length > 0 && (
                                <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm">
                                    <div className="border-b-2 border-brand-700 dark:border-gold-400 pb-3 mb-4">
                                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                            Kategori Informasi
                                        </h3>
                                    </div>

                                    <div className="space-y-1.5">
                                        {categories.map((cat: any) => (
                                            <Link
                                                key={cat.id}
                                                href={`/announcements?category=${cat.slug}`}
                                                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-800/60 transition-colors"
                                            >
                                                <span>{cat.name}</span>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
                                                    {cat.announcements_count ?? ''}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Widget: Bantuan Kontak */}
                            <div className="p-6 rounded-3xl bg-linear-to-br from-brand-900 to-brand-950 text-white shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
                                <div className="relative space-y-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                                        Layanan Informasi
                                    </span>
                                    <h4 className="font-extrabold text-base text-white">
                                        Pertanyaan Seputar Pengumuman?
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Hubungi sekretariat LPDSA Universitas Abdurrab untuk klarifikasi edaran atau jadwal akreditasi.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-gold-400 text-neutral-950 text-xs font-bold hover:bg-gold-300 transition-colors"
                                    >
                                        <span>Kontak Lembaga</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
