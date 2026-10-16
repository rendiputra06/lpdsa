import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    Edit,
    FileCheck,
    GraduationCap,
    Plus,
    RefreshCw,
    Search,
    Trash,
    Upload,
    X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
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

const COMMON_GRADES = [
    'Unggul',
    'Baik Sekali',
    'Baik',
    'A',
    'B',
    'C',
    'Terakreditasi Sementara',
];

export default function Index({ accreditations, stats, academicUnits, filters }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Accreditation | null>(null);
    const [selectedUnitId, setSelectedUnitId] = useState<string>('custom');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm<{
        _method: string;
        academic_unit_id: string;
        unit_type: 'university' | 'faculty' | 'study_program';
        unit_name: string;
        level: string;
        faculty_name: string;
        accreditation_body: string;
        grade: string;
        sk_number: string;
        sk_date: string;
        valid_until: string;
        status: 'active' | 'expired' | 'in_process';
        certificate_file: File | null;
        delete_certificate: boolean;
        notes: string;
    }>({
        _method: 'POST',
        academic_unit_id: '',
        unit_type: 'study_program',
        unit_name: '',
        level: 'S1',
        faculty_name: '',
        accreditation_body: 'BAN-PT',
        grade: 'Baik Sekali',
        sk_number: '',
        sk_date: '',
        valid_until: '',
        status: 'active',
        certificate_file: null,
        delete_certificate: false,
        notes: '',
    });

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchQuery);
    };

    const handleUnitSelect = (unitIdStr: string) => {
        setSelectedUnitId(unitIdStr);

        if (unitIdStr === 'custom') {
            setData((prev) => ({
                ...prev,
                academic_unit_id: '',
            }));

            return;
        }

        const unit = academicUnits.find((u) => u.id.toString() === unitIdStr);

        if (unit) {
            setData((prev) => ({
                ...prev,
                academic_unit_id: unit.id.toString(),
                unit_type: unit.type,
                unit_name: unit.name,
                level: unit.level || '',
                faculty_name: unit.faculty_name || '',
            }));
        }
    };

    const openCreateDialog = () => {
        setEditingItem(null);
        setSelectedUnitId('custom');
        reset();
        setData({
            _method: 'POST',
            academic_unit_id: '',
            unit_type: 'study_program',
            unit_name: '',
            level: 'S1',
            faculty_name: '',
            accreditation_body: 'BAN-PT',
            grade: 'Baik Sekali',
            sk_number: '',
            sk_date: '',
            valid_until: '',
            status: 'active',
            certificate_file: null,
            delete_certificate: false,
            notes: '',
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (item: Accreditation) => {
        setEditingItem(item);
        const matchedUnit = academicUnits.find(
            (u) => u.id === item.academic_unit_id || (u.name === item.unit_name && u.type === item.unit_type)
        );
        setSelectedUnitId(matchedUnit ? matchedUnit.id.toString() : 'custom');

        setData({
            _method: 'PUT',
            academic_unit_id: item.academic_unit_id ? item.academic_unit_id.toString() : '',
            unit_type: item.unit_type,
            unit_name: item.unit_name,
            level: item.level || '',
            faculty_name: item.faculty_name || '',
            accreditation_body: item.accreditation_body,
            grade: item.grade,
            sk_number: item.sk_number,
            sk_date: item.sk_date || '',
            valid_until: item.valid_until || '',
            status: item.status,
            certificate_file: null,
            delete_certificate: false,
            notes: item.notes || '',
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingItem
            ? `/admin/accreditations/${editingItem.id}`
            : '/admin/accreditations';

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                setIsDialogOpen(false);
                setEditingItem(null);
                reset();
            },
        });
    };

    const handleDelete = (item: Accreditation) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akreditasi untuk "${item.unit_name}"?`)) {
            router.delete(`/admin/accreditations/${item.id}`);
        }
    };

    const getGradeBadge = (grade: string) => {
        const lower = grade.toLowerCase();

        if (lower.includes('unggul') || lower === 'a') {
            return (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                    {grade}
                </Badge>
            );
        }

        if (lower.includes('baik sekali') || lower === 'b') {
            return (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    {grade}
                </Badge>
            );
        }

        if (lower.includes('baik') || lower === 'c') {
            return (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                    {grade}
                </Badge>
            );
        }

        return <Badge variant="secondary">{grade}</Badge>;
    };

    const getStatusBadge = (status: string, validUntil: string | null) => {
        if (status === 'expired') {
            return <Badge variant="destructive">Kedaluwarsa</Badge>;
        }

        if (status === 'in_process') {
            return <Badge className="bg-purple-600 hover:bg-purple-700 text-white">Proses Re-Akreditasi</Badge>;
        }

        if (validUntil) {
            const until = new Date(validUntil);
            const now = new Date();
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(now.getMonth() + 6);

            if (until < now) {
                return <Badge variant="destructive">Kedaluwarsa</Badge>;
            }

            if (until <= sixMonthsFromNow) {
                return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Segera Berakhir</Badge>;
            }
        }

        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Aktif</Badge>;
    };

    return (
        <div className="space-y-6">
            <Head title="Manajemen Data Akreditasi" />

            {/* Header with Title and Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="h-7 w-7 text-[#8B142C] dark:text-red-400" />
                        Data Akreditasi
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kelola sertifikat & peringkat akreditasi Universitas, Fakultas, dan Program Studi
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        asChild
                        className="gap-2 border-slate-300 dark:border-slate-700"
                    >
                        <Link href="/admin/academic-units">
                            <GraduationCap className="h-4 w-4 text-[#8B142C] dark:text-red-400" />
                            <span>Data Unit Akademik</span>
                        </Link>
                    </Button>
                    <Button
                        onClick={openCreateDialog}
                        className="gap-2 bg-[#8B142C] hover:bg-[#721024] text-white shadow"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Akreditasi
                    </Button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Akreditasi</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-blue-500" /> Universitas
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.university_count}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-purple-500" /> Fakultas
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.faculty_count}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <GraduationCap className="h-3.5 w-3.5 text-amber-500" /> Program Studi
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.study_program_count}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Aktif
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active_count}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Segera Berakhir
                        </div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.expiring_soon_count}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Tab Navigation Card */}
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Unit Type Tab Buttons */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                            {[
                                { key: 'all', label: 'Semua' },
                                { key: 'university', label: 'Universitas' },
                                { key: 'faculty', label: 'Fakultas' },
                                { key: 'study_program', label: 'Program Studi' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilterChange('unit_type', tab.key)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                        filters.unit_type === tab.key
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama, SK, peringkat..."
                                    className="pl-9 h-9 w-60 text-xs"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            handleFilterChange('search', '');
                                        }}
                                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <Button type="submit" variant="secondary" size="sm" className="h-9">
                                Cari
                            </Button>
                        </form>
                    </div>

                    {/* Secondary Filters Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        {/* Level Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 font-medium">Jenjang</Label>
                            <Select
                                value={filters.level}
                                onValueChange={(val) => handleFilterChange('level', val)}
                            >
                                <SelectTrigger className="h-8 text-xs mt-1">
                                    <SelectValue placeholder="Semua Jenjang" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label className="text-[11px] text-slate-500 font-medium">Lembaga Akreditasi</Label>
                            <Select
                                value={filters.body}
                                onValueChange={(val) => handleFilterChange('body', val)}
                            >
                                <SelectTrigger className="h-8 text-xs mt-1">
                                    <SelectValue placeholder="Semua Lembaga" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label className="text-[11px] text-slate-500 font-medium">Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(val) => handleFilterChange('status', val)}
                            >
                                <SelectTrigger className="h-8 text-xs mt-1">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="expired">Kedaluwarsa</SelectItem>
                                    <SelectItem value="in_process">Dalam Proses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Filter */}
                        <div>
                            <Label className="text-[11px] text-slate-500 font-medium">Urutan</Label>
                            <Select
                                value={filters.sort}
                                onValueChange={(val) => handleFilterChange('sort', val)}
                            >
                                <SelectTrigger className="h-8 text-xs mt-1">
                                    <SelectValue placeholder="Masa Berlaku (Terbaru)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="valid_until_desc">Masa Berlaku (Terlama/Terjauh)</SelectItem>
                                    <SelectItem value="valid_until_asc">Masa Berlaku (Terdekat Berakhir)</SelectItem>
                                    <SelectItem value="name_asc">Nama Entitas (A-Z)</SelectItem>
                                    <SelectItem value="latest">Terakhir Ditambahkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/70 dark:bg-slate-900/50">
                                <TableHead className="w-[30%]">Entitas & Jenjang</TableHead>
                                <TableHead className="w-[18%]">Lembaga & SK</TableHead>
                                <TableHead className="w-[14%]">Peringkat</TableHead>
                                <TableHead className="w-[18%]">Masa Berlaku</TableHead>
                                <TableHead className="w-[10%] text-center">Sertifikat</TableHead>
                                <TableHead className="w-[10%] text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accreditations.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        <Award className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                        <p className="font-medium text-slate-700 dark:text-slate-300">Tidak ada data akreditasi ditemukan</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Coba ubah kata kunci pencarian atau filter yang diterapkan.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                accreditations.data.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                                        {/* Unit & Level */}
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {item.unit_type === 'university' && (
                                                        <Badge variant="outline" className="border-blue-500/40 text-blue-600 dark:text-blue-400 text-[10px] px-1.5 py-0">
                                                            Universitas
                                                        </Badge>
                                                    )}
                                                    {item.unit_type === 'faculty' && (
                                                        <Badge variant="outline" className="border-purple-500/40 text-purple-600 dark:text-purple-400 text-[10px] px-1.5 py-0">
                                                            Fakultas
                                                        </Badge>
                                                    )}
                                                    {item.unit_type === 'study_program' && (
                                                        <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0">
                                                            Prodi {item.level && `(${item.level})`}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                                    {item.unit_name}
                                                </span>
                                                {item.faculty_name && (
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {item.faculty_name}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Body & SK */}
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    {item.accreditation_body}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                    {item.sk_number}
                                                </span>
                                                {item.sk_date && (
                                                    <span className="text-[11px] text-slate-400">
                                                        SK: {new Date(item.sk_date).toLocaleDateString('id-ID')}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Grade */}
                                        <TableCell>
                                            {getGradeBadge(item.grade)}
                                        </TableCell>

                                        {/* Validity & Status */}
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div>{getStatusBadge(item.status, item.valid_until)}</div>
                                                <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
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
                                        <TableCell className="text-center">
                                            {item.certificate_file ? (
                                                <a
                                                    href={`/storage/${item.certificate_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40"
                                                    title="Unduh / Lihat Sertifikat"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    <span>Unduh</span>
                                                </a>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">-</span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditDialog(item)}
                                                    className="h-8 w-8 text-slate-600 hover:text-slate-900"
                                                    title="Edit Akreditasi"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(item)}
                                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
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
                </CardContent>

                {/* Pagination */}
                {accreditations.last_page > 1 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div>
                            Menampilkan data ke{' '}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {(accreditations.current_page - 1) * accreditations.per_page + 1}
                            </span>{' '}
                            -{' '}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {Math.min(accreditations.current_page * accreditations.per_page, accreditations.total)}
                            </span>{' '}
                            dari <span className="font-semibold text-slate-700 dark:text-slate-300">{accreditations.total}</span> total
                        </div>
                        <div className="flex items-center gap-1">
                            {accreditations.links.map((link, idx) => (
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
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* Create / Edit Modal Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);

                    if (!open) {
                        setEditingItem(null);
                        reset();
                    }
                }}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Award className="h-5 w-5 text-[#8B142C]" />
                            {editingItem ? 'Edit Data Akreditasi' : 'Tambah Data Akreditasi Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {/* Pilih dari Unit Akademik Master */}
                        <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                <span>Pilih Entitas dari Master Data API</span>
                                <span className="text-[11px] font-normal text-slate-500">
                                    Otomatis mengisi nama, fakultas, dan jenjang
                                </span>
                            </Label>
                            <Select
                                value={selectedUnitId}
                                onValueChange={handleUnitSelect}
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Pilih entitas terdaftar atau input manual" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    <SelectItem value="custom">-- Input Manual / Belum Terdaftar --</SelectItem>
                                    <SelectItem disabled value="__group_univ" className="font-bold text-slate-400">
                                        --- UNIVERSITAS ---
                                    </SelectItem>
                                    {academicUnits
                                        .filter((u) => u.type === 'university')
                                        .map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                🏛️ {u.name}
                                            </SelectItem>
                                        ))}

                                    <SelectItem disabled value="__group_fac" className="font-bold text-slate-400">
                                        --- FAKULTAS ---
                                    </SelectItem>
                                    {academicUnits
                                        .filter((u) => u.type === 'faculty')
                                        .map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                🏢 {u.name}
                                            </SelectItem>
                                        ))}

                                    <SelectItem disabled value="__group_prodi" className="font-bold text-slate-400">
                                        --- PROGRAM STUDI ---
                                    </SelectItem>
                                    {academicUnits
                                        .filter((u) => u.type === 'study_program')
                                        .map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                🎓 [{u.level}] {u.name} ({u.faculty_name})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Jenis Entitas & Jenjang */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="unit_type" className="text-xs">
                                    Tingkat Entitas <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.unit_type}
                                    onValueChange={(val: 'university' | 'faculty' | 'study_program') =>
                                        setData('unit_type', val)
                                    }
                                >
                                    <SelectTrigger id="unit_type" className="h-9 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="university">Universitas</SelectItem>
                                        <SelectItem value="faculty">Fakultas</SelectItem>
                                        <SelectItem value="study_program">Program Studi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.unit_type && <p className="text-red-500 text-[11px]">{errors.unit_type}</p>}
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor="unit_name" className="text-xs">
                                    Nama Entitas (Univ / Fak / Prodi) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="unit_name"
                                    value={data.unit_name}
                                    onChange={(e) => setData('unit_name', e.target.value)}
                                    placeholder="Contoh: S1 Kedokteran"
                                    className="h-9 text-xs"
                                />
                                {errors.unit_name && <p className="text-red-500 text-[11px]">{errors.unit_name}</p>}
                            </div>
                        </div>

                        {/* Jenjang & Nama Fakultas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="level" className="text-xs">
                                    Jenjang (Khusus Prodi)
                                </Label>
                                <Select
                                    value={data.level || 'none'}
                                    onValueChange={(val) => setData('level', val === 'none' ? '' : val)}
                                >
                                    <SelectTrigger id="level" className="h-9 text-xs">
                                        <SelectValue placeholder="Pilih jenjang (bila Prodi)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Tanpa Jenjang --</SelectItem>
                                        <SelectItem value="D3">Diploma 3 (D3)</SelectItem>
                                        <SelectItem value="D4">Diploma 4 / Sarjana Terapan (D4)</SelectItem>
                                        <SelectItem value="S1">Sarjana (S1)</SelectItem>
                                        <SelectItem value="S2">Magister (S2)</SelectItem>
                                        <SelectItem value="S3">Doktor (S3)</SelectItem>
                                        <SelectItem value="Profesi">Profesi</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.level && <p className="text-red-500 text-[11px]">{errors.level}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="faculty_name" className="text-xs">
                                    Nama Fakultas (Opsional)
                                </Label>
                                <Input
                                    id="faculty_name"
                                    value={data.faculty_name}
                                    onChange={(e) => setData('faculty_name', e.target.value)}
                                    placeholder="Contoh: Fakultas Kedokteran"
                                    className="h-9 text-xs"
                                />
                                {errors.faculty_name && <p className="text-red-500 text-[11px]">{errors.faculty_name}</p>}
                            </div>
                        </div>

                        {/* Lembaga Akreditasi & Peringkat */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="accreditation_body" className="text-xs">
                                    Lembaga Akreditasi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="accreditation_body"
                                    value={data.accreditation_body}
                                    onChange={(e) => setData('accreditation_body', e.target.value)}
                                    placeholder="BAN-PT / LAM-PTKes / LAM INFOKOM"
                                    className="h-9 text-xs"
                                    list="body-options"
                                />
                                <datalist id="body-options">
                                    {COMMON_BODIES.map((b) => (
                                        <option key={b} value={b} />
                                    ))}
                                </datalist>
                                {errors.accreditation_body && (
                                    <p className="text-red-500 text-[11px]">{errors.accreditation_body}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="grade" className="text-xs">
                                    Peringkat Akreditasi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="grade"
                                    value={data.grade}
                                    onChange={(e) => setData('grade', e.target.value)}
                                    placeholder="Unggul / Baik Sekali / A / B"
                                    className="h-9 text-xs"
                                    list="grade-options"
                                />
                                <datalist id="grade-options">
                                    {COMMON_GRADES.map((g) => (
                                        <option key={g} value={g} />
                                    ))}
                                </datalist>
                                {errors.grade && <p className="text-red-500 text-[11px]">{errors.grade}</p>}
                            </div>
                        </div>

                        {/* Nomor SK, Tanggal SK & Masa Berlaku */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="sk_number" className="text-xs">
                                    Nomor SK <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="sk_number"
                                    value={data.sk_number}
                                    onChange={(e) => setData('sk_number', e.target.value)}
                                    placeholder="0123/SK/BAN-PT/..."
                                    className="h-9 text-xs font-mono"
                                />
                                {errors.sk_number && <p className="text-red-500 text-[11px]">{errors.sk_number}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="sk_date" className="text-xs">
                                    Tanggal SK
                                </Label>
                                <Input
                                    id="sk_date"
                                    type="date"
                                    value={data.sk_date}
                                    onChange={(e) => setData('sk_date', e.target.value)}
                                    className="h-9 text-xs"
                                />
                                {errors.sk_date && <p className="text-red-500 text-[11px]">{errors.sk_date}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="valid_until" className="text-xs">
                                    Berlaku Sampai
                                </Label>
                                <Input
                                    id="valid_until"
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => setData('valid_until', e.target.value)}
                                    className="h-9 text-xs"
                                />
                                {errors.valid_until && <p className="text-red-500 text-[11px]">{errors.valid_until}</p>}
                            </div>
                        </div>

                        {/* Status Akreditasi */}
                        <div className="space-y-1.5">
                            <Label htmlFor="status" className="text-xs">
                                Status Akreditasi <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={data.status}
                                onValueChange={(val: 'active' | 'expired' | 'in_process') => setData('status', val)}
                            >
                                <SelectTrigger id="status" className="h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Aktif (Masih Berlaku)</SelectItem>
                                    <SelectItem value="expired">Kedaluwarsa (Kadaluwarsa)</SelectItem>
                                    <SelectItem value="in_process">Dalam Proses Re-Akreditasi</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-[11px]">{errors.status}</p>}
                        </div>

                        {/* Upload Berkas Sertifikat */}
                        <div className="space-y-1.5">
                            <Label className="text-xs">Berkas Sertifikat (PDF / JPG / PNG max 5MB)</Label>
                            <div className="p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 text-center">
                                <FileCheck className="h-8 w-8 text-slate-400 mb-1" />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,image/png,image/jpeg,image/webp"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('certificate_file', file);
                                    }}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-1 gap-1 text-xs"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    {data.certificate_file ? 'Ganti Berkas' : 'Pilih Berkas Sertifikat'}
                                </Button>
                                {data.certificate_file && (
                                    <p className="text-xs text-emerald-600 font-medium mt-1">
                                        ✓ Terpilih: {data.certificate_file.name}
                                    </p>
                                )}
                                {editingItem?.certificate_file && !data.certificate_file && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                                        <span>Berkas saat ini:</span>
                                        <a
                                            href={`/storage/${editingItem.certificate_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline font-mono truncate max-w-xs"
                                        >
                                            {editingItem.certificate_file}
                                        </a>
                                    </div>
                                )}
                            </div>
                            {errors.certificate_file && (
                                <p className="text-red-500 text-[11px]">{errors.certificate_file}</p>
                            )}
                        </div>

                        {/* Catatan Tambahan */}
                        <div className="space-y-1.5">
                            <Label htmlFor="notes" className="text-xs">
                                Catatan / Keterangan (Opsional)
                            </Label>
                            <textarea
                                id="notes"
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Keterangan tambahan mengenai akreditasi..."
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {errors.notes && <p className="text-red-500 text-[11px]">{errors.notes}</p>}
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-[#8B142C] hover:bg-[#721024] text-white text-xs"
                            >
                                {editingItem ? 'Simpan Perubahan' : 'Tambah Akreditasi'}
                            </Button>
                        </DialogFooter>
                    </form>
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
