import { Head, Link, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Copy,
    Download,
    Edit,
    ExternalLink,
    Eye,
    FileCheck,
    FileText,
    FolderPlus,
    FolderTree,
    Layers,
    Menu as MenuIcon,
    Plus,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface SpmiCategory {
    id: number;
    name: string;
    slug: string;
    cycle_stage: string;
    sub_stage: string;
    description: string | null;
    order: number;
    is_active: boolean;
    documents_count: number;
    public_url: string;
    is_menu_published: boolean;
    menu_id: number | null;
}

interface SpmiDocument {
    id: number;
    spmi_category_id: number;
    document_number: string | null;
    title: string;
    slug?: string;
    year: number;
    file_path: string | null;
    external_url: string | null;
    effective_url: string | null;
    share_url?: string;
    description: string | null;
    is_public: boolean;
    download_count: number;
    created_at?: string;
    updated_at?: string;
    category?: SpmiCategory;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    documents: {
        data: SpmiDocument[];
        links: PaginationLink[];
        total: number;
        current_page: number;
        last_page: number;
    };
    categories: SpmiCategory[];
    filters: {
        search?: string;
        category_id?: string;
        year?: string;
    };
    availableYears: number[];
    stats: {
        total_documents: number;
        total_categories: number;
        published_categories: number;
        pending_categories: number;
    };
}

export default function SpmiDocumentIndex({
    documents,
    categories = [],
    filters = {},
    availableYears = [],
    stats,
}: Props) {
    const [activeTab, setActiveTab] = useState<'documents' | 'categories'>('documents');

    // Filter states
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id || 'all');
    const [yearFilter, setYearFilter] = useState(filters.year || 'all');

    // Loading states for menu publishing
    const [publishingId, setPublishingId] = useState<number | null>(null);

    // --- Document Create/Edit Dialog State ---
    const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<SpmiDocument | null>(null);
    const [sourceType, setSourceType] = useState<'external' | 'file'>('external');

    const docForm = useForm<{
        spmi_category_id: string;
        document_number: string;
        title: string;
        year: string;
        external_url: string;
        file: File | null;
        description: string;
        is_public: boolean;
    }>({
        spmi_category_id: '',
        document_number: '',
        title: '',
        year: new Date().getFullYear().toString(),
        external_url: '',
        file: null,
        description: '',
        is_public: true,
    });

    // --- Category Create/Edit Dialog State ---
    const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<SpmiCategory | null>(null);

    const catForm = useForm<{
        name: string;
        slug: string;
        order: string;
        description: string;
        is_active: boolean;
    }>({
        name: '',
        slug: '',
        order: '1',
        description: '',
        is_active: true,
    });

    // --- Delete Dialog States ---
    const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<SpmiDocument | null>(null);

    const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState<SpmiCategory | null>(null);

    // Apply document filters
    const handleApplyFilters = (newFilters?: {
        search?: string;
        category_id?: string;
        year?: string;
    }) => {
        const query: Record<string, string> = {};
        const q = newFilters?.search !== undefined ? newFilters.search : searchQuery;
        const cat = newFilters?.category_id !== undefined ? newFilters.category_id : categoryFilter;
        const yr = newFilters?.year !== undefined ? newFilters.year : yearFilter;

        if (q.trim()) query.search = q.trim();
        if (cat && cat !== 'all') query.category_id = cat;
        if (yr && yr !== 'all') query.year = yr;

        // Reset selalu ke halaman 1 saat filter atau kata kunci pencarian berubah
        query.page = '1';

        router.get('/admin/spmi/documents', query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setCategoryFilter('all');
        setYearFilter('all');
        router.get('/admin/spmi/documents', { page: '1' }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // --- Document Handlers ---
    const openCreateDocModal = () => {
        setEditingDoc(null);
        setSourceType('external');
        docForm.reset();
        docForm.clearErrors();
        docForm.setData({
            spmi_category_id: categories.length > 0 ? categories[0].id.toString() : '',
            document_number: '',
            title: '',
            year: new Date().getFullYear().toString(),
            external_url: '',
            file: null,
            description: '',
            is_public: true,
        });
        setIsDocDialogOpen(true);
    };

    const openEditDocModal = (doc: SpmiDocument) => {
        setEditingDoc(doc);
        setSourceType(doc.file_path ? 'file' : 'external');
        docForm.clearErrors();
        docForm.setData({
            spmi_category_id: doc.spmi_category_id.toString(),
            document_number: doc.document_number || '',
            title: doc.title,
            year: doc.year.toString(),
            external_url: doc.external_url || '',
            file: null,
            description: doc.description || '',
            is_public: doc.is_public,
        });
        setIsDocDialogOpen(true);
    };

    const handleSubmitDoc = (e: React.FormEvent) => {
        e.preventDefault();

        // Pastikan hanya salah satu sumber dokumen yang dikirimkan agar tidak bertumpuk
        const sanitizedData = (data: typeof docForm.data) => ({
            ...data,
            external_url: sourceType === 'external' ? data.external_url : '',
            file: sourceType === 'file' ? data.file : null,
        });

        if (editingDoc) {
            docForm.transform((data) => ({
                ...sanitizedData(data),
                _method: 'PUT',
            }));
            docForm.post(`/admin/spmi/documents/${editingDoc.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setIsDocDialogOpen(false);
                    docForm.reset();
                    toast.success('Dokumen SPMI berhasil diperbarui.');
                },
            });
        } else {
            docForm.transform((data) => sanitizedData(data));
            docForm.post('/admin/spmi/documents', {
                forceFormData: true,
                onSuccess: () => {
                    setIsDocDialogOpen(false);
                    docForm.reset();
                    toast.success('Dokumen SPMI baru berhasil ditambahkan.');
                },
            });
        }
    };

    const confirmDeleteDoc = (doc: SpmiDocument) => {
        setDocToDelete(doc);
        setIsDeleteDocOpen(true);
    };

    const handleExecuteDeleteDoc = () => {
        if (!docToDelete) return;
        router.delete(`/admin/spmi/documents/${docToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteDocOpen(false);
                setDocToDelete(null);
                toast.success('Dokumen berhasil dihapus.');
            },
        });
    };

    // --- Category Handlers ---
    const openCreateCatModal = () => {
        setEditingCat(null);
        catForm.reset();
        catForm.clearErrors();
        const nextOrder = categories.length > 0 ? (Math.max(...categories.map((c) => c.order)) + 1).toString() : '1';
        catForm.setData({
            name: '',
            slug: '',
            order: nextOrder,
            description: '',
            is_active: true,
        });
        setIsCatDialogOpen(true);
    };

    const openEditCatModal = (cat: SpmiCategory) => {
        setEditingCat(cat);
        catForm.clearErrors();
        catForm.setData({
            name: cat.name,
            slug: cat.slug,
            order: cat.order.toString(),
            description: cat.description || '',
            is_active: cat.is_active,
        });
        setIsCatDialogOpen(true);
    };

    const handleSubmitCat = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCat) {
            catForm.put(`/admin/spmi/categories/${editingCat.id}`, {
                onSuccess: () => {
                    setIsCatDialogOpen(false);
                    catForm.reset();
                    toast.success('Kategori kriteria SPMI berhasil diperbarui.');
                },
            });
        } else {
            catForm.post('/admin/spmi/categories', {
                onSuccess: () => {
                    setIsCatDialogOpen(false);
                    catForm.reset();
                    toast.success('Kategori kriteria SPMI baru berhasil ditambahkan.');
                },
            });
        }
    };

    const confirmDeleteCat = (cat: SpmiCategory) => {
        setCatToDelete(cat);
        setIsDeleteCatOpen(true);
    };

    const handleExecuteDeleteCat = () => {
        if (!catToDelete) return;
        router.delete(`/admin/spmi/categories/${catToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteCatOpen(false);
                setCatToDelete(null);
                toast.success('Kategori berhasil dihapus.');
            },
        });
    };

    // 1-Click publish category to menu
    const handlePublishToMenu = (cat: SpmiCategory) => {
        setPublishingId(cat.id);
        router.post(
            `/admin/spmi/categories/${cat.id}/publish-menu`,
            {},
            {
                onSuccess: () => {
                    toast.success(`Kategori "${cat.name}" berhasil didaftarkan ke menu publik.`);
                },
                onFinish: () => setPublishingId(null),
                preserveScroll: true,
            }
        );
    };

    const isFilterActive =
        searchQuery.trim() !== '' || categoryFilter !== 'all' || yearFilter !== 'all';

    return (
        <div className="space-y-6">
            <Head title="Manajemen Dokumen SPMI - LPDSA" />

            {/* Header & Primary Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-[#8B142C] dark:text-gold-400 flex items-center justify-center shrink-0 border border-brand-100 dark:border-brand-900/50">
                        <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Repositori Dokumen SPMI
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                            Kelola arsip kebijakan SPMI (Sistem Penjaminan Mutu Internal) dan integrasi navigasi menu publik.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="outline"
                        asChild
                        className="rounded-xl border-slate-200 dark:border-neutral-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800"
                    >
                        <Link href="/spmi/penetapan/kebijakan" target="_blank">
                            <ExternalLink className="h-4 w-4 mr-1.5 text-[#8B142C] dark:text-gold-400" />
                            <span>Lihat Halaman Publik</span>
                        </Link>
                    </Button>

                    <Button
                        onClick={openCreateDocModal}
                        className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs shadow-xs"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        <span>Tambah Dokumen</span>
                    </Button>
                </div>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                Total Dokumen
                            </p>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {stats.total_documents}
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                                Surat Keputusan / Pedoman
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                Kategori Kriteria
                            </p>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {stats.total_categories}
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-0.5">
                                Standar & Kriteria SPMI
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <FolderTree className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                Menu Publik Aktif
                            </p>
                            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                                {stats.published_categories}
                            </h3>
                            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                                Tersedia di navbar
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
                                Belum Ada di Menu
                            </p>
                            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                                {stats.pending_categories}
                            </h3>
                            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                                Perlu didaftarkan
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Container */}
            <Tabs
                value={activeTab}
                onValueChange={(val: any) => setActiveTab(val)}
                className="space-y-4"
            >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-2">
                    <TabsList className="bg-slate-100 dark:bg-neutral-800 p-1 rounded-xl">
                        <TabsTrigger
                            value="documents"
                            className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-[#8B142C] dark:data-[state=active]:text-gold-400"
                        >
                            <FileCheck className="h-4 w-4 mr-1.5" />
                            <span>Arsip Dokumen ({documents.total})</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="categories"
                            className="rounded-lg text-xs font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-[#8B142C] dark:data-[state=active]:text-gold-400"
                        >
                            <Layers className="h-4 w-4 mr-1.5" />
                            <span>Kategori Kriteria SPMI ({categories.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === 'categories' && (
                        <Button
                            onClick={openCreateCatModal}
                            size="sm"
                            className="rounded-xl bg-[#8B142C] hover:bg-[#721024] text-white font-bold text-xs shadow-xs"
                        >
                            <FolderPlus className="h-4 w-4 mr-1.5" />
                            <span>Tambah Kategori Kriteria</span>
                        </Button>
                    )}
                </div>

                {/* --- TAB 1: DOKUMEN SPMI --- */}
                <TabsContent value="documents" className="space-y-4 mt-0">
                    {/* Filters & Search Toolbar */}
                    <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {/* Search */}
                                <div className="sm:col-span-2 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Cari judul dokumen atau nomor SK..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                                        className="pl-9 h-10 rounded-xl text-xs bg-slate-50/50 dark:bg-neutral-900/50"
                                    />
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <Select
                                        value={categoryFilter}
                                        onValueChange={(val) => {
                                            setCategoryFilter(val);
                                            handleApplyFilters({ category_id: val });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl text-xs bg-slate-50/50 dark:bg-neutral-900/50">
                                            <SelectValue placeholder="Pilih Kategori Kriteria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori Kriteria</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name} ({cat.documents_count})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Year Filter */}
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={yearFilter}
                                        onValueChange={(val) => {
                                            setYearFilter(val);
                                            handleApplyFilters({ year: val });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 rounded-xl text-xs bg-slate-50/50 dark:bg-neutral-900/50">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tahun</SelectItem>
                                            {availableYears.map((yr) => (
                                                <SelectItem key={yr} value={yr.toString()}>
                                                    Tahun {yr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {isFilterActive && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleResetFilters}
                                            title="Reset Filter"
                                            className="h-10 w-10 shrink-0 text-slate-400 hover:text-slate-600 rounded-xl"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents Table */}
                    <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 dark:bg-neutral-900/80">
                                    <TableRow className="border-b border-slate-200/80 dark:border-neutral-800">
                                        <TableHead className="w-14 text-center font-bold text-xs">No.</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[160px]">Nomor Dokumen</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[280px]">Judul Dokumen</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[180px]">Kategori Kriteria</TableHead>
                                        <TableHead className="w-20 text-center font-bold text-xs">Tahun</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[140px]">Tipe Berkas</TableHead>
                                        <TableHead className="w-28 text-center font-bold text-xs">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-12 text-slate-400 dark:text-neutral-500 text-xs"
                                            >
                                                <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                                                <p className="font-medium">Tidak ada dokumen SPMI yang ditemukan.</p>
                                                <p className="text-[11px] mt-0.5">
                                                    Silakan sesuaikan filter pencarian atau tambahkan dokumen baru.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        documents.data.map((doc, idx) => {
                                            const rowNumber = (documents.current_page - 1) * 15 + idx + 1;
                                            const category = doc.category;
                                            const isMenuReady = category?.is_menu_published;

                                            return (
                                                <TableRow
                                                    key={doc.id}
                                                    className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 border-b border-slate-100 dark:border-neutral-800/60"
                                                >
                                                    <TableCell className="text-center text-xs text-slate-500 font-medium">
                                                        {rowNumber}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-slate-700 dark:text-neutral-300">
                                                        {doc.document_number ? (
                                                            <span className="bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
                                                                {doc.document_number}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                                                                {doc.title}
                                                            </p>
                                                            {doc.description && (
                                                                <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                                                    {doc.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {category ? (
                                                            <div className="space-y-1">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="rounded-lg text-[10px] font-medium bg-brand-50/50 dark:bg-brand-950/40 text-[#8B142C] dark:text-gold-400 border-brand-200/50 dark:border-brand-900/50"
                                                                >
                                                                    {category.name}
                                                                </Badge>
                                                                <div className="flex items-center gap-1 text-[10px]">
                                                                    {isMenuReady ? (
                                                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                                                                            Menu aktif
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-medium">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block" />
                                                                            Belum ada di menu
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-xs text-slate-700 dark:text-neutral-300">
                                                        {doc.year}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            {doc.external_url ? (
                                                                <a
                                                                    href={doc.external_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                                >
                                                                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                                                    <span>Tautan Drive</span>
                                                                </a>
                                                            ) : doc.file_path ? (
                                                                <a
                                                                    href={doc.effective_url || '#'}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-[#8B142C] dark:text-gold-400 hover:underline font-medium"
                                                                >
                                                                    <Download className="h-3.5 w-3.5 shrink-0" />
                                                                    <span>Unduh PDF</span>
                                                                </a>
                                                            ) : (
                                                                <span className="text-xs text-slate-400">—</span>
                                                            )}
                                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-neutral-400 font-medium">
                                                                <Eye className="h-3 w-3 text-slate-400" />
                                                                <span>{doc.download_count}x diakses</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <a
                                                                href={doc.share_url || `/spmi/dokumen/share/${doc.slug || doc.id}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="Buka via Tautan Resmi Kampus"
                                                                className="h-8 w-8 inline-flex items-center justify-center text-slate-500 hover:text-[#8B142C] rounded-lg transition-colors"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    const rawUrl = doc.share_url || `/spmi/dokumen/share/${doc.slug || doc.id}`;
                                                                    const fullUrl = rawUrl.startsWith('http')
                                                                        ? rawUrl
                                                                        : window.location.origin + rawUrl;
                                                                    navigator.clipboard.writeText(fullUrl);
                                                                    toast.success('Tautan resmi dokumen berhasil disalin ke clipboard');
                                                                }}
                                                                title="Salin Tautan Resmi Dokumen"
                                                                className="h-8 w-8 text-slate-500 hover:text-emerald-600 rounded-lg cursor-pointer"
                                                            >
                                                                <Copy className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => openEditDocModal(doc)}
                                                                title="Edit Dokumen"
                                                                className="h-8 w-8 text-slate-500 hover:text-blue-600 rounded-lg"
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => confirmDeleteDoc(doc)}
                                                                title="Hapus Dokumen"
                                                                className="h-8 w-8 text-slate-500 hover:text-rose-600 rounded-lg"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Links */}
                        {documents.links && documents.links.length > 3 && (
                            <div className="flex items-center justify-between p-4 border-t border-slate-200/80 dark:border-neutral-800 text-xs">
                                <span className="text-slate-500 dark:text-neutral-400">
                                    Menampilkan {documents.data.length} dari {documents.total} dokumen
                                </span>
                                <div className="flex gap-1">
                                    {documents.links.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            asChild={!!link.url}
                                            disabled={!link.url}
                                            className={`h-8 px-3 rounded-lg text-xs ${
                                                link.active
                                                    ? 'bg-[#8B142C] hover:bg-[#721024] text-white'
                                                    : 'text-slate-600 dark:text-neutral-300'
                                            }`}
                                        >
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    preserveState
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* --- TAB 2: KATEGORI KRITERIA SPMI (CRUD) --- */}
                <TabsContent value="categories" className="space-y-4 mt-0">
                    {/* Info Alert regarding Public Navigation */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20 p-4 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                            <p className="font-bold text-sm text-amber-900 dark:text-amber-200">
                                Integrasi Menu Navigasi Publik SPMI
                            </p>
                            <p className="mt-0.5">
                                Kategori kriteria SPMI digunakan sebagai sub-menu berjenjang pada navbar publik (
                                <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                                    SPMI &gt; Penetapan &gt; Kebijakan &gt; [Kategori]
                                </code>
                                ). Jika status kategori menunjukkan <span className="font-bold text-amber-900 dark:text-amber-100">Belum Ada di Menu</span>, Anda dapat mengklik tombol <strong>Daftarkan ke Menu</strong> untuk memasukkannya ke navbar secara otomatis.
                            </p>
                        </div>
                    </div>

                    {/* Category Table */}
                    <Card className="rounded-2xl border-slate-200/90 dark:border-neutral-800 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 dark:bg-neutral-900/80">
                                    <TableRow className="border-b border-slate-200/80 dark:border-neutral-800">
                                        <TableHead className="w-16 text-center font-bold text-xs">Urutan</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[220px]">Nama Kategori Kriteria</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[180px]">Rute / Slug Publik</TableHead>
                                        <TableHead className="w-28 text-center font-bold text-xs">Total Dokumen</TableHead>
                                        <TableHead className="font-bold text-xs min-w-[220px]">Status Menu Navigasi</TableHead>
                                        <TableHead className="w-24 text-center font-bold text-xs">Status</TableHead>
                                        <TableHead className="w-28 text-center font-bold text-xs">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="text-center py-12 text-slate-400 dark:text-neutral-500 text-xs"
                                            >
                                                <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                                                <p className="font-medium">Belum ada kategori kriteria SPMI.</p>
                                                <p className="text-[11px] mt-0.5">
                                                    Klik tombol &quot;Tambah Kategori Kriteria&quot; untuk menambahkan data baru.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.map((cat) => (
                                            <TableRow
                                                key={cat.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 border-b border-slate-100 dark:border-neutral-800/60"
                                            >
                                                <TableCell className="text-center font-bold text-xs text-slate-700 dark:text-neutral-300">
                                                    {cat.order}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {cat.name}
                                                        </p>
                                                        {cat.description && (
                                                            <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                                                                {cat.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-[11px] text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                                        {cat.public_url}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-lg text-xs font-semibold"
                                                    >
                                                        {cat.documents_count} Dokumen
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {cat.is_menu_published ? (
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                                                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                                                <span>Aktif di Menu</span>
                                                            </Badge>
                                                            <Link
                                                                href={cat.public_url}
                                                                target="_blank"
                                                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                                title="Lihat halaman publik kriteria ini"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Badge className="bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[11px] font-semibold flex items-center gap-1">
                                                                <AlertTriangle className="h-3 w-3 text-amber-600" />
                                                                <span>Belum Ada di Menu</span>
                                                            </Badge>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={publishingId === cat.id}
                                                                onClick={() => handlePublishToMenu(cat)}
                                                                className="h-7 text-[10px] font-bold px-2 rounded-lg border-amber-300 text-amber-900 bg-amber-50/50 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-200"
                                                            >
                                                                {publishingId === cat.id ? (
                                                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Plus className="h-3 w-3 mr-1" />
                                                                )}
                                                                <span>Daftarkan ke Menu</span>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {cat.is_active ? (
                                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] font-semibold text-slate-400">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditCatModal(cat)}
                                                            title="Edit Kategori"
                                                            className="h-8 w-8 text-slate-500 hover:text-blue-600 rounded-lg"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => confirmDeleteCat(cat)}
                                                            title="Hapus Kategori"
                                                            className="h-8 w-8 text-slate-500 hover:text-rose-600 rounded-lg"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* --- MODAL DIALOG: TAMBAH / EDIT DOKUMEN SPMI --- */}
            <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
                <DialogContent className="max-w-xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                            {editingDoc ? 'Edit Dokumen Kebijakan SPMI' : 'Tambah Dokumen Kebijakan SPMI Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Isi informasi nomor SK, judul dokumen, kriteria SPMI, dan berkas/tautan Google Drive.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitDoc} className="space-y-4 pt-2">
                        {/* Kategori Kriteria */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Kategori Kriteria SPMI <span className="text-rose-500">*</span>
                            </Label>
                            <Select
                                value={docForm.data.spmi_category_id}
                                onValueChange={(val) => docForm.setData('spmi_category_id', val)}
                            >
                                <SelectTrigger className="h-9 rounded-xl text-xs">
                                    <SelectValue placeholder="Pilih Kategori Kriteria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {docForm.errors.spmi_category_id && (
                                <p className="text-[11px] text-rose-500 font-medium">{docForm.errors.spmi_category_id}</p>
                            )}
                        </div>

                        {/* Nomor Dokumen & Tahun */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold">Nomor Dokumen / SK</Label>
                                <Input
                                    placeholder="Contoh: 015/KEP/REK-UNIVRAB/I/2026"
                                    value={docForm.data.document_number}
                                    onChange={(e) => docForm.setData('document_number', e.target.value)}
                                    className="h-9 rounded-xl text-xs font-mono"
                                />
                                {docForm.errors.document_number && (
                                    <p className="text-[11px] text-rose-500 font-medium">{docForm.errors.document_number}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">
                                    Tahun <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    type="number"
                                    min="1990"
                                    max="2099"
                                    value={docForm.data.year}
                                    onChange={(e) => docForm.setData('year', e.target.value)}
                                    className="h-9 rounded-xl text-xs"
                                />
                                {docForm.errors.year && (
                                    <p className="text-[11px] text-rose-500 font-medium">{docForm.errors.year}</p>
                                )}
                            </div>
                        </div>

                        {/* Judul Dokumen */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Judul Lengkap Dokumen <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                placeholder="Contoh: Keputusan Rektor tentang Standar Kurikulum OBE dan Penilaian Pembelajaran"
                                rows={2}
                                value={docForm.data.title}
                                onChange={(e) => docForm.setData('title', e.target.value)}
                                className="rounded-xl text-xs"
                            />
                            {docForm.errors.title && (
                                <p className="text-[11px] text-rose-500 font-medium">{docForm.errors.title}</p>
                            )}
                        </div>

                        {/* Pilihan Sumber Dokumen: External Link (Google Drive) vs Local Upload */}
                        <div className="space-y-2 p-3 bg-slate-50 dark:bg-neutral-800/40 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                            <Label className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                Sumber Berkas Dokumen <span className="text-rose-500">*</span>
                            </Label>
                            <div className="flex gap-4 text-xs font-medium">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="source_type"
                                        checked={sourceType === 'external'}
                                        onChange={() => {
                                            setSourceType('external');
                                            docForm.setData('file', null);
                                        }}
                                        className="text-[#8B142C] focus:ring-[#8B142C]"
                                    />
                                    <span>Tautan Google Drive / Cloud (Direkomendasikan)</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="source_type"
                                        checked={sourceType === 'file'}
                                        onChange={() => {
                                            setSourceType('file');
                                            docForm.setData('external_url', '');
                                        }}
                                        className="text-[#8B142C] focus:ring-[#8B142C]"
                                    />
                                    <span>Unggah Berkas PDF Lokal</span>
                                </label>
                            </div>

                            {sourceType === 'external' ? (
                                <div className="pt-1.5">
                                    <Input
                                        placeholder="https://drive.google.com/file/d/.../view"
                                        value={docForm.data.external_url}
                                        onChange={(e) => docForm.setData('external_url', e.target.value)}
                                        className="h-9 rounded-xl text-xs"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Pastikan izin akses dokumen di Google Drive sudah disetel ke &quot;Anyone with the link can view&quot;.
                                    </p>
                                    {docForm.errors.external_url && (
                                        <p className="text-[11px] text-rose-500 font-medium mt-1">{docForm.errors.external_url}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="pt-1.5">
                                    <Input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if (file && file.size > 15 * 1024 * 1024) {
                                                toast.error(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 15 MB. Silakan gunakan opsi Tautan Google Drive.`);
                                                e.target.value = '';
                                                docForm.setData('file', null);
                                                return;
                                            }
                                            docForm.setData('file', file);
                                        }}
                                        className="h-9 rounded-xl text-xs"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Maksimal ukuran file PDF: 15 MB. Gunakan Google Drive untuk berkas yang lebih besar.
                                    </p>
                                    {docForm.errors.file && (
                                        <p className="text-[11px] text-rose-500 font-medium mt-1">{docForm.errors.file}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Keterangan Tambahan */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Keterangan / Ringkasan (Opsional)</Label>
                            <Textarea
                                placeholder="Deskripsi singkat isi kebijakan..."
                                rows={2}
                                value={docForm.data.description}
                                onChange={(e) => docForm.setData('description', e.target.value)}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        {/* Status Publik */}
                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="is_public"
                                checked={docForm.data.is_public}
                                onCheckedChange={(checked) => docForm.setData('is_public', !!checked)}
                            />
                            <Label htmlFor="is_public" className="text-xs font-medium cursor-pointer">
                                Tampilkan dokumen ini di portal publik SPMI
                            </Label>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDocDialogOpen(false)}
                                className="h-9 text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={docForm.processing}
                                className="h-9 text-xs bg-[#8B142C] hover:bg-[#721024] text-white font-bold"
                            >
                                {docForm.processing ? 'Menyimpan...' : 'Simpan Dokumen'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL DIALOG: TAMBAH / EDIT KATEGORI KRITERIA SPMI --- */}
            <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                            {editingCat ? 'Edit Kategori Kriteria SPMI' : 'Tambah Kategori Kriteria SPMI'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Kelola kategori kriteria yang akan ditampilkan di repositori dan sub-menu navigasi publik.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitCat} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Nama Kategori Kriteria <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                placeholder="Contoh: Visi, Misi, Tujuan dan Strategi"
                                value={catForm.data.name}
                                onChange={(e) => catForm.setData('name', e.target.value)}
                                className="h-9 rounded-xl text-xs"
                            />
                            {catForm.errors.name && (
                                <p className="text-[11px] text-rose-500 font-medium">{catForm.errors.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-xs font-semibold">Slug URL (Opsional)</Label>
                                <Input
                                    placeholder="Auto-generate jika kosong"
                                    value={catForm.data.slug}
                                    onChange={(e) => catForm.setData('slug', e.target.value)}
                                    className="h-9 rounded-xl text-xs font-mono"
                                />
                                {catForm.errors.slug && (
                                    <p className="text-[11px] text-rose-500 font-medium">{catForm.errors.slug}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Urutan</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={catForm.data.order}
                                    onChange={(e) => catForm.setData('order', e.target.value)}
                                    className="h-9 rounded-xl text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">Deskripsi Ruang Lingkup Kriteria</Label>
                            <Textarea
                                placeholder="Deskripsi singkat kriteria SPMI..."
                                rows={2}
                                value={catForm.data.description}
                                onChange={(e) => catForm.setData('description', e.target.value)}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <Checkbox
                                id="cat_is_active"
                                checked={catForm.data.is_active}
                                onCheckedChange={(checked) => catForm.setData('is_active', !!checked)}
                            />
                            <Label htmlFor="cat_is_active" className="text-xs font-medium cursor-pointer">
                                Status aktif (dapat diakses di publik)
                            </Label>
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCatDialogOpen(false)}
                                className="h-9 text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={catForm.processing}
                                className="h-9 text-xs bg-[#8B142C] hover:bg-[#721024] text-white font-bold"
                            >
                                {catForm.processing ? 'Menyimpan...' : 'Simpan Kategori'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- DELETE CONFIRMATION: DOKUMEN --- */}
            <Dialog open={isDeleteDocOpen} onOpenChange={setIsDeleteDocOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-center font-bold text-slate-900 dark:text-white">
                            Hapus Dokumen SPMI?
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-slate-500 dark:text-neutral-400">
                            Apakah Anda yakin ingin menghapus dokumen{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                &quot;{docToDelete?.title}&quot;
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDocOpen(false)}
                            className="h-9 text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleExecuteDeleteDoc}
                            className="h-9 text-xs font-bold"
                        >
                            Hapus Dokumen
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- DELETE CONFIRMATION: KATEGORI --- */}
            <Dialog open={isDeleteCatOpen} onOpenChange={setIsDeleteCatOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-center font-bold text-slate-900 dark:text-white">
                            Hapus Kategori Kriteria?
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-slate-500 dark:text-neutral-400">
                            {catToDelete && catToDelete.documents_count > 0 ? (
                                <div className="space-y-2 text-rose-600 dark:text-rose-400">
                                    <p className="font-semibold">
                                        Kategori ini tidak dapat dihapus!
                                    </p>
                                    <p className="text-slate-500 dark:text-neutral-400">
                                        Masih terdapat <strong>{catToDelete.documents_count} dokumen</strong> di dalam kategori &quot;{catToDelete.name}&quot;. Hapus atau pindahkan dokumen terlebih dahulu.
                                    </p>
                                </div>
                            ) : (
                                <span>
                                    Apakah Anda yakin ingin menghapus kategori{' '}
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        &quot;{catToDelete?.name}&quot;
                                    </span>
                                    ?
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-center pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteCatOpen(false)}
                            className="h-9 text-xs"
                        >
                            {catToDelete && catToDelete.documents_count > 0 ? 'Tutup' : 'Batal'}
                        </Button>
                        {catToDelete && catToDelete.documents_count === 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleExecuteDeleteCat}
                                className="h-9 text-xs font-bold"
                            >
                                Hapus Kategori
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

SpmiDocumentIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Dokumen SPMI', href: '/admin/spmi/documents' },
    ],
};
