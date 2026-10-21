import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    GraduationCap,
    History,
    RotateCcw,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AccreditationTimeline from '@/components/accreditation-timeline';
import EmptyState from '@/components/public/empty-state';
import PageHero from '@/components/public/page-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Accreditation, AccreditationStats } from '@/types/accreditation';

interface PaginatedAccreditations {
    data: Accreditation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface FilterParams {
    type?: string;
    level?: string;
    search?: string;
    status?: string;
    sort?: string;
}

interface Props {
    accreditations: PaginatedAccreditations;
    stats: AccreditationStats;
    filters: FilterParams;
}

const LEVEL_OPTIONS = ['all', 'D3', 'D4', 'S1', 'S2', 'Profesi'];

export default function Index({ accreditations, stats, filters = {} }: Props) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<Accreditation | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [level, setLevel] = useState(filters.level || 'all');
    const [status, setStatus] = useState(filters.status || 'active');
    const [sort, setSort] = useState(filters.sort || 'unit_type');

    const applyFilters = useCallback(
        (newParams: FilterParams) => {
            const params: Record<string, string> = {};

            if (newParams.type && newParams.type !== 'all') {
                params.type = newParams.type;
            }

            if (newParams.level && newParams.level !== 'all') {
                params.level = newParams.level;
            }

            if (newParams.search) {
                params.search = newParams.search;
            }

            if (newParams.status && newParams.status !== 'active') {
                params.status = newParams.status;
            }

            if (newParams.sort && newParams.sort !== 'unit_type') {
                params.sort = newParams.sort;
            }

            router.get('/akreditasi', params, {
                preserveState: true,
                preserveScroll: true,
            });
        },
        []
    );

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters({ search, type, level, status, sort });
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, type, level, status, sort, filters.search, applyFilters]);

    const handleTypeChange = (newType: string) => {
        setType(newType);
        // If type is university or faculty, reset level
        const nextLevel = newType === 'university' || newType === 'faculty' ? 'all' : level;

        if (nextLevel !== level) {
            setLevel('all');
        }

        applyFilters({ search, type: newType, level: nextLevel, status, sort });
    };

    const handleLevelChange = (newLevel: string) => {
        setLevel(newLevel);
        applyFilters({ search, type, level: newLevel, status, sort });
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        applyFilters({ search, type, level, status: newStatus, sort });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        applyFilters({ search, type, level, status, sort: newSort });
    };

    const handleReset = () => {
        setSearch('');
        setType('all');
        setLevel('all');
        setStatus('active');
        setSort('unit_type');
        router.get('/akreditasi', {}, { preserveState: true });
    };

    const hasActiveFilters = Boolean(
        search ||
            (type && type !== 'all') ||
            (level && level !== 'all') ||
            (status && status !== 'active') ||
            (sort && sort !== 'unit_type')
    );

    const getGradeBadge = (grade: string) => {
        const lower = grade.toLowerCase();

        if (lower.includes('unggul') || lower === 'a') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    ★ {grade}
                </span>
            );
        }

        if (lower.includes('baik sekali') || lower === 'b') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                    {grade}
                </span>
            );
        }

        if (lower.includes('baik') || lower === 'c') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {grade}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-slate-300">
                {grade}
            </span>
        );
    };

    const getStatusBadge = (itemStatus: string, validUntil: string | null) => {
        if (itemStatus === 'expired') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                    Kedaluwarsa
                </span>
            );
        }

        if (itemStatus === 'in_process') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400">
                    Proses Re-Akreditasi
                </span>
            );
        }

        if (validUntil) {
            const until = new Date(validUntil);
            const now = new Date();
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(now.getMonth() + 6);

            if (until < now) {
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400">
                        Kedaluwarsa
                    </span>
                );
            }

            if (until <= sixMonthsFromNow) {
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Segera Berakhir
                    </span>
                );
            }
        }

        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Aktif
            </span>
        );
    };

    const univItem = stats.university;

    return (
        <>
            <Head title="Data Akreditasi - Universitas Abdurrab">
                <meta
                    name="description"
                    content="Status dan peringkat akreditasi BAN-PT & LAM untuk Universitas Abdurrab, Fakultas, dan seluruh Program Studi (D3, S1, Profesi)."
                />
                <meta property="og:title" content="Data Akreditasi - Universitas Abdurrab" />
                <meta
                    property="og:description"
                    content="Informasi resmi status dan peringkat akreditasi universitas, fakultas, dan program studi di Universitas Abdurrab."
                />
            </Head>

            {/* Page Hero */}
            <PageHero
                breadcrumbs={[{ label: 'Data Akreditasi' }]}
                eyebrow="PENJAMINAN MUTU & AKREDITASI"
                title="Data Akreditasi Institusi & Program Studi"
            >
                <p className="mt-3 text-base text-slate-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                    Dokumentasi resmi status, peringkat, dan masa berlaku sertifikat akreditasi BAN-PT serta Lembaga Akreditasi Mandiri (LAM) di lingkungan Universitas Abdurrab.
                </p>
            </PageHero>

            <main className="py-10 bg-slate-50/60 dark:bg-neutral-950 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* 1. INSTITUTIONAL ACCREDITATION SHOWCASE */}
                    {univItem && (
                        <div className="relative rounded-3xl bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-brand-700/50">
                            {/* Decorative background circle */}
                            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-gold-400/10 blur-2xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-3 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300">
                                        <ShieldCheck className="h-4 w-4 text-gold-400" />
                                        <span>Akreditasi Institusi Perguruan Tinggi</span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                        Universitas Abdurrab
                                    </h2>

                                    <p className="text-slate-200 text-sm leading-relaxed">
                                        Terakreditasi <span className="font-bold text-gold-300">{univItem.grade}</span> oleh{' '}
                                        <span className="font-semibold text-white">{univItem.accreditation_body}</span> berdasarkan Keputusan No.{' '}
                                        <span className="font-mono text-gold-200">{univItem.sk_number}</span>.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-gold-400" />
                                            Berlaku hingga:{' '}
                                            <strong className="text-white">
                                                {univItem.valid_until
                                                    ? new Date(univItem.valid_until).toLocaleDateString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'long',
                                                          year: 'numeric',
                                                      })
                                                    : '-'}
                                            </strong>
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30 text-[11px]">
                                            Status: Aktif
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                                    <div className="text-center sm:text-right">
                                        <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">Peringkat</div>
                                        <div className="text-3xl sm:text-4xl font-black text-gold-400 drop-shadow">
                                            {univItem.grade}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href="/akreditasi/universitas"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-400 hover:bg-gold-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-102"
                                        >
                                            <span>Halaman Khusus Universitas &rarr;</span>
                                        </Link>
                                        {univItem.certificate_file && (
                                            <a
                                                href={`/storage/${univItem.certificate_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                <span>Unduh Sertifikat</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. STATS SUMMARY BAR */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/akreditasi/universitas" className="group">
                            <Card className="bg-white dark:bg-neutral-900 border-slate-200/80 dark:border-neutral-800 hover:border-gold-400/60 dark:hover:border-gold-400/40 transition-all shadow-xs h-full">
                                <CardContent className="p-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Akreditasi Institusi</div>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white">1 Perguruan Tinggi</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-gold-500 transition-colors" />
                                </CardContent>
                            </Card>
                        </Link>

                        <Card className="bg-white dark:bg-neutral-900 border-slate-200/80 dark:border-neutral-800">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Fakultas Terakreditasi</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                                        {stats.faculties_count || 0} Fakultas
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-slate-200/80 dark:border-neutral-800">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Program Studi</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                                        {stats.study_programs_count || 0} Program Studi
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-neutral-900 border-slate-200/80 dark:border-neutral-800">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Status Aktif</div>
                                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {stats.active} Dokumen
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 3. FILTER & SEARCH CONTROLS */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 shadow-sm border border-slate-200/80 dark:border-neutral-800 space-y-4">
                        {/* Upper row: Unit Type Tabs & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            {/* Type Tabs */}
                            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-neutral-800 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
                                {[
                                    { key: 'all', label: 'Semua' },
                                    { key: 'university', label: 'Universitas' },
                                    { key: 'faculty', label: 'Fakultas' },
                                    { key: 'study_program', label: 'Program Studi' },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleTypeChange(tab.key)}
                                        className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                                            type === tab.key
                                                ? 'bg-brand-900 text-white shadow-sm'
                                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search & Sort Controls */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-64">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari prodi, fakultas, SK..."
                                        className="pl-9 pr-8 h-9 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters({ search: '', type, level, sort });
                                            }}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="h-9 w-36 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif (Berlaku)</SelectItem>
                                        <SelectItem value="expiring_soon">Segera Berakhir</SelectItem>
                                        <SelectItem value="expired">Kedaluwarsa</SelectItem>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sort} onValueChange={handleSortChange}>
                                    <SelectTrigger className="h-9 w-44 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700">
                                        <SelectValue placeholder="Urutan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unit_type">Tingkat Institusi</SelectItem>
                                        <SelectItem value="grade">Peringkat Tertinggi</SelectItem>
                                        <SelectItem value="valid_until">Masa Berlaku</SelectItem>
                                        <SelectItem value="name">Nama Entitas (A-Z)</SelectItem>
                                    </SelectContent>
                                </Select>

                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleReset}
                                        className="h-9 rounded-xl text-xs gap-1 border-slate-300 dark:border-neutral-700 shrink-0"
                                        title="Reset semua filter"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">Reset</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Jenjang Filter Chips (Shown when 'all' or 'study_program' is selected) */}
                        {(type === 'all' || type === 'study_program') && (
                            <div className="pt-3 border-t border-slate-100 dark:border-neutral-800/80 flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium mr-1">
                                    Jenjang Prodi:
                                </span>
                                {LEVEL_OPTIONS.map((lvl) => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => handleLevelChange(lvl)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                            level === lvl
                                                ? 'bg-gold-400 text-neutral-950 font-bold shadow-xs'
                                                : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {lvl === 'all' ? 'Semua Jenjang' : lvl}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. ACCREDITATION DATA TABLE & CARDS */}
                    {accreditations.data.length === 0 ? (
                        <EmptyState
                            title="Tidak Ada Data Akreditasi"
                            description="Tidak ditemukan data akreditasi yang cocok dengan kata kunci atau filter yang dipilih."
                            onReset={handleReset}
                            resetLabel="Hapus Filter"
                        />
                    ) : (
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-neutral-800 overflow-hidden">
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/70 dark:bg-neutral-800/50">
                                            <TableHead className="w-[32%] font-bold text-slate-800 dark:text-slate-200">
                                                Program Studi / Entitas
                                            </TableHead>
                                            <TableHead className="w-[18%] font-bold text-slate-800 dark:text-slate-200">
                                                Lembaga & SK
                                            </TableHead>
                                            <TableHead className="w-[16%] font-bold text-slate-800 dark:text-slate-200">
                                                Peringkat
                                            </TableHead>
                                            <TableHead className="w-[18%] font-bold text-slate-800 dark:text-slate-200">
                                                Masa Berlaku
                                            </TableHead>
                                            <TableHead className="w-[16%] text-right font-bold text-slate-800 dark:text-slate-200">
                                                Sertifikat
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accreditations.data.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-800/40">
                                                {/* Unit Name, Level & Faculty */}
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {item.unit_type === 'university' && (
                                                                <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-600 dark:text-blue-400">
                                                                    Universitas
                                                                </Badge>
                                                            )}
                                                            {item.unit_type === 'faculty' && (
                                                                <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-600 dark:text-purple-400">
                                                                    Fakultas
                                                                </Badge>
                                                            )}
                                                            {item.unit_type === 'study_program' && item.level && (
                                                                <Badge className="text-[10px] bg-brand-900 text-white font-semibold">
                                                                    {item.level}
                                                                </Badge>
                                                            )}
                                                            {item.academic_unit?.accreditations && item.academic_unit.accreditations.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setSelectedHistoryItem(item)}
                                                                    className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 font-medium hover:underline bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60 transition-colors cursor-pointer w-fit"
                                                                    title="Lihat riwayat akreditasi & arsip sertifikat periode terdahulu"
                                                                >
                                                                    <History className="h-2.5 w-2.5" />
                                                                    <span>{item.academic_unit.accreditations.length} Periode (Lihat Arsip)</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                            {item.unit_name}
                                                        </span>
                                                        {item.faculty_name && (
                                                            <span className="text-xs text-slate-500 dark:text-neutral-400">
                                                                {item.faculty_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Body & SK */}
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                            {item.accreditation_body}
                                                        </span>
                                                        <span className="text-xs font-mono text-slate-500 dark:text-neutral-400 truncate max-w-xs" title={item.sk_number}>
                                                            {item.sk_number}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                {/* Grade */}
                                                <TableCell>
                                                    {getGradeBadge(item.grade)}
                                                </TableCell>

                                                {/* Validity */}
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 text-xs">
                                                        <span className="flex items-center gap-1.5 text-slate-700 dark:text-neutral-300">
                                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                            {item.valid_until
                                                                ? new Date(item.valid_until).toLocaleDateString('id-ID', {
                                                                      day: 'numeric',
                                                                      month: 'short',
                                                                      year: 'numeric',
                                                                  })
                                                                : 'Sampai penetapan baru'}
                                                        </span>
                                                        <div>{getStatusBadge(item.status, item.valid_until)}</div>
                                                    </div>
                                                </TableCell>

                                                {/* Certificate file */}
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.academic_unit?.accreditations && item.academic_unit.accreditations.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedHistoryItem(item)}
                                                                className="h-8 px-2.5 text-xs gap-1.5 rounded-xl border-amber-300 dark:border-amber-900/60 text-amber-800 dark:text-amber-400 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/60 font-semibold"
                                                                title="Lihat riwayat dan salinan sertifikat periode terdahulu"
                                                            >
                                                                <History className="h-3.5 w-3.5" />
                                                                <span>Riwayat</span>
                                                            </Button>
                                                        )}
                                                        {item.certificate_file ? (
                                                            <a
                                                                href={`/storage/${item.certificate_file}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-gold-400 hover:text-neutral-950 dark:bg-neutral-800 dark:hover:bg-gold-400 dark:hover:text-neutral-950 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs"
                                                                title="Unduh Salinan Sertifikat Akreditasi"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                <span>Unduh Sertifikat</span>
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">Tersedia di arsip</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card List View */}
                            <div className="lg:hidden divide-y divide-slate-100 dark:divide-neutral-800">
                                {accreditations.data.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {item.unit_type === 'study_program' && item.level && (
                                                        <Badge className="text-[10px] bg-brand-900 text-white font-semibold">
                                                            {item.level}
                                                        </Badge>
                                                    )}
                                                    {item.unit_type === 'university' && (
                                                        <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-600">
                                                            Universitas
                                                        </Badge>
                                                    )}
                                                    {item.unit_type === 'faculty' && (
                                                        <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-600">
                                                            Fakultas
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                                                    {item.unit_name}
                                                </h3>
                                                {item.faculty_name && (
                                                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                                                        {item.faculty_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                {getGradeBadge(item.grade)}
                                                {getStatusBadge(item.status, item.valid_until)}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-800/50 p-2.5 rounded-xl">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block uppercase">Lembaga:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {item.accreditation_body}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block uppercase">Berlaku Hingga:</span>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {item.valid_until
                                                        ? new Date(item.valid_until).toLocaleDateString('id-ID', {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : '-'}
                                                </span>
                                            </div>
                                            <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-neutral-700/50">
                                                <span className="text-[10px] text-slate-400 block uppercase">Nomor SK:</span>
                                                <span className="font-mono text-xs text-slate-700 dark:text-neutral-300 break-all">
                                                    {item.sk_number}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-1">
                                            {item.certificate_file && (
                                                <a
                                                    href={`/storage/${item.certificate_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-gold-400 hover:text-neutral-950 font-semibold text-xs text-slate-800 dark:text-slate-200 transition-colors"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    <span>Unduh Sertifikat Akreditasi</span>
                                                </a>
                                            )}
                                            {item.academic_unit?.accreditations && item.academic_unit.accreditations.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedHistoryItem(item)}
                                                    className="w-full text-xs gap-1.5 rounded-xl border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100"
                                                >
                                                    <History className="h-3.5 w-3.5" />
                                                    <span>Lihat Arsip Riwayat ({item.academic_unit.accreditations.length} Periode)</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {accreditations.last_page > 1 && (
                                <div className="p-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                                    <div>
                                        Menampilkan{' '}
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {(accreditations.current_page - 1) * accreditations.per_page + 1}
                                        </span>{' '}
                                        -{' '}
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {Math.min(
                                                accreditations.current_page * accreditations.per_page,
                                                accreditations.total
                                            )}
                                        </span>{' '}
                                        dari <span className="font-bold text-slate-800 dark:text-slate-200">{accreditations.total}</span> data
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {accreditations.links.map((link, idx) => (
                                            !link.url ? (
                                                <span
                                                    key={idx}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 dark:text-neutral-600 cursor-not-allowed select-none"
                                                />
                                            ) : (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    preserveScroll
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                        link.active
                                                            ? 'bg-brand-900 text-white font-bold'
                                                            : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Dialog Linimasa Riwayat Akreditasi Publik */}
                <Dialog
                    open={!!selectedHistoryItem}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedHistoryItem(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <span>Riwayat Akreditasi — {selectedHistoryItem?.unit_name}</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500">
                                Linimasa akreditasi dan salinan dokumen SK lintas periode untuk keperluan administrasi dan alumni.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedHistoryItem && (
                            <div className="py-2">
                                <AccreditationTimeline
                                    items={selectedHistoryItem.academic_unit?.accreditations || [selectedHistoryItem]}
                                    currentId={selectedHistoryItem.id}
                                    showAddButton={false}
                                    unitName={selectedHistoryItem.unit_name}
                                    isAdmin={false}
                                />
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
        </>
    );
}
