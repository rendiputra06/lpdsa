import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    ArrowRight, 
    AlertCircle, 
    ChevronLeft, 
    ChevronRight,
    Award,
    Database,
    GraduationCap,
    Users,
    FileCheck,
    TrendingUp
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function Welcome({ banners }: any) {
    // Banner carousel state
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Get active banners only
    const activeBanners = banners?.filter((banner: any) => banner.is_active) || [];

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || activeBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, activeBanners.length]);

    // Manual navigation
    const goToBanner = useCallback((index: number) => {
        setCurrentBannerIndex(index);
        setIsAutoPlaying(false); // Pause auto-play on manual interaction
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    }, []);

    const nextBanner = useCallback(() => {
        goToBanner((currentBannerIndex + 1) % activeBanners.length);
    }, [currentBannerIndex, activeBanners.length, goToBanner]);

    const prevBanner = useCallback(() => {
        goToBanner((currentBannerIndex - 1 + activeBanners.length) % activeBanners.length);
    }, [currentBannerIndex, activeBanners.length, goToBanner]);

    // Loading state
    const isLoading = !banners;

    // Error handling for missing data
    if (!banners) {
        return (
            <>
                <Head title="Pusat Pengumuman LPDSA" />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-slate-600 dark:text-neutral-400">Terjadi kesalahan saat memuat data. Silakan refresh halaman.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Pusat Pengumuman LPDSA">
                <meta name="description" content="Pusat Pengumuman LPDSA Universitas Abdurrab - Lembaga Pangkalan Data, SPMI, dan Akreditasi. Dapatkan informasi terkini seputar akademik, akreditasi, dan kegiatan universitas." />
                <meta property="og:title" content="Pusat Pengumuman LPDSA - Universitas Abdurrab" />
                <meta property="og:description" content="Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab. Menjamin mutu akademik dan akurasi data universitas." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Pusat Pengumuman LPDSA - Universitas Abdurrab" />
                <meta name="twitter:description" content="Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab." />
            </Head>

            {/* Hero Section / Full Screen Banner Carousel */}
            <section className="relative h-screen overflow-hidden bg-slate-900">
                {/* Full Screen Background Images with Ken Burns Effect */}
                <div className="absolute inset-0">
                    {activeBanners.length > 0 ? (
                        activeBanners.map((banner: any, index: number) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                                    index === currentBannerIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                }`}
                            >
                                {banner.image_path ? (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                                        style={{ 
                                            backgroundImage: `url(/storage/${banner.image_path})`,
                                            animation: index === currentBannerIndex ? 'kenBurns 20s ease-in-out infinite' : 'none'
                                        }}
                                    />
                                ) : (
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url('https://univrab.ac.id/wp-content/uploads/2021/08/Gedung-Univrab.jpg')` }}
                                    />
                                )}
                                {/* Subtle gradient overlay - not blocking the image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                            </div>
                        ))
                    ) : (
                        <div className="absolute inset-0">
                            <div 
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('https://univrab.ac.id/wp-content/uploads/2021/08/Gedung-Univrab.jpg')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                        </div>
                    )}
                </div>

                {/* Minimal Top Navigation Hint */}
                <div className="absolute top-6 left-6 z-20">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white/80 text-sm font-medium">Universitas Abdurrab</span>
                    </div>
                </div>

                {/* Navigation Arrows - Positioned at sides */}
                {activeBanners.length > 1 && (
                    <>
                        <button
                            onClick={prevBanner}
                            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                            aria-label="Banner sebelumnya"
                        >
                            <ChevronLeft className="h-6 w-6 text-white" />
                        </button>
                        <button
                            onClick={nextBanner}
                            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
                            aria-label="Banner selanjutnya"
                        >
                            <ChevronRight className="h-6 w-6 text-white" />
                        </button>
                    </>
                )}

                {/* Dots Indicator - Bottom center */}
                {activeBanners.length > 1 && (
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {activeBanners.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => goToBanner(index)}
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    index === currentBannerIndex
                                        ? 'bg-white w-8'
                                        : 'bg-white/40 w-2 hover:bg-white/60'
                                }`}
                                aria-label={`Pindah ke banner ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Banner Counter */}
                {activeBanners.length > 1 && (
                    <div className="absolute bottom-8 right-8 z-20 text-sm text-white/60 font-medium">
                        <span className="text-white">{currentBannerIndex + 1}</span>
                        <span className="mx-2">/</span>
                        <span>{activeBanners.length}</span>
                    </div>
                )}
            </section>

            {/* Banner Info Cards - Below the Image */}
            <section className="relative -mt-20 z-30 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {activeBanners.length > 0 ? (
                        <div className="relative">
                            {activeBanners.map((banner: any, index: number) => (
                                <div
                                    key={banner.id}
                                    className={`transition-all duration-700 ${
                                        index === currentBannerIndex
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8 absolute inset-0 pointer-events-none'
                                    }`}
                                >
                                    <Card className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-2xl border-0">
                                        <CardContent className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex-1">
                                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                                        {banner.title}
                                                    </h2>
                                                    {banner.text && (
                                                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                                                            {banner.text}
                                                        </p>
                                                    )}
                                                </div>
                                                {banner.link && (
                                                    <a
                                                        href={banner.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-univrab-blue text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg whitespace-nowrap"
                                                    >
                                                        Selengkapnya <ArrowRight className="h-5 w-5" />
                                                    </a>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm shadow-2xl border-0">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                            Lembaga Pangkalan Data, SPMI, dan Akreditasi
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-300 text-lg">
                                            Universitas Abdurrab - Menjamin Mutu, Mengelola Data, Memfasilitasi Akreditasi.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Campus Advantages Section */}
            <section className="py-20 bg-slate-50 dark:bg-neutral-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Mengapa Memilih <span className="text-univrab-blue">Universitas Abdurrab</span>?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Kampus berbasis wakaf dengan komitmen tinggi dalam pendidikan berkualitas dan pengembangan ilmu pengetahuan.
                        </p>
                    </div>

                    {/* Advantages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Advantage 1 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-univrab-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-univrab-blue group-hover:scale-110 transition-all duration-300">
                                    <Award className="h-7 w-7 text-univrab-blue group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    Akreditasi Terjamin
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Seluruh program studi telah terakreditasi dengan nilai baik dan unggul oleh BAN-PT.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advantage 2 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-univrab-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-univrab-gold group-hover:scale-110 transition-all duration-300">
                                    <Database className="h-7 w-7 text-univrab-gold group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    Pangkalan Data Modern
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Sistem informasi akademik terintegrasi dengan teknologi terkini untuk kemudahan akses data.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advantage 3 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                                    <FileCheck className="h-7 w-7 text-green-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    SPMI Berkualitas
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Sistem Penjaminan Mutu Internal yang komprehensif untuk menjaga standar pendidikan tinggi.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advantage 4 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                                    <GraduationCap className="h-7 w-7 text-purple-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    Dosen Berkualitas
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Didukung oleh pengajar berpengalaman dengan kualifikasi S2 dan S3 dari perguruan tinggi terkemuka.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advantage 5 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                                    <Users className="h-7 w-7 text-orange-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    Komunitas Akademik
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Lingkungan belajar yang kolaboratif dengan berbagai organisasi kemahasiswaan aktif.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Advantage 6 */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-800">
                            <CardContent className="p-8">
                                <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-300">
                                    <TrendingUp className="h-7 w-7 text-teal-500 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    Prospek Karir Cerah
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Alumni yang kompeten dan siap kerja dengan jaringan industri yang luas di berbagai sektor.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-12">
                        <Button 
                            size="lg" 
                            className="bg-univrab-blue hover:bg-blue-700 text-white px-8"
                            asChild
                        >
                            <Link href="/announcements">
                                Jelajahi Lebih Lanjut <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
