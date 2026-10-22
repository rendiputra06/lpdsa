import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileCheck,
    FileText,
    Info,
    RotateCcw,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import EmptyState from '@/components/public/empty-state';
import PageHero from '@/components/public/page-hero';
import { Badge } from '@/components/ui/badge';
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

interface SpmiCategory {
    id: number;
    name: string;
    slug: string;
    cycle_stage: string;
    sub_stage: string;
    description: string | null;
    order: number;
    documents_count?: number;
    public_url?: string;
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
    category?: SpmiCategory;
}

interface Props {
    mode: 'all' | 'single';
    categories?: SpmiCategory[];
    selectedCategory?: SpmiCategory | null;
    documents: SpmiDocument[];
    currentSort?: string;
    currentSearch?: string;
}

export default function KebijakanSpmiPage({
    mode = 'all',
    categories = [],
    selectedCategory = null,
    documents = [],
    currentSort = 'newest',
    currentSearch = '',
}: Props) {
    const [search, setSearch] = useState(currentSearch);
    const [sort, setSort] = useState(currentSort);

    // Filter handling
    const applyFilter = (params: { sort?: string; search?: string; criteria?: string }) => {
        const query: Record<string, string> = {};
        const s = params.search !== undefined ? params.search : search;
        const o = params.sort !== undefined ? params.sort : sort;

        if (s.trim()) query.search = s.trim();
        if (o && o !== 'newest') query.sort = o;

        if (mode === 'all') {
            const c = params.criteria !== undefined ? params.criteria : selectedCategory?.slug;
            if (c) query.criteria = c;
            router.get('/spmi/penetapan/kebijakan', query, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            router.get(`/spmi/penetapan/kebijakan/${selectedCategory?.slug}`, query, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        applyFilter({ sort: newSort });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search });
    };

    const handleResetSearch = () => {
        setSearch('');
        applyFilter({ search: '' });
    };

    // Breadcrumbs
    const breadcrumbs = useMemo(() => {
        if (mode === 'single' && selectedCategory) {
            return [
                { label: 'SPMI' },
                { label: 'Penetapan' },
                { label: 'Kebijakan SPMI', href: '/spmi/penetapan/kebijakan' },
                { label: selectedCategory.name },
            ];
        }

        return [
            { label: 'SPMI' },
            { label: 'Penetapan' },
            { label: 'Kebijakan SPMI' },
        ];
    }, [mode, selectedCategory]);

    const pageTitle =
        mode === 'single' && selectedCategory
            ? `Kebijakan SPMI: ${selectedCategory.name}`
            : 'Kebijakan SPMI';

    const pageDescription =
        mode === 'single' && selectedCategory?.description
            ? selectedCategory.description
            : 'Kumpulan dokumen resmi mengenai kebijakan dan standar Sistem Penjaminan Mutu Internal (SPMI) Universitas Abdurrab.';

    return (
        <div className="min-h-screen bg-slate-50/60 dark:bg-neutral-950">
            <Head title={`${pageTitle} - LPDSA Universitas Abdurrab`} />

            {/* Hero Banner Section */}
            <PageHero
                breadcrumbs={breadcrumbs}
                eyebrow={mode === 'single' ? 'Penetapan SPMI Kriteria' : 'Penetapan Siklus PPEPP'}
                title={pageTitle}
            >
                <p className="mt-4 text-slate-600 dark:text-neutral-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                    {pageDescription}
                </p>

                {mode === 'single' && selectedCategory && (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Badge className="bg-brand-50 text-[#8B142C] dark:bg-brand-950/70 dark:text-gold-400 border-brand-200/60 dark:border-brand-900/60 font-semibold px-3 py-1 text-xs rounded-xl">
                            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                            <span>Kriteria Khusus</span>
                        </Badge>
                        <Link
                            href="/spmi/penetapan/kebijakan"
                            className="inline-flex items-center text-xs font-semibold text-[#8B142C] dark:text-gold-400 hover:underline gap-1"
                        >
                            <span>Lihat Semua Kriteria</span>
                            <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                )}
            </PageHero>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* MODE 1: HORIZONTAL TABS FILTER (Hanya tampil pada Mode 'all') */}
                {mode === 'all' && categories.length > 0 && (
                    <div className="mb-8">
                        <div className="border-b border-slate-200 dark:border-neutral-800">
                            <nav
                                className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
                                aria-label="Filter Kriteria SPMI"
                            >
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory?.id === cat.id;

                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => applyFilter({ criteria: cat.slug })}
                                            className={`group relative whitespace-nowrap py-3.5 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 shrink-0 cursor-pointer rounded-t-xl ${
                                                isSelected
                                                    ? 'border-[#8B142C] dark:border-gold-400 text-[#8B142C] dark:text-gold-400 bg-brand-50/40 dark:bg-brand-950/20'
                                                    : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{cat.name}</span>
                                                {cat.documents_count !== undefined && cat.documents_count > 0 && (
                                                    <span
                                                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                                                            isSelected
                                                                ? 'bg-[#8B142C] text-white dark:bg-gold-400 dark:text-neutral-950'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 group-hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {cat.documents_count}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Toolbar: Pencarian & Sorting */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari judul dokumen atau nomor SK..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-9 h-11 rounded-2xl text-xs sm:text-sm bg-white dark:bg-neutral-900 border-slate-200/90 dark:border-neutral-800 shadow-xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </form>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center justify-end gap-3">
                        <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium whitespace-nowrap hidden sm:inline">
                            Urutkan:
                        </span>
                        <Select value={sort} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[170px] h-11 rounded-2xl text-xs sm:text-sm bg-white dark:bg-neutral-900 border-slate-200/90 dark:border-neutral-800 shadow-xs">
                                <ArrowUpDown className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                                <SelectValue placeholder="Urutan Tahun" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="newest">Tahun Terbaru</SelectItem>
                                <SelectItem value="oldest">Tahun Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Active Category Description Notice (if any) */}
                {selectedCategory?.description && mode === 'all' && (
                    <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs flex items-start gap-3">
                        <Info className="h-5 w-5 text-[#8B142C] dark:text-gold-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                            <span className="font-bold text-slate-900 dark:text-white mr-1">
                                {selectedCategory.name}:
                            </span>
                            {selectedCategory.description}
                        </div>
                    </div>
                )}

                {/* Table of SPMI Documents */}
                <Card className="rounded-3xl border-slate-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table className="w-full min-w-[700px]">
                                <TableHeader className="bg-slate-50/90 dark:bg-neutral-800/60">
                                    <TableRow className="border-b border-slate-200/80 dark:border-neutral-800">
                                        <TableHead className="w-16 text-center font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 py-4">
                                            No.
                                        </TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 py-4 min-w-[180px]">
                                            Nomor Dokumen
                                        </TableHead>
                                        <TableHead className="w-24 text-center font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 py-4">
                                            Tahun
                                        </TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 py-4 min-w-[320px]">
                                            Dokumen
                                        </TableHead>
                                        <TableHead className="w-44 text-center font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-neutral-400 py-4">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100 dark:divide-neutral-800/80">
                                    {documents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-12">
                                                <EmptyState
                                                    title="Dokumen Kebijakan Belum Tersedia"
                                                    description={
                                                        search
                                                            ? `Tidak ada dokumen yang cocok dengan kata kunci "${search}".`
                                                            : 'Belum ada dokumen kebijakan yang diunggah untuk kriteria ini.'
                                                    }
                                                    onReset={search ? handleResetSearch : undefined}
                                                    resetLabel="Hapus Kata Kunci"
                                                    icon={<FileCheck className="h-8 w-8 text-slate-400" />}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        documents.map((doc, idx) => {
                                            const hasFileOrLink = Boolean(doc.effective_url || doc.external_url);
                                            const shareDestination = doc.share_url || `/spmi/dokumen/share/${doc.slug || doc.id}`;

                                            return (
                                                <TableRow
                                                    key={doc.id}
                                                    className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/50 transition-colors"
                                                >
                                                    <TableCell className="text-center font-medium text-xs text-slate-500 dark:text-neutral-400 py-4">
                                                        {idx + 1}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-slate-700 dark:text-neutral-300 py-4">
                                                        {doc.document_number ? (
                                                            <span className="bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-[11px] font-semibold">
                                                                {doc.document_number}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center py-4">
                                                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200">
                                                            {doc.year}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div>
                                                            <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
                                                                {doc.title}
                                                            </p>
                                                            {doc.description && (
                                                                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2">
                                                                    {doc.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center py-4">
                                                        {hasFileOrLink ? (
                                                            <a
                                                                href={shareDestination}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#8B142C] hover:bg-[#721024] shadow-xs hover:shadow-md transition-all group"
                                                            >
                                                                <span>Buka Tautan</span>
                                                                <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic">
                                                                Berkas belum tersedia
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Insight Box */}
                <div className="mt-8 p-6 rounded-3xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs sm:text-sm text-slate-700 dark:text-neutral-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-[#8B142C] text-white flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                                Sistem Penjaminan Mutu Internal (SPMI) Universitas Abdurrab
                            </p>
                            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                                Keterbukaan informasi kebijakan mutu sesuai siklus PPEPP dan instrumen akreditasi nasional BAN-PT / LAM.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/akreditasi"
                        className="inline-flex items-center gap-1.5 font-bold text-xs text-[#8B142C] dark:text-gold-400 hover:underline shrink-0"
                    >
                        <span>Lihat Data Akreditasi Program Studi</span>
                        <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
