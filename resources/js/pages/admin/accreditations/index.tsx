import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Edit,
    GraduationCap,
    History,
    Plus,
    RefreshCw,
    Search,
    Trash,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AccreditationTimeline from '@/components/accreditation-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { AcademicUnit, Accreditation } from '@/types/accreditation';

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

interface Stats {
    total: number;
    university_count: number;
    faculty_count: number;
    study_program_count: number;
    active_count: number;
    expiring_soon_count: number;
    expired_count: number;
}

interface Filters {
    unit_type: string;
    level: string;
    status: string;
    body: string;
    search: string;
    sort: string;
}

interface Props {
    accreditations: PaginatedAccreditations;
    stats: Stats;
    academicUnits: AcademicUnit[];
    filters: Filters;
}

const COMMON_BODIES = [
    'BAN-PT',
    'LAM-PTKes',
    'LAM INFOKOM',
    'LAMDIK',
    'LAMEMBA',
    'LAM TEKNIK',
    'LAMSAMA',
];

export default function Index({ accreditations, stats, academicUnits, filters }: Props) {
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<Accreditation | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Accreditation | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const hasActiveFilters = Boolean(
        (filters.unit_type && filters.unit_type !== 'all') ||
        (filters.level && filters.level !== 'all') ||
        (filters.status && filters.status !== 'all') ||
        (filters.body && filters.body !== 'all') ||
        filters.search ||
        (filters.sort && filters.sort !== 'valid_until_desc')
    );

    const handleFilterChange = (key: keyof Filters, value: string) => {
        const nextFilters = {
            ...filters,
            [key]: value,
        };
        router.get('/admin/accreditations', nextFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        router.get('/admin/accreditations', {}, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchQuery);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(`/admin/accreditations/${itemToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setItemToDelete(null);
            },
        });
    };

    const getGradeBadge = (grade: string) => {
        const lower = grade.toLowerCase();

        if (lower.includes('unggul') || lower === 'a') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    ★ {grade}
                </span>
            );
        }

        if (lower.includes('baik sekali') || lower === 'b') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {grade}
                </span>
            );
        }

        if (lower.includes('baik') || lower === 'c') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {grade}
                </span>
            );
        }

        return (
            <Badge variant="secondary" className="text-[11px] font-semibold">
                {grade}
            </Badge>
        );
    };

    const getStatusBadge = (status: string, validUntil: string | null) => {
        if (status === 'expired') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Kedaluwarsa
                </span>
            );
        }

        if (status === 'in_process') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        Kedaluwarsa
                    </span>
                );
            }

            if (until <= sixMonthsFromNow) {
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Segera Berakhir
                    </span>
                );
            }
        }

        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Aktif
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <Head title="Manajemen Data Akreditasi" />

            {/* Compact Header sesuai Bab 4 PANDUAN_DESAIN.md */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 border border-brand-100 dark:border-brand-900/50 flex items-center justify-center shrink-0 shadow-xs">
                        <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Data Akreditasi
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                            Kelola sertifikat & peringkat akreditasi Universitas, Fakultas, dan Program Studi
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-xl border-slate-300 dark:border-neutral-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 gap-2"
                    >
                        <Link href="/admin/academic-units">
                            <GraduationCap className="h-4 w-4 text-[#8B142C] dark:text-gold-400" />
                            <span>Data Unit Akademik</span>
                        </Link>
                    </Button>
                    <Button
                        size="sm"
                        asChild
                        className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white text-xs font-bold shadow-xs gap-2"
                    >
                        <Link href="/admin/accreditations/create">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Akreditasi</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Metric Summary Cards (7 Kolom Responsif dengan Aksen Emas & Warna Semantik) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {/* Total */}
                <Card
                    onClick={() => handleFilterChange('status', 'all')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 cursor-pointer transition-all shadow-xs ${
                        filters.status === 'all' && (!filters.unit_type || filters.unit_type === 'all')
                            ? 'bg-slate-100/80 dark:bg-neutral-800/80 ring-1 ring-[#8B142C]'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk tampilkan semua status"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                            Total
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {stats.total}
                        </div>
                    </CardContent>
                </Card>

                {/* Universitas */}
                <Card
                    onClick={() => handleFilterChange('unit_type', filters.unit_type === 'university' ? 'all' : 'university')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-800 cursor-pointer transition-all shadow-xs ${
                        filters.unit_type === 'university'
                            ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 ring-1 ring-purple-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi universitas"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> Univ
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {stats.university_count}
                        </div>
                    </CardContent>
                </Card>

                {/* Fakultas */}
                <Card
                    onClick={() => handleFilterChange('unit_type', filters.unit_type === 'faculty' ? 'all' : 'faculty')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-800 cursor-pointer transition-all shadow-xs ${
                        filters.unit_type === 'faculty'
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 ring-1 ring-blue-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi fakultas"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> Fakultas
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {stats.faculty_count}
                        </div>
                    </CardContent>
                </Card>

                {/* Program Studi */}
                <Card
                    onClick={() => handleFilterChange('unit_type', filters.unit_type === 'study_program' ? 'all' : 'study_program')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-800 cursor-pointer transition-all shadow-xs ${
                        filters.unit_type === 'study_program'
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi program studi"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5" /> Prodi
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                            {stats.study_program_count}
                        </div>
                    </CardContent>
                </Card>

                {/* Aktif */}
                <Card
                    onClick={() => handleFilterChange('status', filters.status === 'active' ? 'all' : 'active')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-800 cursor-pointer transition-all shadow-xs ${
                        filters.status === 'active'
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi aktif"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                        </div>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {stats.active_count}
                        </div>
                    </CardContent>
                </Card>

                {/* Segera Berakhir */}
                <Card
                    onClick={() => handleFilterChange('status', filters.status === 'expiring_soon' ? 'all' : 'expiring_soon')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-800 cursor-pointer transition-all shadow-xs ${
                        filters.status === 'expiring_soon'
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi yang segera berakhir (≤ 6 bulan)"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Segera Habis
                        </div>
                        <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                            {stats.expiring_soon_count}
                        </div>
                    </CardContent>
                </Card>

                {/* Kedaluwarsa */}
                <Card
                    onClick={() => handleFilterChange('status', filters.status === 'expired' ? 'all' : 'expired')}
                    className={`rounded-2xl border border-slate-200/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-800 cursor-pointer transition-all shadow-xs ${
                        filters.status === 'expired'
                            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400'
                            : 'bg-white dark:bg-neutral-900'
                    }`}
                    title="Klik untuk filter akreditasi yang telah kedaluwarsa"
                >
                    <CardContent className="p-4">
                        <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Kedaluwarsa
                        </div>
                        <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                            {stats.expired_count}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Tab Navigation Card (Bab 5 PANDUAN_DESAIN.md) */}
            <Card className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
                <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Unit Type Tab Buttons */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl">
                            {[
                                { key: 'all', label: 'Semua Entitas' },
                                { key: 'university', label: 'Universitas' },
                                { key: 'faculty', label: 'Fakultas' },
                                { key: 'study_program', label: 'Program Studi' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilterChange('unit_type', tab.key)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                                        filters.unit_type === tab.key || (!filters.unit_type && tab.key === 'all')
                                            ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white shadow-xs font-bold'
                                            : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input and Reset Action */}
                        <div className="flex items-center gap-2">
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama, SK, peringkat..."
                                        className="pl-9 h-9 w-60 sm:w-68 text-xs rounded-xl border-slate-200 dark:border-neutral-800"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery('');
                                                handleFilterChange('search', '');
                                            }}
                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    size="sm"
                                    className="h-9 rounded-xl text-xs font-semibold"
                                >
                                    Cari
                                </Button>
                            </form>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetFilter}
                                    className="h-9 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 gap-1.5"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Reset Filter</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Secondary Filters Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-neutral-800/80">
                        {/* Level Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold">Jenjang</Label>
                            <Select
                                value={filters.level}
                                onValueChange={(val) => handleFilterChange('level', val)}
                            >
                                <SelectTrigger className="h-9 text-xs mt-1 rounded-xl border-slate-200 dark:border-neutral-800">
                                    <SelectValue placeholder="Semua Jenjang" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Semua Jenjang</SelectItem>
                                    <SelectItem value="D3">Diploma 3 (D3)</SelectItem>
                                    <SelectItem value="D4">Diploma 4 / Sarjana Terapan (D4)</SelectItem>
                                    <SelectItem value="S1">Sarjana (S1)</SelectItem>
                                    <SelectItem value="S2">Magister (S2)</SelectItem>
                                    <SelectItem value="S3">Doktor (S3)</SelectItem>
                                    <SelectItem value="Profesi">Profesi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Body Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold">Lembaga Akreditasi</Label>
                            <Select
                                value={filters.body}
                                onValueChange={(val) => handleFilterChange('body', val)}
                            >
                                <SelectTrigger className="h-9 text-xs mt-1 rounded-xl border-slate-200 dark:border-neutral-800">
                                    <SelectValue placeholder="Semua Lembaga" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Semua Lembaga</SelectItem>
                                    {COMMON_BODIES.map((body) => (
                                        <SelectItem key={body} value={body}>
                                            {body}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold">Status Masa Berlaku</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(val) => handleFilterChange('status', val)}
                            >
                                <SelectTrigger className="h-9 text-xs mt-1 rounded-xl border-slate-200 dark:border-neutral-800">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif (Berlaku)</SelectItem>
                                    <SelectItem value="expiring_soon">Segera Berakhir (≤ 6 Bulan)</SelectItem>
                                    <SelectItem value="expired">Kedaluwarsa</SelectItem>
                                    <SelectItem value="in_process">Dalam Proses Re-Akreditasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 dark:text-neutral-400 font-semibold">Urutan Data</Label>
                            <Select
                                value={filters.sort}
                                onValueChange={(val) => handleFilterChange('sort', val)}
                            >
                                <SelectTrigger className="h-9 text-xs mt-1 rounded-xl border-slate-200 dark:border-neutral-800">
                                    <SelectValue placeholder="Masa Berlaku (Terbaru)" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="valid_until_desc">Masa Berlaku (Terjauh / Terbaru)</SelectItem>
                                    <SelectItem value="valid_until_asc">Masa Berlaku (Terdekat Habis)</SelectItem>
                                    <SelectItem value="name_asc">Nama Entitas (A-Z)</SelectItem>
                                    <SelectItem value="latest">Terakhir Ditambahkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                {/* Table Data (Bab 6 PANDUAN_DESAIN.md dengan overflow-x-auto & font standar) */}
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/75 dark:bg-neutral-800/50">
                                <TableRow className="border-b border-slate-100 dark:border-neutral-800">
                                    <TableHead className="w-[30%] text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Entitas & Jenjang
                                    </TableHead>
                                    <TableHead className="w-[18%] text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Lembaga & SK
                                    </TableHead>
                                    <TableHead className="w-[14%] text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Peringkat
                                    </TableHead>
                                    <TableHead className="w-[18%] text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Masa Berlaku
                                    </TableHead>
                                    <TableHead className="w-[10%] text-center text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Sertifikat
                                    </TableHead>
                                    <TableHead className="w-[10%] text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accreditations.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="p-0">
                                            {/* Empty State Bab 10 PANDUAN_DESAIN.md */}
                                            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 my-6 mx-4">
                                                <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-[#8B142C] dark:text-gold-400 flex items-center justify-center mx-auto mb-4">
                                                    <Award className="h-7 w-7" />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                    Tidak Ada Data Akreditasi Ditemukan
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                                                    Silakan periksa kata kunci pencarian Anda atau sesuaikan filter untuk melihat data lainnya.
                                                </p>
                                                {hasActiveFilters && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleResetFilter}
                                                        className="mt-4 rounded-xl text-xs gap-1.5 border-slate-300 dark:border-neutral-700 text-slate-700 dark:text-neutral-300"
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                        <span>Reset Semua Filter</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    accreditations.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 border-b border-slate-100 dark:border-neutral-800/80 transition-colors"
                                        >
                                            {/* Unit & Level */}
                                            <TableCell className="py-3.5 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {item.unit_type === 'university' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                                                Universitas
                                                            </span>
                                                        )}
                                                        {item.unit_type === 'faculty' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                                Fakultas
                                                            </span>
                                                        )}
                                                        {item.unit_type === 'study_program' && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                                Prodi {item.level && `(${item.level})`}
                                                            </span>
                                                        )}
                                                        {item.academic_unit?.accreditations && item.academic_unit.accreditations.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedHistoryItem(item)}
                                                                className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-gold-400 font-semibold hover:underline bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/60 transition-colors cursor-pointer"
                                                                title="Lihat linimasa riwayat periode"
                                                            >
                                                                <History className="h-2.5 w-2.5" />
                                                                <span>{item.academic_unit.accreditations.length} Periode</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                                                        {item.unit_name}
                                                    </span>
                                                    {item.faculty_name && (
                                                        <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                                                            {item.faculty_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Body & SK */}
                                            <TableCell className="py-3.5 px-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                                        {item.accreditation_body}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                                                        {item.sk_number}
                                                    </span>
                                                    {item.sk_date && (
                                                        <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                            SK: {new Date(item.sk_date).toLocaleDateString('id-ID')}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Grade */}
                                            <TableCell className="py-3.5 px-4">
                                                {getGradeBadge(item.grade)}
                                            </TableCell>

                                            {/* Validity & Status */}
                                            <TableCell className="py-3.5 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <div>{getStatusBadge(item.status, item.valid_until)}</div>
                                                    <span className="text-xs text-slate-600 dark:text-neutral-300 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-slate-400" />
                                                        {item.valid_until
                                                            ? new Date(item.valid_until).toLocaleDateString('id-ID', {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                              })
                                                            : 'Belum ditentukan'}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Certificate file */}
                                            <TableCell className="py-3.5 px-4 text-center">
                                                {item.certificate_file ? (
                                                    <a
                                                        href={`/storage/${item.certificate_file}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold"
                                                        title="Unduh / Lihat Salinan Sertifikat"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        <span>Unduh</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-neutral-500 italic">-</span>
                                                )}
                                            </TableCell>

                                            {/* Actions (Bab 7 Ghost Link Icon) */}
                                            <TableCell className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setSelectedHistoryItem(item)}
                                                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg cursor-pointer"
                                                        title="Lihat Riwayat Periode"
                                                    >
                                                        <History className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 text-slate-600 hover:text-[#8B142C] hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-lg"
                                                        title="Edit Akreditasi"
                                                    >
                                                        <Link href={`/admin/accreditations/${item.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                                                        title="Hapus Akreditasi"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>

                {/* Pagination (Bab 6 PANDUAN_DESAIN.md) */}
                {accreditations.last_page > 1 && (
                    <div className="p-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
                        <div>
                            Menampilkan data ke{' '}
                            <span className="font-bold text-slate-800 dark:text-neutral-200">
                                {(accreditations.current_page - 1) * accreditations.per_page + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-bold text-slate-800 dark:text-neutral-200">
                                {Math.min(accreditations.current_page * accreditations.per_page, accreditations.total)}
                            </span>{' '}
                            dari <span className="font-bold text-slate-800 dark:text-neutral-200">{accreditations.total}</span> total
                        </div>
                        <div className="flex items-center gap-1">
                            {accreditations.links.map((link, idx) => (
                                !link.url ? (
                                    <span
                                        key={idx}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="px-2.5 py-1 rounded-lg text-xs text-slate-300 dark:text-neutral-600 cursor-not-allowed select-none"
                                    />
                                ) : (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                                            link.active
                                                ? 'bg-[#8B142C] text-white font-bold shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 font-medium'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* Modal Dialog Linimasa Riwayat Akreditasi */}
            <Dialog
                open={!!selectedHistoryItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedHistoryItem(null);
                    }
                }}
            >
                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 border-slate-200 dark:border-neutral-800">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Clock className="h-5 w-5 text-amber-600 dark:text-gold-400" />
                            <span>Riwayat Akreditasi — {selectedHistoryItem?.unit_name}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Kronologi masa berlaku sertifikat dan arsip SK akreditasi lintas periode
                        </DialogDescription>
                    </DialogHeader>

                    {selectedHistoryItem && (
                        <div className="py-2">
                            <AccreditationTimeline
                                items={selectedHistoryItem.academic_unit?.accreditations || [selectedHistoryItem]}
                                currentId={selectedHistoryItem.id}
                                showAddButton={true}
                                academicUnitId={selectedHistoryItem.academic_unit_id || undefined}
                                unitName={selectedHistoryItem.unit_name}
                                isAdmin={true}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Dialog Konfirmasi Hapus Standar Bab 9 PANDUAN_DESAIN.md */}
            <Dialog
                open={!!itemToDelete}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setItemToDelete(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800">
                    <DialogHeader className="items-center text-center">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Hapus Data Akreditasi?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed text-center">
                            Tindakan ini tidak dapat dibatalkan. Data sertifikat akreditasi untuk{' '}
                            <span className="font-semibold text-slate-700 dark:text-neutral-200">
                                {itemToDelete?.unit_name}
                            </span>{' '}
                            (No. SK: {itemToDelete?.sk_number}) beserta berkas fisiknya akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-6 flex gap-2 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setItemToDelete(null)}
                            disabled={isDeleting}
                            className="rounded-xl text-xs font-semibold border-slate-300 dark:border-neutral-700"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akreditasi', href: '/admin/accreditations' },
    ],
};
