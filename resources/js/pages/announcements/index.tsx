import { Head, Link, router } from '@inertiajs/react';
import { Search, FilterX, ArrowUpDown, LayoutGrid, ListFilter } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AnnouncementCard from '@/components/public/announcement-card';
import EmptyState from '@/components/public/empty-state';
import PageHero from '@/components/public/page-hero';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IndexProps {
    announcements: any;
    categories: any[];
    filters: {
        category?: string;
        search?: string;
        sort?: string;
    };
}

export default function Index({ announcements, categories = [], filters = {} }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [sort, setSort] = useState(filters.sort || 'latest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const applyFilters = useCallback(
        (newParams: { search?: string; category?: string; sort?: string }) => {
            const params: Record<string, string> = {};

            if (newParams.search) {
                params.search = newParams.search;
            }

            if (newParams.category) {
                params.category = newParams.category;
            }

            if (newParams.sort && newParams.sort !== 'latest') {
                params.sort = newParams.sort;
            }

            router.get('/announcements', params, {
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
                applyFilters({ search, category, sort });
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, category, sort, filters.search, applyFilters]);

    const handleCategoryClick = (catSlug: string) => {
        const nextCategory = category === catSlug ? '' : catSlug;
        setCategory(nextCategory);
        applyFilters({ search, category: nextCategory, sort });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        applyFilters({ search, category, sort: newSort });
    };

    const handleResetFilters = () => {
        setSearch('');
        setCategory('');
        setSort('latest');
        router.get('/announcements', {}, { preserveState: true });
    };

    const hasActiveFilters = Boolean(search || category || (sort && sort !== 'latest'));

    return (
        <>
            <Head title="Arsip Pengumuman & Berita">
                <meta
                    name="description"
                    content="Arsip pengumuman, surat edaran, dan informasi kegiatan LPDSA Universitas Abdurrab. Temukan berita akademik, penjaminan mutu, dan akreditasi."
                />
            </Head>

            {/* Page Hero */}
            <PageHero
                breadcrumbs={[{ label: 'Arsip Pengumuman' }]}
                eyebrow="PUSAT INFORMASI PUBLIK"
                title="Arsip Pengumuman & Berita"
            >
                <p className="mt-3 text-base text-slate-600 dark:text-neutral-400 max-w-2xl">
                    Temukan rilis surat edaran resmi, jadwal kegiatan akademik, dan berita terkini dari Lembaga Pangkalan Data, SPMI, dan Akreditasi.
                </p>
            </PageHero>

            {/* Filter & Toolbar Area */}
            <div className="bg-slate-50 dark:bg-neutral-950 py-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filter Card / Toolbar */}
                    <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm mb-10">
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-lg">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-neutral-500" />
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul pengumuman, kata kunci, atau edaran..."
                                    className="pl-10 pr-4 py-2.5 h-11 rounded-full bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-sm focus-visible:ring-brand-700"
                                />
                            </div>

                            {/* Sort & View Mode Switch */}
                            <div className="flex items-center gap-3 shrink-0 flex-wrap">
                                <div className="w-44">
                                    <Select value={sort} onValueChange={handleSortChange}>
                                        <SelectTrigger className="h-11 rounded-full bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-xs font-semibold">
                                            <ArrowUpDown className="h-3.5 w-3.5 mr-1 text-slate-500" />
                                            <SelectValue placeholder="Urutan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Terbaru</SelectItem>
                                            <SelectItem value="oldest">Terlama</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* View Switch */}
                                <div className="hidden sm:flex items-center p-1 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        aria-label="Tampilan Grid"
                                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                                            viewMode === 'grid'
                                                ? 'bg-white dark:bg-neutral-900 text-brand-700 dark:text-gold-400 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400'
                                        }`}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        aria-label="Tampilan List"
                                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                                            viewMode === 'list'
                                                ? 'bg-white dark:bg-neutral-900 text-brand-700 dark:text-gold-400 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-800 dark:text-neutral-400'
                                        }`}
                                    >
                                        <ListFilter className="h-4 w-4" />
                                    </button>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="h-11 px-4 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FilterX className="h-3.5 w-3.5" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Chips Bar */}
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 shrink-0 mr-1">
                                Kategori:
                            </span>

                            <button
                                type="button"
                                onClick={() => handleCategoryClick('')}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    category === ''
                                        ? 'bg-brand-700 text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                                }`}
                            >
                                Semua Kategori
                            </button>

                            {categories.map((cat: any) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                        category === cat.slug
                                            ? 'bg-brand-700 text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Announcement Cards List / Grid */}
                    {announcements.data.length > 0 ? (
                        <>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
                                        : 'flex flex-col gap-4 max-w-4xl mx-auto'
                                }
                            >
                                {announcements.data.map((item: any) => (
                                    <AnnouncementCard
                                        key={item.id}
                                        announcement={item}
                                        variant={viewMode === 'grid' ? 'grid' : 'horizontal'}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {announcements.links && announcements.links.length > 3 && (
                                <div className="mt-14 flex justify-center items-center gap-2 flex-wrap">
                                    {announcements.links.map((link: any, i: number) => {
                                        if (link.url === null) {
                                            return (
                                                <span
                                                    key={i}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className="px-4 py-2 text-xs font-semibold rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-600 border border-slate-200 dark:border-neutral-800 cursor-not-allowed"
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                                                    link.active
                                                        ? 'bg-brand-700 text-white shadow-md'
                                                        : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 hover:border-brand-700 hover:text-brand-700'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <EmptyState
                            title="Tidak ada pengumuman ditemukan"
                            description={
                                hasActiveFilters
                                    ? 'Coba sesuaikan kata kunci pencarian Anda atau pilih kategori pengumuman lainnya.'
                                    : 'Belum ada pengumuman yang dipublikasikan saat ini.'
                            }
                            onReset={hasActiveFilters ? handleResetFilters : undefined}
                            resetLabel="Reset Semua Filter"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
