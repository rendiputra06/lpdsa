import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    FileText,
    Globe,
    GraduationCap,
    Megaphone,
    Plus,
    RefreshCw,
    Settings,
    ShieldCheck,
    Tags,
    Users,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { dashboard } from '@/routes';
import type { DashboardProps } from '@/types/dashboard';

export default function Dashboard({
    stats,
    univAccreditation,
    recentAnnouncements,
    recentAccreditations,
    recentLogs,
}: DashboardProps) {
    const { auth, settings } = usePage().props as any;
    const userName = auth?.user?.name || 'Administrator';
    const appName = settings?.app_name || 'LPDSA';

    // Safe stats fallback
    const safeStats = {
        totalAnnouncements: stats?.totalAnnouncements ?? 0,
        publishedAnnouncements: stats?.publishedAnnouncements ?? 0,
        pendingAnnouncements: stats?.pendingAnnouncements ?? 0,
        totalCategories: stats?.totalCategories ?? 0,
        totalUsers: stats?.totalUsers ?? 0,
        totalAccreditations: stats?.totalAccreditations ?? 0,
        activeAccreditations: stats?.activeAccreditations ?? 0,
        expiringAccreditations: stats?.expiringAccreditations ?? 0,
        totalAcademicUnits: stats?.totalAcademicUnits ?? 0,
        studyProgramsCount: stats?.studyProgramsCount ?? 0,
        facultiesCount: stats?.facultiesCount ?? 0,
        lastSyncedAt: stats?.lastSyncedAt ?? null,
    };

    const safeAnnouncements = recentAnnouncements || [];
    const safeAccreditations = recentAccreditations || [];
    const safeLogs = recentLogs || [];

    const getGradeBadge = (grade: string) => {
        const lower = grade.toLowerCase();
        if (lower.includes('unggul') || lower === 'a') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {grade}
                </span>
            );
        }
        if (lower.includes('baik sekali') || lower === 'b') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {grade}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {grade}
            </span>
        );
    };

    return (
        <div className="space-y-8 pb-10">
            <Head title="Dashboard Admin - LPDSA Universitas Abdurrab" />

            {/* 1. HERO BANNER - Matching Landing Page Univrab Aesthetic */}
            <div className="relative rounded-3xl bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 overflow-hidden">
                {/* Background decorative dots */}
                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left text column */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300 border border-white/20">
                            <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                            <span>Pusat Kendali Administrasi {appName}</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                            Selamat Datang, {userName}!
                        </h1>

                        <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl leading-relaxed">
                            Panel operasional Lembaga Pangkalan Data, Penjaminan Mutu (SPMI), dan Fasilitasi Akreditasi Universitas Abdurrab. Kelola publikasi informasi resmi, status akreditasi, serta sinkronisasi master data akademik.
                        </p>

                        {/* Quick CTA Action Pills */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Button
                                asChild
                                className="bg-gold-400 hover:bg-gold-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-full px-5 py-2.5 shadow-lg hover:scale-102 transition-all gap-2"
                            >
                                <Link href="/admin/announcements/create">
                                    <Plus className="h-4 w-4" />
                                    <span>Buat Pengumuman</span>
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="glass-pill text-white hover:bg-white/20 hover:text-white border-white/20 rounded-full px-4 py-2 text-xs font-semibold transition-all gap-1.5"
                            >
                                <Link href="/admin/accreditations">
                                    <Award className="h-3.5 w-3.5 text-gold-300" />
                                    <span>Data Akreditasi</span>
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                asChild
                                className="glass-pill text-white hover:bg-white/20 hover:text-white border-white/20 rounded-full px-4 py-2 text-xs font-semibold transition-all gap-1.5"
                            >
                                <Link href="/admin/academic-units">
                                    <GraduationCap className="h-3.5 w-3.5 text-gold-300" />
                                    <span>Unit Akademik</span>
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                asChild
                                className="text-slate-300 hover:text-white text-xs gap-1.5"
                            >
                                <Link href="/" target="_blank">
                                    <Globe className="h-3.5 w-3.5 text-slate-300" />
                                    <span>Lihat Portal Publik</span>
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right summary card - Asymmetrical framing */}
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl bg-white/10 dark:bg-neutral-900/60 backdrop-blur-md border border-white/15 p-5 space-y-3.5 shadow-lg">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-200">
                                <span className="font-semibold text-gold-300 uppercase tracking-wider text-[11px]">
                                    Ringkasan Sistem
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Sistem Aktif
                                </span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-300">Akreditasi Institusi:</span>
                                    <span className="font-bold text-gold-300 text-sm">
                                        {univAccreditation?.grade || 'Baik Sekali'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-300">Program Studi Terdata:</span>
                                    <span className="font-bold text-white">
                                        {safeStats.studyProgramsCount} Program Studi
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-300">Fakultas Terdata:</span>
                                    <span className="font-bold text-white">
                                        {safeStats.facultiesCount} Fakultas
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-300">Sinkronisasi API:</span>
                                    <span className="font-mono text-slate-200 text-[11px]">
                                        {safeStats.lastSyncedAt ? formatDate(safeStats.lastSyncedAt) : 'Dataset Lokal'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. STAT METRICS OVERVIEW - Matching Landing Page Card Polish */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 1. Pengumuman */}
                <Link
                    href="/admin/announcements"
                    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {safeStats.totalAnnouncements}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
                        Pengumuman
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                        {safeStats.publishedAnnouncements} rilis • {safeStats.pendingAnnouncements} draft
                    </div>
                </Link>

                {/* 2. Akreditasi */}
                <Link
                    href="/admin/accreditations"
                    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-gold-50 dark:bg-gold-950/70 text-gold-600 dark:text-gold-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Award className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {safeStats.totalAccreditations}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
                        Data Akreditasi
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                        {safeStats.activeAccreditations} aktif {safeStats.expiringAccreditations > 0 ? `• ${safeStats.expiringAccreditations} segera berakhir` : ''}
                    </div>
                </Link>

                {/* 3. Unit Akademik */}
                <Link
                    href="/admin/academic-units"
                    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {safeStats.totalAcademicUnits}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
                        Unit Akademik
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                        {safeStats.studyProgramsCount} prodi • {safeStats.facultiesCount} fakultas
                    </div>
                </Link>

                {/* 4. Kategori */}
                <Link
                    href="/admin/categories"
                    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Tags className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {safeStats.totalCategories}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
                        Kategori Rilis
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                        Kategori pengumuman aktif
                    </div>
                </Link>

                {/* 5. Pengguna & Log */}
                <Link
                    href="/admin/activity-logs"
                    className="group p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-lg transition-all duration-300 col-span-2 md:col-span-1"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Activity className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {safeStats.totalUsers}
                    </div>
                    <div className="text-xs font-bold text-slate-600 dark:text-neutral-400 mt-1">
                        Pengguna & Staf
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                        {safeLogs.length} aktivitas terbaru
                    </div>
                </Link>
            </div>

            {/* 3. TIGA PILAR UTAMA LPDSA - Aksi & Akses Cepat */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-gold-400" />
                    <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                        Tiga Pilar Manajemen Layanan LPDSA
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Pilar 1: Pangkalan Data */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 flex items-center justify-center text-brand-700 dark:text-gold-400 mb-4 group-hover:scale-110 transition-transform">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Pangkalan Data (PDDIKTI)
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
                                Pengelolaan master data Universitas, Fakultas, dan 15 Program Studi dengan sinkronisasi API sistem akademik sebelah sebagai sumber acuan resmi.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                                {safeStats.studyProgramsCount} Prodi Aktif
                            </span>
                            <Link
                                href="/admin/academic-units"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Kelola Unit</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Pilar 2: Penjaminan Mutu */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="h-12 w-12 rounded-2xl bg-gold-50 dark:bg-gold-950/80 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-4 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Penjaminan Mutu (SPMI)
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
                                Pengunggahan dokumen standar mutu, pedoman akademik, SOP layanan, berita kegiatan AMI, dan instrumen monev civitas akademika.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                                Regulasi & Dokumen
                            </span>
                            <Link
                                href="/admin/static-pages"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Halaman SPMI</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Pilar 3: Fasilitasi Akreditasi */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                        <div>
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                <Award className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                Fasilitasi Akreditasi
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
                                Pencatatan peringkat akreditasi BAN-PT & LAM (LAM-PTKes, LAM-INFOKOM, dll.), pemantauan tanggal kedaluwarsa SK, dan sertifikat resmi.
                            </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">
                                {safeStats.totalAccreditations} Sertifikat
                            </span>
                            <Link
                                href="/admin/accreditations"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-gold-400 group-hover:underline"
                            >
                                <span>Kelola Akreditasi</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. CONTENT GRID: Pengumuman Terbaru & Akreditasi / Log */}
            <div className="grid gap-6 lg:grid-cols-12 items-start">
                {/* Left: Pengumuman Terbaru (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Megaphone className="h-4 w-4 text-[#8B142C] dark:text-gold-400" />
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                Pengumuman & Berita Terbaru
                            </h3>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-[#8B142C] dark:text-gold-400 hover:text-[#721024]">
                            <Link href="/admin/announcements">
                                <span>Lihat Semua</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
                        {safeAnnouncements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="rounded-full bg-slate-100 dark:bg-neutral-800 p-3 mb-3 text-slate-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Belum ada pengumuman
                                </p>
                                <p className="text-xs text-slate-500 mt-1 mb-3">
                                    Mulai membuat rilis pengumuman atau berita lembaga
                                </p>
                                <Button size="sm" asChild className="bg-[#8B142C] text-white">
                                    <Link href="/admin/announcements/create">
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Buat Pengumuman
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {safeAnnouncements.map((item, idx) => (
                                    <Link
                                        key={item.id}
                                        href={`/admin/announcements/${item.id}`}
                                        className="group flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-slate-200/80 dark:hover:border-neutral-700/60 transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-gold-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            {idx + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                                    {item.title}
                                                </h4>
                                                {item.status === 'draft' && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-neutral-400">
                                                {item.category && (
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-[11px] font-semibold text-slate-700 dark:text-neutral-300">
                                                        {item.category.name}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-[11px]">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors shrink-0 mt-1" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Status Akreditasi & Activity Logs (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Section Akreditasi Terkini */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-gold-500 dark:text-gold-400" />
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                    Akreditasi Terkini
                                </h3>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-gold-600 dark:text-gold-400">
                                <Link href="/admin/accreditations">
                                    <span>Semua</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-xs space-y-2">
                            {safeAccreditations.length === 0 ? (
                                <div className="text-center py-6 text-xs text-slate-500">
                                    Belum ada data akreditasi.
                                </div>
                            ) : (
                                safeAccreditations.map((acc: any) => (
                                    <div
                                        key={acc.id}
                                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-100 dark:border-neutral-800 text-xs"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white truncate">
                                                {acc.level && (
                                                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-neutral-700">
                                                        {acc.level}
                                                    </span>
                                                )}
                                                <span className="truncate">{acc.unit_name}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                                                Lembaga: <span className="font-semibold">{acc.accreditation_body}</span>
                                                {acc.valid_until && (
                                                    <span> • Berlaku s/d {new Date(acc.valid_until).getFullYear()}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            {getGradeBadge(acc.grade)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Section Log Aktivitas */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                    Aktivitas Terbaru
                                </h3>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-slate-600 dark:text-neutral-400">
                                <Link href="/admin/activity-logs">
                                    <span>Log Lengkap</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-xs">
                            {safeLogs.length === 0 ? (
                                <div className="text-center py-6 text-xs text-slate-500">
                                    Belum ada catatan aktivitas.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {safeLogs.slice(0, 4).map((log) => (
                                        <div key={log.id} className="flex items-start gap-2.5 text-xs">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                                                <Clock className="h-3 w-3 text-slate-500 dark:text-neutral-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-slate-800 dark:text-neutral-200 leading-snug">
                                                    {log.activity}
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                                                    {log.user?.name || 'Sistem'} • {formatDate(log.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
