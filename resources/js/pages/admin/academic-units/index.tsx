import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Building2,
    CheckCircle2,
    Clock,
    ExternalLink,
    GraduationCap,
    Info,
    Layers,
    RefreshCw,
    School,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { formatDate } from '@/lib/format';
import type { AcademicUnit, AcademicUnitType } from '@/types/accreditation';

interface Props {
    units: {
        data: AcademicUnit[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        total: number;
        current_page: number;
        per_page: number;
    };
    hierarchy: AcademicUnit | null;
    faculties: { id: number; name: string; code: string | null }[];
    stats: {
        total: number;
        university_count: number;
        faculty_count: number;
        study_program_count: number;
        active_count: number;
        inactive_count: number;
        last_synced_at: string | null;
    };
    apiInfo: {
        api_url: string | null;
        has_token: boolean;
    };
    filters: {
        type: string;
        level: string;
        status: string;
        faculty_id: string;
        search: string;
    };
}

const LEVEL_OPTIONS = ['D3', 'D4', 'S1', 'S2', 'S3', 'Profesi'];

export default function Index({
    units,
    hierarchy,
    faculties,
    stats,
    apiInfo,
    filters,
}: Props) {
    const [viewMode, setViewMode] = useState<'table' | 'hierarchy'>('table');
    const [isSyncing, setIsSyncing] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string) => {
        const nextFilters = {
            ...filters,
            [key]: value,
        };
        router.get('/admin/academic-units', nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchQuery);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        router.get('/admin/academic-units', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSync = () => {
        const msg = apiInfo.api_url
            ? `Sinkronisasi akan mencocokkan seluruh data dengan API sistem akademik (${apiInfo.api_url}). Data yang tidak terdaftar di API akan otomatis dihapus dan data baru akan ditambahkan. Lanjutkan?`
            : 'Sinkronisasi akan mencocokkan data dengan dataset baku Universitas Abdurrab (FFIK, FK, FT, FPSI). Data yang tidak terdaftar akan otomatis dihapus dan data baru akan ditambahkan. Lanjutkan?';

        if (confirm(msg)) {
            setIsSyncing(true);
            router.post(
                '/admin/academic-units/sync',
                {},
                {
                    onFinish: () => setIsSyncing(false),
                }
            );
        }
    };

    const getTypeBadge = (type: AcademicUnitType) => {
        switch (type) {
            case 'university':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <Building2 className="h-3 w-3" />
                        Universitas
                    </span>
                );
            case 'faculty':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <School className="h-3 w-3" />
                        Fakultas
                    </span>
                );
            case 'study_program':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <GraduationCap className="h-3 w-3" />
                        Program Studi
                    </span>
                );
        }
    };

    const getLevelBadge = (level: string | null) => {
        if (!level) return null;
        const colors: Record<string, string> = {
            S1: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            D3: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
            D4: 'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200 dark:border-teal-800',
            Profesi: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800',
            S2: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
            S3: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/70 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
        };

        return (
            <span
                className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border ${
                    colors[level] || 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300 border-slate-200 dark:border-neutral-700'
                }`}
            >
                {level}
            </span>
        );
    };

    const hasActiveFilters =
        filters.type !== 'all' ||
        filters.level !== 'all' ||
        filters.status !== 'all' ||
        filters.faculty_id !== 'all' ||
        filters.search !== '';

    return (
        <div className="space-y-6">
            <Head title="Master Unit Akademik - LPDSA" />

            {/* Header & Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                        <GraduationCap className="h-7 w-7 text-[#8B142C] dark:text-red-400" />
                        <span>Data Master Unit Akademik</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Data master Universitas, Fakultas, dan Program Studi dikendalikan secara terpusat dari API sistem akademik
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Tombol Sinkronisasi dari API Utama */}
                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="gap-2 bg-[#8B142C] hover:bg-[#721024] text-white shadow-sm"
                        title="Sinkronisasi dan rekonsiliasi data unit akademik dari API"
                    >
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan dari API'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        asChild
                        className="gap-1.5 text-slate-700 dark:text-slate-300 hover:text-[#8B142C] border-slate-300 dark:border-slate-700"
                    >
                        <Link href="/admin/accreditations">
                            <Award className="h-4 w-4 text-[#8B142C] dark:text-red-400" />
                            <span>Ke Data Akreditasi</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* API Integration Info Banner */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-[#8B142C] dark:text-red-400 flex items-center justify-center shrink-0">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                    Sumber Data Master (Single Source of Truth)
                                </span>
                                {apiInfo.api_url ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                        <CheckCircle2 className="h-3 w-3" />
                                        API Eksternal Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        Dataset Standar Univrab
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                                {apiInfo.api_url ? (
                                    <span>
                                        Data unit disinkronkan langsung dari endpoint{' '}
                                        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-mono text-[11px]">
                                            {apiInfo.api_url}
                                        </code>
                                        . Data baru di API akan otomatis ditambahkan, dan unit yang dihapus di API akan otomatis dihapus di sistem LPDSA.
                                    </span>
                                ) : (
                                    'Endpoint API belum dikonfigurasi. Sistem saat ini mencocokkan data dengan dataset baku Univrab (FFIK, FK, FT, FPSI). Data yang tidak ada di sumber acuan akan otomatis dibersihkan saat disinkronkan.'
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs text-slate-500 dark:text-slate-400">
                        {stats.last_synced_at && (
                            <span className="inline-flex items-center gap-1.5 font-medium">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                Terakhir: {formatDate(stats.last_synced_at)}
                            </span>
                        )}
                        <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                            <Link href="/admin/settings">
                                <span>Atur API</span>
                                <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Total Unit</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Universitas</div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-1">{stats.university_count}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Fakultas</div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">{stats.faculty_count}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Program Studi</div>
                        <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{stats.study_program_count}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Unit Aktif</div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active_count}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50/60 dark:bg-neutral-900/40 border-slate-200 dark:border-neutral-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-neutral-400">Non-Aktif</div>
                        <div className="text-2xl font-bold text-slate-400 dark:text-neutral-500 mt-1">{stats.inactive_count}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and View Mode Switcher */}
            <div className="space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* View Switcher: Tabel vs Hierarki */}
                    <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-neutral-800 self-start">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'table'
                                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs'
                                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Tampilan Tabel
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('hierarchy')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                viewMode === 'hierarchy'
                                    ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs'
                                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Struktur Hierarki
                        </button>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama prodi, kode, atau fakultas..."
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <Button type="submit" size="sm" className="h-9 text-xs bg-slate-800 hover:bg-slate-900 text-white dark:bg-neutral-800">
                            Cari
                        </Button>
                    </form>
                </div>

                {/* Filters Row */}
                {viewMode === 'table' && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Select
                            value={filters.type}
                            onValueChange={(val) => handleFilterChange('type', val)}
                        >
                            <SelectTrigger className="w-[150px] h-8 text-xs">
                                <SelectValue placeholder="Tipe Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="university">Universitas</SelectItem>
                                <SelectItem value="faculty">Fakultas</SelectItem>
                                <SelectItem value="study_program">Program Studi</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.level}
                            onValueChange={(val) => handleFilterChange('level', val)}
                        >
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Jenjang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenjang</SelectItem>
                                {LEVEL_OPTIONS.map((lvl) => (
                                    <SelectItem key={lvl} value={lvl}>
                                        {lvl}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.faculty_id}
                            onValueChange={(val) => handleFilterChange('faculty_id', val)}
                        >
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Fakultas Induk" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Fakultas</SelectItem>
                                {faculties.map((fac) => (
                                    <SelectItem key={fac.id} value={fac.id.toString()}>
                                        {fac.code ? `${fac.code} - ${fac.name}` : fac.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status}
                            onValueChange={(val) => handleFilterChange('status', val)}
                        >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue placeholder="Status Aktif" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="active">Aktif</SelectItem>
                                <SelectItem value="inactive">Non-Aktif</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleResetFilters}
                                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reset Filter
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* TAB CONTENT: 1. TABLE VIEW */}
            {viewMode === 'table' && (
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/75 dark:bg-neutral-800/50">
                                    <TableHead className="w-[110px] text-xs font-bold uppercase tracking-wider">
                                        Kode Unit
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">
                                        Nama Unit Akademik
                                    </TableHead>
                                    <TableHead className="w-[140px] text-xs font-bold uppercase tracking-wider">
                                        Tipe
                                    </TableHead>
                                    <TableHead className="w-[100px] text-xs font-bold uppercase tracking-wider">
                                        Jenjang
                                    </TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">
                                        Fakultas Induk
                                    </TableHead>
                                    <TableHead className="w-[160px] text-xs font-bold uppercase tracking-wider">
                                        Akreditasi Terkini
                                    </TableHead>
                                    <TableHead className="w-[110px] text-center text-xs font-bold uppercase tracking-wider">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[160px] text-right text-xs font-bold uppercase tracking-wider">
                                        Terakhir Sinkron
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.data.length > 0 ? (
                                    units.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                                        >
                                            <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-neutral-300">
                                                {item.code ? (
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                                                        {item.code}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                    {item.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getTypeBadge(item.type)}</TableCell>
                                            <TableCell>{getLevelBadge(item.level)}</TableCell>
                                            <TableCell className="text-xs text-slate-600 dark:text-neutral-400">
                                                {item.parent?.name || item.faculty_name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.latest_accreditation ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        <span>{item.latest_accreditation.grade}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-neutral-500 italic">
                                                        Belum dicatat
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                        Non-Aktif
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-slate-500 dark:text-neutral-400 font-mono">
                                                {item.synced_at ? formatDate(item.synced_at) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                                            Tidak ada data unit akademik yang sesuai dengan filter.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {units.links && units.links.length > 3 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400">
                            <div>
                                Menampilkan data ke-{' '}
                                <span className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {(units.current_page - 1) * units.per_page + 1}
                                </span>{' '}
                                -{' '}
                                <span className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {Math.min(units.current_page * units.per_page, units.total)}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {units.total}
                                </span>{' '}
                                unit
                            </div>
                            <div className="flex items-center gap-1">
                                {units.links.map((link, idx) => (
                                    !link.url ? (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-2.5 py-1 rounded text-xs text-slate-300 dark:text-neutral-600 cursor-not-allowed select-none"
                                        />
                                    ) : (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveScroll
                                            className={`px-2.5 py-1 rounded text-xs transition-colors ${
                                                link.active
                                                    ? 'bg-[#8B142C] text-white font-semibold'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
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

            {/* TAB CONTENT: 2. HIERARCHY TREE VIEW */}
            {viewMode === 'hierarchy' && hierarchy && (
                <div className="space-y-4">
                    {/* University Card */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 to-[#8B142C] text-white shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <Building2 className="h-6 w-6 text-gold-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/20 text-gold-300 font-bold">
                                            {hierarchy.code || '101026'}
                                        </span>
                                        <span className="text-xs uppercase tracking-wider text-slate-200 font-semibold">
                                            Institusi Induk (Single Source of Truth)
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-white mt-0.5">{hierarchy.name}</h3>
                                </div>
                            </div>

                            {hierarchy.latest_accreditation && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs">
                                    <ShieldCheck className="h-4 w-4 text-gold-400" />
                                    <span>Akreditasi Institusi:</span>
                                    <strong className="text-gold-300 font-bold">{hierarchy.latest_accreditation.grade}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Faculties Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {hierarchy.children?.map((faculty: any) => (
                            <div
                                key={faculty.id}
                                className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between"
                            >
                                <div>
                                    {/* Faculty Header */}
                                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                                                <School className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                                                        {faculty.code}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                                                        Fakultas
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                                                    {faculty.name}
                                                </h4>
                                            </div>
                                        </div>

                                        <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 shrink-0">
                                            {faculty.children?.length || 0} Prodi
                                        </span>
                                    </div>

                                    {/* Study Programs Under Faculty */}
                                    <div className="mt-3 space-y-2">
                                        {faculty.children?.map((program: any) => (
                                            <div
                                                key={program.id}
                                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 text-xs hover:border-slate-300 dark:hover:border-neutral-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {getLevelBadge(program.level)}
                                                    <span className="font-medium text-slate-800 dark:text-neutral-200 truncate">
                                                        {program.name}
                                                    </span>
                                                    {program.code && (
                                                        <span className="font-mono text-[10px] text-slate-400 dark:text-neutral-500">
                                                            ({program.code})
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    {program.latest_accreditation ? (
                                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                            {program.latest_accreditation.grade}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                            -
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
