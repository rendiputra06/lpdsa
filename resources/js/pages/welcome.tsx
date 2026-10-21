import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Database,
    ShieldCheck,
    Award,
    FileText,
    Calendar,
    FolderKanban,
    Layers,
    DownloadCloud,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AnnouncementCard from '@/components/public/announcement-card';
import EventCard from '@/components/public/event-card';
import SectionHeader from '@/components/public/section-header';
import { formatDate } from '@/lib/format';

interface WelcomeProps {
    banners?: any[];
    heroSettings?: {
        hero_badge_text?: string;
        hero_welcome_title?: string;
        hero_welcome_subtitle?: string;
    };
    featuredAnnouncement?: any;
    latestAnnouncements?: any[];
    upcomingEvents?: any[];
    latestDocuments?: any[];
    stats?: {
        announcements_count: number;
        categories_count: number;
        events_count: number;
        documents_count: number;
        accreditations_count?: number;
    };
}

export default function Welcome({
    banners = [],
    heroSettings,
    featuredAnnouncement,
    latestAnnouncements = [],
    upcomingEvents = [],
    stats = {
        announcements_count: 0,
        categories_count: 0,
        events_count: 0,
        documents_count: 0,
        accreditations_count: 0,
    },
}: WelcomeProps) {
    const activeBanners = banners?.filter((banner: any) => banner.is_active) || [];
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Carousel autoplay
    useEffect(() => {
        if (!isAutoPlaying || activeBanners.length <= 1) {
return;
}

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, activeBanners.length]);

    const goToBanner = useCallback((index: number) => {
        setCurrentBannerIndex(index);
        setIsAutoPlaying(false);
        const timeout = setTimeout(() => setIsAutoPlaying(true), 12000);

        return () => clearTimeout(timeout);
    }, []);

    const nextBanner = useCallback(() => {
        goToBanner((currentBannerIndex + 1) % (activeBanners.length || 1));
    }, [currentBannerIndex, activeBanners.length, goToBanner]);

    const prevBanner = useCallback(() => {
        goToBanner((currentBannerIndex - 1 + (activeBanners.length || 1)) % (activeBanners.length || 1));
    }, [currentBannerIndex, activeBanners.length, goToBanner]);

    const heroBadge = typeof heroSettings?.hero_badge_text === 'string' && heroSettings.hero_badge_text
        ? heroSettings.hero_badge_text
        : 'Lembaga Penjaminan Mutu & Pengembangan Pendidikan';

    const heroTitle = typeof heroSettings?.hero_welcome_title === 'string' && heroSettings.hero_welcome_title
        ? heroSettings.hero_welcome_title
        : 'Selamat Datang di Pusat Informasi & Pengumuman LPDSA';

    const heroSubtitle = typeof heroSettings?.hero_welcome_subtitle === 'string' && heroSettings.hero_welcome_subtitle
        ? heroSettings.hero_welcome_subtitle
        : 'Media resmi publikasi pengumuman akademik, penjaminan mutu, layanan digital, dan agenda Universitas Abdurrab.';

    const page = usePage();
    const sharedProps = page.props as Record<string, any>;
    const settings = sharedProps.settings || {};
    const baseUrl = sharedProps.appUrl || 'http://localhost:8000';

    const rawLogo = settings.app_logo ? `/storage/${settings.app_logo}` : '/apple-touch-icon.png';
    const absoluteLogo = rawLogo.startsWith('http') ? rawLogo : `${baseUrl}${rawLogo.startsWith('/') ? '' : '/'}${rawLogo}`;
    const canonicalUrl = `${baseUrl}/`;

    const homeTitle = 'Pusat Informasi & Pengumuman LPDSA';
    const homeDesc = settings.app_description || 'Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab. Menjamin mutu akademik, akurasi data pangkalan data, dan fasilitasi akreditasi universitas.';

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: settings.app_name || 'LPDSA Universitas Abdurrab',
            alternateName: 'Lembaga Pangkalan Data, SPMI, dan Akreditasi',
            url: baseUrl,
            logo: absoluteLogo,
            parentOrganization: {
                '@type': 'CollegeOrUniversity',
                name: 'Universitas Abdurrab',
                url: 'https://univrab.ac.id',
            },
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jl. Riau Ujung No. 73, Tampan',
                addressLocality: 'Pekanbaru',
                addressRegion: 'Riau',
                postalCode: '28291',
                addressCountry: 'ID',
            },
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '(+62) 761 387 62',
                contactType: 'customer service',
                email: 'lpdsa@univrab.ac.id',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: settings.app_name || 'LPDSA Universitas Abdurrab',
            url: baseUrl,
            potentialAction: {
                '@type': 'SearchAction',
                target: `${baseUrl}/announcements?search={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        },
    ];

    return (
        <>
            <Head title={homeTitle}>
                <meta name="description" content={homeDesc} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:site_name" content={settings.app_name || 'LPDSA Universitas Abdurrab'} />
                <meta property="og:title" content={`${homeTitle} - ${settings.app_name || 'LPDSA Universitas Abdurrab'}`} />
                <meta property="og:description" content={homeDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={absoluteLogo} />
                <meta property="og:locale" content="id_ID" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${homeTitle} - ${settings.app_name || 'LPDSA Universitas Abdurrab'}`} />
                <meta name="twitter:description" content={homeDesc} />
                <meta name="twitter:image" content={absoluteLogo} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Head>

            {/* 1. HERO SECTION (Split layout matching Univrab Homepage reference) */}
            <section
                aria-label="Sorotan Utama LPDSA"
                className="relative bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 text-white overflow-hidden pt-12 pb-24 md:pb-28"
            >
                {/* Background dot pattern */}
                <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                        {/* Hero Text Column (Left) */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300">
                                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                                <span>{heroBadge}</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.15] text-balance">
                                {heroTitle}
                            </h1>

                            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-xl">
                                {heroSubtitle}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link
                                    href="/about"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-900 font-bold text-sm hover:bg-gold-400 hover:text-neutral-950 transition-all shadow-lg hover:scale-102"
                                >
                                    <span>Tentang LPDSA</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/akreditasi"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-pill text-white font-bold text-sm hover:bg-white/20 hover:border-gold-400/50 transition-all shadow-md"
                                >
                                    <Award className="h-4 w-4 text-gold-300" />
                                    <span>Lihat Akreditasi</span>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual Container Column (Right - Curved asymmetry matching Univrab) */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                                {/* Asymmetrical curved framing matching Univrab */}
                                <div className="relative aspect-4/3 w-full rounded-tl-[64px] rounded-br-[64px] rounded-tr-3xl rounded-bl-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900">
                                    {activeBanners.length > 0 ? (
                                        activeBanners.map((banner: any, idx: number) => (
                                            <div
                                                key={banner.id}
                                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                                    idx === currentBannerIndex
                                                        ? 'opacity-100 pointer-events-auto'
                                                        : 'opacity-0 pointer-events-none'
                                                }`}
                                            >
                                                {banner.image_path ? (
                                                    <img
                                                        src={`/storage/${banner.image_path}`}
                                                        alt={banner.title}
                                                        fetchPriority={idx === 0 ? 'high' : 'low'}
                                                        className="h-full w-full object-cover animate-ken-burns"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-brand-950 via-brand-900 to-plum-950 p-8 text-center">
                                                        <div>
                                                            <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                                                                <Award className="h-8 w-8 text-gold-400" />
                                                            </div>
                                                            <h3 className="text-xl font-bold text-white mb-2">{banner.title}</h3>
                                                            <p className="text-xs text-slate-300 max-w-sm mx-auto">{banner.text}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Ambient dark gradient overlay to ensure text contrast */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

                                                {/* Overlay card for Banner Title & Description placed ON TOP of the image */}
                                                {(banner.title || banner.text) && (
                                                    <div className="absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 z-10 p-4 sm:p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="space-y-1 min-w-0">
                                                                {banner.title && (
                                                                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
                                                                        {banner.title}
                                                                    </h3>
                                                                )}
                                                                {banner.text && (
                                                                    <p className="text-xs sm:text-sm text-slate-200/90 line-clamp-2 leading-relaxed">
                                                                        {banner.text}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {banner.link && (
                                                                <a
                                                                    href={banner.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="shrink-0 p-2 rounded-xl bg-white/20 hover:bg-gold-400 hover:text-neutral-950 text-white transition-all shadow"
                                                                    title="Buka Tautan Banner"
                                                                >
                                                                    <ArrowUpRight className="h-4 w-4" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-brand-950 via-brand-900 to-plum-950 p-8 text-center">
                                            <div>
                                                <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                                                    <Award className="h-8 w-8 text-gold-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Universitas Abdurrab</h3>
                                                <p className="text-xs text-slate-300">
                                                    Lembaga Pangkalan Data, SPMI, dan Akreditasi
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Carousel Controls (Dots & Arrows) */}
                                {activeBanners.length > 1 && (
                                    <div className="flex items-center justify-between mt-4 px-2">
                                        <div className="flex items-center gap-2">
                                            {activeBanners.map((_: any, idx: number) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => goToBanner(idx)}
                                                    aria-label={`Slide ${idx + 1}`}
                                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                                        idx === currentBannerIndex
                                                            ? 'w-8 bg-gold-400'
                                                            : 'w-2 bg-white/40 hover:bg-white/70'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={prevBanner}
                                                aria-label="Slide sebelumnya"
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextBanner}
                                                aria-label="Slide selanjutnya"
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. OVERLAPPING HIGHLIGHT CARD (Matching Univrab PMB Card) */}
            <section aria-label="Akses Cepat Dokumen & Pengumuman Unggulan" className="relative -mt-16 sm:-mt-20 z-20 px-4 sm:px-6 lg:px-8 mb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl border border-slate-200/80 dark:border-neutral-800 p-6 sm:p-8 transition-colors">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Featured Announcement Pill */}
                            <div className="lg:col-span-7 space-y-3 min-w-0 overflow-hidden">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-900/60">
                                    <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-brand-400 animate-pulse" />
                                    <span>Pengumuman Terkini LPDSA</span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug break-words">
                                    {featuredAnnouncement ? (
                                        <Link
                                            href={featuredAnnouncement.slug ? `/announcements/${featuredAnnouncement.slug}` : '/announcements'}
                                            className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors break-words"
                                        >
                                            {featuredAnnouncement.title}
                                        </Link>
                                    ) : (
                                        'Portal Informasi Resmi Lembaga Pangkalan Data, SPMI, dan Akreditasi'
                                    )}
                                </h2>

                                <p className="text-sm text-slate-600 dark:text-neutral-400 line-clamp-2 break-words overflow-hidden leading-relaxed">
                                    {(featuredAnnouncement?.excerpt && featuredAnnouncement.excerpt.trim())
                                        ? featuredAnnouncement.excerpt.replace(/<[^>]*>?/gm, '').trim()
                                        : (featuredAnnouncement?.content
                                            ? featuredAnnouncement.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim().slice(0, 140) + '...'
                                            : 'Akses panduan pengisian PDDIKTI, dokumen SPMI, serta surat edaran akreditasi terbaru bagi civitas akademika Universitas Abdurrab.')}
                                </p>

                                <div className="pt-1 flex items-center gap-4 text-xs text-slate-500 dark:text-neutral-400">
                                    {featuredAnnouncement?.published_at && (
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                                            {formatDate(featuredAnnouncement.published_at)}
                                        </span>
                                    )}
                                    {featuredAnnouncement?.category && (
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-semibold text-[11px]">
                                            {featuredAnnouncement.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right: Quick Action Cards */}
                            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                                <Link
                                    href="/dokumen"
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200/70 dark:border-neutral-700/60 hover:border-brand-700 hover:shadow-md transition-all group"
                                >
                                    <div className="h-9 w-9 rounded-xl bg-brand-50 dark:bg-neutral-900 flex items-center justify-center text-brand-700 dark:text-gold-400 mb-2 group-hover:scale-110 transition-transform">
                                        <DownloadCloud className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                        Pedoman SPMI
                                    </span>
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mt-0.5">
                                        Standar & SOP Mutu
                                    </span>
                                </Link>

                                <Link
                                    href="/akreditasi"
                                    className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200/70 dark:border-neutral-700/60 hover:border-brand-700 hover:shadow-md transition-all group"
                                >
                                    <div className="h-9 w-9 rounded-xl bg-gold-50 dark:bg-neutral-900 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2 group-hover:scale-110 transition-transform">
                                        <Award className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white block group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                        Data Akreditasi
                                    </span>
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mt-0.5">
                                        Status & Sertifikat BAN-PT/LAM
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. STATISTIK LPDSA (Univrab "Tumbuh bersama generasi unggul" counter section) */}
            <section aria-label="Statistik Lembaga" className="py-12 bg-slate-50/50 dark:bg-neutral-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Transparansi & Akurasi"
                        title={
                            <>
                                Menjamin Mutu Melalui{' '}
                                <span className="text-brand-700 dark:text-gold-400">Data Terpercaya</span>.
                            </>
                        }
                        description="Pengelolaan pangkalan data terintegrasi, instrumen penjaminan mutu berkala, serta rekam jejak akreditasi institusi dan program studi."
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all">
                            <div className="h-10 w-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-700 dark:text-gold-400 mb-4">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {stats.announcements_count}+
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400 mt-1">
                                Pengumuman & Berita Terbit
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all">
                            <div className="h-10 w-10 rounded-2xl bg-gold-50 dark:bg-gold-950/60 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-4">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {stats.events_count}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400 mt-1">
                                Agenda & Event Akademik
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all">
                            <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {stats.documents_count || 12}+
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400 mt-1">
                                Dokumen SPMI & Regulasi
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all">
                            <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {stats.categories_count}
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400 mt-1">
                                Kategori Bidang Layanan
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. LAYANAN UTAMA LPDSA (3 Pilar Lembaga menggantikan "Mengapa Memilih Univrab") */}
            <section aria-label="Layanan Utama LPDSA" className="py-16 bg-white dark:bg-neutral-900/50 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Tugas & Fungsi"
                        title={
                            <>
                                Tiga Pilar Layanan Utama{' '}
                                <span className="text-brand-700 dark:text-gold-400">LPDSA</span>
                            </>
                        }
                        description="Komitmen kami dalam menjamin standar mutu pendidikan tinggi, keabsahan data nasional, dan kesuksesan akreditasi."
                        actionHref="/about"
                        actionLabel="Tentang Lembaga"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Pilar 1 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group">
                            <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-brand-700 dark:text-gold-400 mb-6 group-hover:bg-brand-700 group-hover:text-white transition-all">
                                <Database className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Pangkalan Data (PDDIKTI)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-6">
                                Pengelolaan sinkronisasi data akademik, mahasiswa, dosen, dan pelaporan berkala ke Pangkalan Data Pendidikan Tinggi Kementerian secara akurat dan tepat waktu.
                            </p>
                            <Link
                                href="/announcements?category=akademik"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Edaran Pangkalan Data</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {/* Pilar 2 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group">
                            <div className="h-14 w-14 rounded-2xl bg-gold-50 dark:bg-gold-950/60 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6 group-hover:bg-gold-500 group-hover:text-neutral-950 transition-all">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Penjaminan Mutu (SPMI)
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-6">
                                Pengembangan standar mutu universitas, pelaksanaan Audit Mutu Internal (AMI), serta penyusunan Rencana Tindak Lanjut (RTL) untuk perbaikan berkelanjutan.
                            </p>
                            <Link
                                href="/dokumen"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Unduh Pedoman Mutu</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {/* Pilar 3 */}
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <Award className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Fasilitasi Akreditasi
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-6">
                                Pendampingan penyusunan Dokumen Kinerja Program Studi (DKPS) dan Laporan Evaluasi Diri (LED) untuk BAN-PT maupun Lembaga Akreditasi Mandiri (LAM).
                            </p>
                            <Link
                                href="/announcements?category=akreditasi"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Informasi Akreditasi</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. STRIP WAVE DIVIDER & CALL TO ACTION */}
            <div className="relative bg-brand-900 text-white overflow-hidden py-14">
                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-2xl text-center md:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block mb-1">
                            Pusat Unduhan Resmi
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Butuh Dokumen Regulasi atau SOP Mutu Terbaru?
                        </h2>
                        <p className="mt-2 text-sm text-slate-200">
                            Unduh seluruh dokumen standar SPMI, formulir AMI, dan instrumen akreditasi program studi di satu tempat.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Link
                            href="/dokumen"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-400 text-neutral-950 font-bold text-sm hover:bg-gold-300 transition-all shadow-lg hover:scale-102"
                        >
                            <span>Buka Pusat Dokumen</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* 6. INFORMASI KAMPUS 3 KOLOM (Direct pattern from univrab.ac.id bottom section) */}
            <section aria-label="Berita dan Informasi Kampus" className="py-16 bg-slate-50 dark:bg-neutral-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Informasi Terkini"
                        title={
                            <>
                                Berita, Agenda &{' '}
                                <span className="text-brand-700 dark:text-gold-400">Pengumuman</span>
                            </>
                        }
                        description="Ikuti perkembangan terbaru seputar kegiatan akademik, sosialisasi mutu, dan surat edaran resmi LPDSA Universitas Abdurrab."
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Kolom 1: Agenda Kampus */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-brand-700 dark:border-gold-400">
                                <div className="h-8 w-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                                        Agenda Kampus
                                    </h3>
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                        Jadwal kegiatan akademik
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map((event: any) => (
                                        <EventCard key={event.id} event={event} />
                                    ))
                                ) : (
                                    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-center text-xs text-slate-500">
                                        Belum ada agenda kegiatan mendatang.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/announcements?category=event"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:border-brand-700 hover:text-brand-700 transition-colors shadow-xs"
                                >
                                    <span>Agenda Lainnya</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Kolom 2: Berita Terkini */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-brand-700 dark:border-gold-400">
                                <div className="h-8 w-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                                        Berita Terkini
                                    </h3>
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                        Kabar & kegiatan lembaga
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {latestAnnouncements.length > 0 ? (
                                    latestAnnouncements.slice(0, 3).map((item: any) => (
                                        <AnnouncementCard
                                            key={item.id}
                                            announcement={item}
                                            variant="horizontal"
                                        />
                                    ))
                                ) : (
                                    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-center text-xs text-slate-500">
                                        Belum ada berita yang dipublikasikan.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/announcements"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:border-brand-700 hover:text-brand-700 transition-colors shadow-xs"
                                >
                                    <span>Berita Lainnya</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>

                        {/* Kolom 3: Pengumuman Resmi */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b-2 border-brand-700 dark:border-gold-400">
                                <div className="h-8 w-8 rounded-lg bg-brand-700 text-white flex items-center justify-center">
                                    <Award className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-none">
                                        Pengumuman
                                    </h3>
                                    <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                        Rilis surat & edaran resmi
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {latestAnnouncements.length > 0 ? (
                                    latestAnnouncements.slice(0, 3).map((item: any) => (
                                        <AnnouncementCard
                                            key={item.id}
                                            announcement={item}
                                            variant="official"
                                        />
                                    ))
                                ) : (
                                    <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 text-center text-xs text-slate-500">
                                        Belum ada pengumuman resmi.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/announcements"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:border-brand-700 hover:text-brand-700 transition-colors shadow-xs"
                                >
                                    <span>Pengumuman Lainnya</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
