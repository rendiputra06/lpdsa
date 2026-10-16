import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock,
    Edit,
    ExternalLink,
    FolderOpen,
    Megaphone,
    Plus,
    Search,
    Sparkles,
    Tag,
    Tags,
    Trash2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    announcements_count: number;
    created_at?: string;
    updated_at?: string;
}

interface Stats {
    total: number;
    used_count: number;
    unused_count: number;
    total_announcements: number;
}

interface Props {
    categories: CategoryItem[];
    stats?: Stats;
    filters?: {
        search: string;
    };
}

export default function CategoryIndex({ categories = [], stats, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all');

    // Dialog state for create/edit
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

    // Dialog state for delete confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        name: '',
        description: '',
    });

    // Fallback stats computation if controller doesn't provide
    const computedStats = useMemo(() => {
        if (stats) return stats;
        const total = categories.length;
        const used_count = categories.filter((c) => c.announcements_count > 0).length;
        const unused_count = total - used_count;
        const total_announcements = categories.reduce(
            (sum, c) => sum + (c.announcements_count || 0),
            0
        );
        return { total, used_count, unused_count, total_announcements };
    }, [stats, categories]);

    // Client-side filtering (combined with backend search)
    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const matchesSearch =
                !searchQuery.trim() ||
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.description &&
                    category.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'used' && category.announcements_count > 0) ||
                (statusFilter === 'unused' && category.announcements_count === 0);

            return matchesSearch && matchesStatus;
        });
    }, [categories, searchQuery, statusFilter]);

    const handleOpenCreateDialog = () => {
        setEditingCategory(null);
        clearErrors();
        reset();
        setIsDialogOpen(true);
    };

    const handleOpenEditDialog = (category: CategoryItem) => {
        setEditingCategory(category);
        clearErrors();
        setData({
            name: category.name,
            description: category.description || '',
        });
        setIsDialogOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingCategory(null);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const handleOpenDeleteDialog = (category: CategoryItem) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;
        destroy(`/admin/categories/${categoryToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/categories',
            { search: searchQuery },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setStatusFilter('all');
        router.get('/admin/categories', {}, { preserveState: false });
    };

    const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all';

    return (
        <>
            <Head title="Manajemen Kategori - LPDSA Universitas Abdurrab" />

            <div className="space-y-6 pb-12">
                {/* 1. Univrab Signature Crimson Hero Banner */}
                <div className="relative rounded-3xl bg-linear-to-br from-brand-900 via-brand-800 to-brand-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/10 overflow-hidden">
                    {/* Pola titik dekoratif Univrab */}
                    <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

                    {/* Gradient light orb */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="max-w-3xl">
                            {/* Glassmorphism Eyebrow Pill */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300 border border-white/20 mb-3">
                                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                                <span>Portal Pengumuman & Informasi LPDSA Univrab</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                                Manajemen <span className="text-gold-300">Kategori</span>
                            </h1>
                            <p className="mt-2 text-sm text-white/80 leading-relaxed max-w-2xl">
                                Kelola taksonomi kategori untuk mengelompokkan pengumuman,
                                edaran pangkalan data, berita SPMI, dan agenda akreditasi di
                                lingkungan Universitas Abdurrab.
                            </p>

                            {/* Quick Navigation Pills */}
                            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                                <Link
                                    href="/admin/announcements"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 transition-colors"
                                >
                                    <Megaphone className="h-3.5 w-3.5 text-gold-300" />
                                    <span>Kelola Pengumuman</span>
                                    <ArrowRight className="h-3 w-3 opacity-60" />
                                </Link>
                                <span className="text-white/40">•</span>
                                <span className="text-white/70">
                                    {computedStats.total} Kategori Terdaftar
                                </span>
                            </div>
                        </div>

                        {/* CTA Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                onClick={handleOpenCreateDialog}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-400 hover:bg-gold-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 transition-all cursor-pointer h-auto"
                            >
                                <Plus className="h-4 w-4 stroke-[3]" />
                                <span>Tambah Kategori Baru</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Kategori */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center">
                                <Tags className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                                Total
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {computedStats.total}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Semua Kategori
                        </div>
                    </div>

                    {/* Digunakan */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                Aktif
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {computedStats.used_count}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Memiliki Pengumuman
                        </div>
                    </div>

                    {/* Belum Digunakan */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Clock className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                Kosong
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {computedStats.unused_count}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Belum Ada Pengumuman
                        </div>
                    </div>

                    {/* Total Pengumuman Terkait */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs hover:border-brand-300 dark:hover:border-gold-400/50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                Relasi
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {computedStats.total_announcements}
                        </div>
                        <div className="text-xs font-semibold text-slate-600 dark:text-neutral-400 mt-1">
                            Total Pengumuman
                        </div>
                    </div>
                </div>

                {/* 3. Filter & Search Toolbar */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
                    >
                        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            {/* Input Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <Input
                                    type="text"
                                    placeholder="Cari nama, slug, atau deskripsi kategori..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-9 rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Status Filter Dropdown */}
                            <div className="w-full sm:w-48">
                                <Select
                                    value={statusFilter}
                                    onValueChange={(val: any) => setStatusFilter(val)}
                                >
                                    <SelectTrigger className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10">
                                        <SelectValue placeholder="Status Penggunaan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        <SelectItem value="used">Digunakan ({computedStats.used_count})</SelectItem>
                                        <SelectItem value="unused">Belum Terpakai ({computedStats.unused_count})</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Reset Filter Button */}
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResetFilter}
                                className="rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 h-10 cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Reset Filter
                            </Button>
                        )}
                    </form>
                </div>

                {/* 4. Table Container */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/75 dark:bg-neutral-800/50">
                                <TableRow className="border-b border-slate-200/80 dark:border-neutral-800">
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 w-12 text-center">
                                        #
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Kategori
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400">
                                        Deskripsi
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-center">
                                        Pengumuman
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category, index) => {
                                        const isUsed = category.announcements_count > 0;
                                        return (
                                            <TableRow
                                                key={category.id}
                                                className="border-b border-slate-100 dark:border-neutral-800/60 hover:bg-slate-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                                            >
                                                {/* Number */}
                                                <TableCell className="py-3.5 px-4 text-xs font-medium text-slate-400 dark:text-neutral-500 text-center">
                                                    {index + 1}
                                                </TableCell>

                                                {/* Category Name & Slug */}
                                                <TableCell className="py-3.5 px-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Tag className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-brand-700 transition-colors">
                                                                {category.name}
                                                            </div>
                                                            <div className="mt-1 flex items-center gap-1.5">
                                                                <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200/60 dark:border-neutral-700/60">
                                                                    /{category.slug}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Description */}
                                                <TableCell className="py-3.5 px-4 text-xs text-slate-600 dark:text-neutral-400 max-w-sm">
                                                    {category.description ? (
                                                        <span className="line-clamp-2 leading-relaxed">
                                                            {category.description}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300 dark:text-neutral-600 italic">
                                                            Tidak ada deskripsi tambahan
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* Announcements Count */}
                                                <TableCell className="py-3.5 px-4 text-center">
                                                    {isUsed ? (
                                                        <Link
                                                            href={`/admin/announcements?category_id=${category.id}`}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/80 dark:hover:bg-brand-900/80 text-[#8B142C] dark:text-gold-300 border border-brand-200/60 dark:border-brand-800/80 transition-colors"
                                                            title="Lihat pengumuman dengan kategori ini"
                                                        >
                                                            <span>{category.announcements_count} Pengumuman</span>
                                                            <ExternalLink className="h-3 w-3 opacity-70" />
                                                        </Link>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500">
                                                            0 Pengumuman
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell className="py-3.5 px-4 text-center">
                                                    {isUsed ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                            Belum Dipakai
                                                        </span>
                                                    )}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEditDialog(category)}
                                                            className="h-8 w-8 rounded-lg text-slate-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-gold-400 hover:bg-slate-100 dark:hover:bg-neutral-800"
                                                            title="Edit Kategori"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDeleteDialog(category)}
                                                            className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                                            title="Hapus Kategori"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-12">
                                            {/* Empty State */}
                                            <div className="text-center max-w-sm mx-auto">
                                                <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-[#8B142C] dark:text-gold-400 flex items-center justify-center mx-auto mb-3">
                                                    <FolderOpen className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                    Tidak Ada Kategori Ditemukan
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                                                    {searchQuery || statusFilter !== 'all'
                                                        ? 'Tidak ada kategori yang cocok dengan kriteria pencarian dan filter yang dipilih.'
                                                        : 'Belum ada kategori yang dibuat. Klik tombol di bawah untuk menambahkan kategori baru.'}
                                                </p>
                                                <div className="mt-4">
                                                    {hasActiveFilters ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleResetFilter}
                                                            className="rounded-xl text-xs font-semibold"
                                                        >
                                                            Reset Filter
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={handleOpenCreateDialog}
                                                            className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs"
                                                        >
                                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                                            Tambah Kategori Baru
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer info */}
                    <div className="p-4 border-t border-slate-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-400">
                        <div>
                            Menampilkan <span className="font-bold text-slate-900 dark:text-white">{filteredCategories.length}</span> dari <span className="font-bold text-slate-900 dark:text-white">{categories.length}</span> kategori
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                            <span>Kategori yang terikat pengumuman tidak dapat dihapus demi integritas data.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Create / Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingCategory(null);
                        clearErrors();
                        reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0">
                                {editingCategory ? (
                                    <Edit className="h-5 w-5" />
                                ) : (
                                    <Plus className="h-5 w-5" />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
                                    {editingCategory
                                        ? 'Perbarui Data Kategori'
                                        : 'Tambah Kategori Baru'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                                    {editingCategory
                                        ? 'Sesuaikan informasi nama dan deskripsi kategori pengumuman.'
                                        : 'Buat kategori baru untuk pengelompokan warta dan agenda LPDSA.'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="category-name"
                                className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                            >
                                Nama Kategori <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="category-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Akreditasi & Penjaminan Mutu"
                                className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs h-10 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>{errors.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="category-desc"
                                className="text-xs font-bold text-slate-700 dark:text-neutral-300"
                            >
                                Deskripsi (Opsional)
                            </Label>
                            <Textarea
                                id="category-desc"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Keterangan singkat tentang lingkup topik kategori ini..."
                                rows={3}
                                className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs resize-none focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
                            />
                            {errors.description && (
                                <p className="text-rose-500 text-[11px] font-medium flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                    <span>{errors.description}</span>
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-3 gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={processing}
                                className="rounded-xl text-xs font-semibold h-10 px-4"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.name.trim()}
                                className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs h-10 px-5 shadow-md cursor-pointer"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Menyimpan...</span>
                                    </span>
                                ) : editingCategory ? (
                                    'Simpan Perubahan'
                                ) : (
                                    'Buat Kategori'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* 6. Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    setIsDeleteDialogOpen(open);
                    if (!open) setCategoryToDelete(null);
                }}
            >
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl">
                    <DialogHeader className="items-center text-center">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            Hapus Kategori?
                        </DialogTitle>
                        <div className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">
                            Apakah Anda yakin ingin menghapus kategori{' '}
                            <span className="font-bold text-slate-900 dark:text-white">
                                "{categoryToDelete?.name}"
                            </span>
                            ?
                        </div>
                    </DialogHeader>

                    {categoryToDelete && categoryToDelete.announcements_count > 0 ? (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 my-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="font-bold">Kategori Tidak Dapat Dihapus</p>
                                <p className="mt-0.5 text-[11px] leading-relaxed">
                                    Kategori ini masih digunakan oleh{' '}
                                    <span className="font-bold">
                                        {categoryToDelete.announcements_count} pengumuman
                                    </span>
                                    . Ubah atau pindahkan kategori pengumuman tersebut terlebih dahulu.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center px-4">
                            Tindakan ini tidak dapat dibatalkan. Kategori ini akan dihapus secara permanen dari sistem.
                        </p>
                    )}

                    <DialogFooter className="mt-4 flex gap-2 sm:justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={processing}
                            className="rounded-xl text-xs font-semibold px-4 h-10"
                        >
                            {categoryToDelete && categoryToDelete.announcements_count > 0 ? 'Mengerti' : 'Batal'}
                        </Button>
                        {categoryToDelete && categoryToDelete.announcements_count === 0 && (
                            <Button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={processing}
                                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 h-10 shadow-sm cursor-pointer"
                            >
                                {processing ? 'Menghapus...' : 'Ya, Hapus'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengumuman', href: '/admin/announcements' },
        { title: 'Kategori', href: '/admin/categories' },
    ],
};
