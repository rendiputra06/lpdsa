import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Copy,
    Download,
    ExternalLink,
    FileText,
    GraduationCap,
    History,
    Maximize2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Accreditation } from '@/types/accreditation';

interface UniversityProps {
    university: Accreditation | null;
    history: Accreditation[];
    stats?: {
        faculties_count: number;
        study_programs_count: number;
        unggul_count: number;
        baik_sekali_count: number;
        baik_count: number;
    };
}

export default function University({ university, history = [], stats }: UniversityProps) {
    // Current selected accreditation for the right card (defaults to active university)
    const [selectedId, setSelectedId] = useState<number | null>(university?.id ?? history[0]?.id ?? null);
    const [copied, setCopied] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Get current item to display
    const currentItem: Accreditation | null =
        history.find((item) => item.id === selectedId) ||
        university ||
        history[0] ||
        null;

    const isActivePeriod = currentItem?.id === university?.id && currentItem?.status === 'active';

    const handleCopySK = (skNumber: string) => {
        navigator.clipboard.writeText(skNumber);
        setCopied(true);
        toast.success('Nomor SK berhasil disalin ke clipboard');
        setTimeout(() => setCopied(false), 2500);
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getPeriodYears = (item: Accreditation) => {
        const startYear = item.sk_date ? new Date(item.sk_date).getFullYear() : null;
        const endYear = item.valid_until ? new Date(item.valid_until).getFullYear() : null;
        if (startYear && endYear) return `${startYear} – ${endYear}`;
        if (endYear) return `s.d. ${endYear}`;
        return 'Periode Terdaftar';
    };

    const getGradeBadge = (grade: string) => {
        const g = grade.toLowerCase();
        if (g.includes('unggul') || g === 'a') {
            return (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                    ★ {grade}
                </Badge>
            );
        }
        if (g.includes('baik sekali') || g === 'b') {
            return (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                    ★ {grade}
                </Badge>
            );
        }
        if (g.includes('baik') || g === 'c') {
            return (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-2.5 py-0.5 shadow-xs">
                    ★ {grade}
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="font-bold text-xs px-2.5 py-0.5">
                {grade}
            </Badge>
        );
    };

    const isImageFile = (path?: string | null) => {
        if (!path) return false;
        const lower = path.toLowerCase();
        return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Head>
                <title>Akreditasi Institusi — Universitas Abdurrab</title>
                <meta
                    name="description"
                    content="Status resmi akreditasi institusi Universitas Abdurrab dari Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT) serta arsip riwayat sertifikasi."
                />
            </Head>

            {/* BREADCRUMB & HEADER SEDERHANA */}
            <div className="space-y-3 pb-2 border-b border-slate-200/80 dark:border-neutral-800">
                <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                    <Link href="/" className="hover:text-[#8B142C] dark:hover:text-gold-400 transition-colors">
                        Beranda
                    </Link>
                    <span>/</span>
                    <Link href="/akreditasi" className="hover:text-[#8B142C] dark:hover:text-gold-400 transition-colors">
                        Direktori Akreditasi
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Akreditasi Universitas</span>
                </nav>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Akreditasi Institusi Perguruan Tinggi
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1">
                            Universitas Abdurrab • Terakreditasi resmi oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT)
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-xl border-slate-300 dark:border-neutral-700 text-xs font-semibold hover:border-[#8B142C] hover:text-[#8B142C] dark:hover:text-gold-400 transition-all"
                        >
                            <Link href="/akreditasi">
                                <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                                <span>Lihat Akreditasi Program Studi</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* TATA LETAK 2 KOLOM: RIWAYAT SEBELAH KIRI, DATA & FOTO DI CARD KANAN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. SEBELAH KIRI: RIWAYAT AKREDITASI (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200/80 dark:border-neutral-800 shadow-xs p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-[#8B142C] dark:text-gold-400 flex items-center justify-center">
                                    <History className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Riwayat Akreditasi
                                    </h2>
                                    <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                                        {history.length} periode tercatat
                                    </p>
                                </div>
                            </div>
                            <span className="text-[11px] font-medium text-slate-400 dark:text-neutral-500">
                                Klik untuk melihat
                            </span>
                        </div>

                        {/* List Periode Akreditasi */}
                        <div className="space-y-3">
                            {history.length > 0 ? (
                                history.map((item) => {
                                    const isSelected = item.id === currentItem?.id;
                                    const isActive = item.id === university?.id && item.status === 'active';

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setSelectedId(item.id)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                                isSelected
                                                    ? 'bg-brand-50/60 dark:bg-brand-950/40 border-[#8B142C] dark:border-brand-700 shadow-xs ring-1 ring-[#8B142C]/20'
                                                    : 'bg-slate-50/50 dark:bg-neutral-800/40 border-slate-200/80 dark:border-neutral-800 hover:bg-slate-100/70 dark:hover:bg-neutral-800/80'
                                            }`}
                                        >
                                            <div className="space-y-1.5 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        Periode {getPeriodYears(item)}
                                                    </span>

                                                    {isActive && (
                                                        <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0 font-semibold">
                                                            Aktif
                                                        </Badge>
                                                    )}

                                                    {!isActive && item.status === 'expired' && (
                                                        <Badge variant="outline" className="text-slate-500 dark:text-neutral-400 text-[10px] px-1.5 py-0">
                                                            Arsip
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-neutral-400">
                                                    <span>Peringkat:</span>
                                                    <span className="font-semibold text-slate-800 dark:text-neutral-200">
                                                        {item.grade}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="truncate max-w-[140px] font-mono text-[10px]" title={item.sk_number}>
                                                        {item.sk_number}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="shrink-0 flex items-center gap-1.5">
                                                {isSelected ? (
                                                    <span className="h-6 w-6 rounded-full bg-[#8B142C] text-white flex items-center justify-center">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </span>
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 dark:text-neutral-500 text-center py-4">
                                    Belum ada data riwayat akreditasi.
                                </p>
                            )}
                        </div>

                        {/* Catatan Sederhana Untuk Alumni & Keperluan Verifikasi */}
                        <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                                <span>Panduan Ijazah Alumni & CPNS:</span>
                            </div>
                            <p className="leading-relaxed text-amber-800 dark:text-neutral-300">
                                Sesuai regulasi Kementerian dan BKN, akreditasi yang berlaku bagi alumni adalah status pada saat tanggal kelulusan Anda. Silakan pilih periode riwayat di atas sesuai tahun ijazah.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. CARD KANAN: MENAMPILKAN DATA DAN FOTONYA (lg:col-span-7) */}
                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200/80 dark:border-neutral-800 shadow-xs p-6 sm:p-7 space-y-6">
                        {/* Header Card Kanan */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-neutral-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B142C] dark:text-gold-400">
                                        Data Akreditasi Institusi
                                    </span>
                                    {isActivePeriod ? (
                                        <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0.5">
                                            ✓ Status: Aktif & Diakui Sah
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-slate-500 dark:text-neutral-400 text-[10px] px-2 py-0.5">
                                            Arsip Periode Lampau
                                        </Badge>
                                    )}
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                                    Universitas Abdurrab
                                </h2>
                            </div>

                            {/* Peringkat Badge Besar */}
                            <div className="self-start sm:self-auto">
                                {currentItem ? getGradeBadge(currentItem.grade) : null}
                            </div>
                        </div>

                        {/* 1. DATA LENGKAP AKREDITASI (RINCIAN DATA DI ATAS) */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                Rincian Data Akreditasi
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Nomor SK */}
                                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 space-y-1 sm:col-span-2">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                                        <span>Nomor Surat Keputusan (SK)</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopySK(currentItem?.sk_number || '')}
                                            className="text-slate-500 hover:text-[#8B142C] dark:hover:text-gold-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                            title="Salin Nomor SK"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-3 w-3 text-emerald-600" />
                                                    <span className="text-[10px] text-emerald-600 font-bold">Tersalin</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3 w-3" />
                                                    <span className="text-[10px]">Salin</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white break-all">
                                        {currentItem?.sk_number || '-'}
                                    </div>
                                </div>

                                {/* Lembaga Akreditasi */}
                                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 space-y-1">
                                    <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Lembaga Pengakreditasi
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-[#8B142C] dark:text-gold-400" />
                                        <span>{currentItem?.accreditation_body || 'BAN-PT'}</span>
                                    </div>
                                </div>

                                {/* Peringkat */}
                                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 space-y-1">
                                    <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Peringkat Mutu
                                    </div>
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                        {currentItem?.grade || '-'}
                                    </div>
                                </div>

                                {/* Tanggal SK */}
                                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 space-y-1">
                                    <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Tanggal Penetapan
                                    </div>
                                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{formatDate(currentItem?.sk_date)}</span>
                                    </div>
                                </div>

                                {/* Berlaku Hingga */}
                                <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 space-y-1">
                                    <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                                        Masa Berlaku
                                    </div>
                                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{formatDate(currentItem?.valid_until)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. FOTO / GAMBAR SERTIFIKAT AKREDITASI (DI BAWAH RINCIAN DATA) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                    Foto / Berkas Sertifikat
                                </h3>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsZoomOpen(true)}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-neutral-300 hover:text-[#8B142C] dark:hover:text-gold-400 transition-colors cursor-pointer"
                                    >
                                        <Maximize2 className="h-3 w-3" />
                                        <span>Perbesar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Foto / Pratinjau Container */}
                            <div className="relative rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-800/40 p-4 overflow-hidden group">
                                {currentItem?.certificate_file && isImageFile(currentItem.certificate_file) ? (
                                    <div
                                        className="cursor-pointer overflow-hidden rounded-lg flex items-center justify-center bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800"
                                        onClick={() => setIsZoomOpen(true)}
                                    >
                                        <img
                                            src={`/storage/${currentItem.certificate_file}`}
                                            alt={`Sertifikat Akreditasi Universitas Abdurrab ${currentItem.grade}`}
                                            className="w-full h-auto max-h-[360px] object-contain group-hover:scale-101 transition-transform"
                                        />
                                    </div>
                                ) : (
                                    /* Sertifikat Visual Standar Resmi (Elegan & Sederhana) */
                                    <div
                                        onClick={() => setIsZoomOpen(true)}
                                        className="cursor-pointer rounded-lg bg-white dark:bg-neutral-900 border-2 border-gold-400/30 p-6 sm:p-8 text-center space-y-4 shadow-xs relative overflow-hidden group hover:border-[#8B142C] dark:hover:border-gold-400 transition-colors"
                                    >
                                        {/* Watermark halus */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                                            <Award className="h-64 w-64 text-slate-900 dark:text-white" />
                                        </div>

                                        <div className="space-y-1 relative z-10">
                                            <div className="h-10 w-10 mx-auto rounded-full bg-gold-400/20 text-[#8B142C] dark:text-gold-400 flex items-center justify-center mb-2">
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
                                                Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT)
                                            </p>
                                            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide">
                                                SERTIFIKAT AKREDITASI
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-neutral-300">
                                                Menyatakan bahwa Institusi Perguruan Tinggi:
                                            </p>
                                            <div className="text-sm sm:text-base font-black text-[#8B142C] dark:text-gold-400 pt-1">
                                                UNIVERSITAS ABDURRAB
                                            </div>
                                        </div>

                                        <div className="py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200/80 dark:border-neutral-700 max-w-xs mx-auto space-y-0.5 relative z-10">
                                            <div className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                                                Peringkat Akreditasi
                                            </div>
                                            <div className="text-xl font-black text-blue-600 dark:text-blue-400">
                                                {currentItem?.grade || 'Baik Sekali'}
                                            </div>
                                        </div>

                                        <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 relative z-10">
                                            SK BAN-PT: {currentItem?.sk_number || '412/SK/BAN-PT/Ak/PT/VII/2023'}
                                        </div>

                                        <div className="pt-2 text-[10px] text-slate-400 dark:text-neutral-500 flex items-center justify-center gap-1.5 relative z-10">
                                            <Maximize2 className="h-3 w-3" />
                                            <span>Klik untuk pratinjau dokumen</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TOMBOL AKSI UTAMA DI BAWAH CARD */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            {currentItem?.certificate_file ? (
                                <Button
                                    asChild
                                    className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white text-xs font-bold gap-2 px-5 shadow-xs cursor-pointer"
                                >
                                    <a
                                        href={`/storage/${currentItem.certificate_file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Unduh Berkas Sertifikat</span>
                                    </a>
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => handleCopySK(currentItem?.sk_number || '')}
                                    className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white text-xs font-bold gap-2 px-5 shadow-xs cursor-pointer"
                                >
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>{copied ? 'Nomor SK Tersalin' : 'Salin Nomor SK'}</span>
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                asChild
                                className="rounded-xl border-slate-300 dark:border-neutral-700 text-xs font-semibold gap-1.5"
                            >
                                <a
                                    href="https://www.banpt.or.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Verifikasi BAN-PT</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>

                            <Button
                                variant="ghost"
                                asChild
                                className="rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-300 gap-1.5 ml-auto"
                            >
                                <a
                                    href="https://pddikti.kemdiktisaintek.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>PDDIKTI</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX / ZOOM MODAL SERTIFIKAT */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogContent className="sm:max-w-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className="h-5 w-5 text-[#8B142C] dark:text-gold-400" />
                            <span>
                                Sertifikat Akreditasi {currentItem?.grade} — Universitas Abdurrab
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800">
                        {currentItem?.certificate_file && isImageFile(currentItem.certificate_file) ? (
                            <img
                                src={`/storage/${currentItem.certificate_file}`}
                                alt="Sertifikat Akreditasi"
                                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-full max-w-xl p-8 rounded-xl bg-white dark:bg-neutral-950 border-2 border-gold-400/40 text-center space-y-4 shadow-sm">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                        Badan Akreditasi Nasional Perguruan Tinggi
                                    </p>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                        SERTIFIKAT AKREDITASI
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-neutral-300">
                                        Diberikan kepada Institusi Perguruan Tinggi:
                                    </p>
                                    <div className="text-lg font-black text-[#8B142C] dark:text-gold-400">
                                        UNIVERSITAS ABDURRAB
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 max-w-xs mx-auto">
                                    <div className="text-xs text-slate-400 font-bold uppercase">Peringkat</div>
                                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                        {currentItem?.grade || 'Baik Sekali'}
                                    </div>
                                </div>

                                <div className="text-xs font-mono text-slate-600 dark:text-neutral-400 space-y-1">
                                    <div>SK No: {currentItem?.sk_number || '412/SK/BAN-PT/Ak/PT/VII/2023'}</div>
                                    <div>Masa Berlaku: {formatDate(currentItem?.valid_until)}</div>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex items-center justify-between w-full pt-3 border-t border-slate-200 dark:border-neutral-800 text-xs">
                            <span className="text-slate-500 dark:text-neutral-400">
                                No. SK: <span className="font-mono font-bold text-slate-800 dark:text-neutral-200">{currentItem?.sk_number}</span>
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopySK(currentItem?.sk_number || '')}
                                className="text-xs gap-1.5 h-8"
                            >
                                <Copy className="h-3 w-3" />
                                <span>Salin SK</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
