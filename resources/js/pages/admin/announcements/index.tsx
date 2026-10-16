import { Head, Link, useForm, router } from '@inertiajs/react';
import { Edit, Plus, Search, SlidersHorizontal, X, ChevronDown, Calendar, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import DeleteAnnouncementDialog from '@/components/delete-announcement-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { AnnouncementCategory, AnnouncementFilters, PaginatedAnnouncements } from '@/types/announcement';

type IndexProps = {
    announcements: PaginatedAnnouncements;
    filters: AnnouncementFilters;
    categories: AnnouncementCategory[];
};

const defaultFilters: AnnouncementFilters = {
    search: '',
    category_id: 'all',
    status: 'all',
    type: 'all',
    date_from: '',
    date_to: '',
};

export default function Index({ announcements, filters, categories }: IndexProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);

    const { data, setData, get } = useForm<AnnouncementFilters>({
        search: filters.search || '',
        category_id: filters.category_id || 'all',
        status: filters.status || 'all',
        type: filters.type || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const applyFilters = (e?: React.FormEvent) => {
        e?.preventDefault();
        get('/admin/announcements');
    };

    const resetFilters = () => {
        setData({ ...defaultFilters });
        router.get('/admin/announcements', {}, { preserveState: false });
    };

    const hasActiveFilters =
        (data.search && data.search !== '') ||
        (data.category_id && data.category_id !== 'all') ||
        (data.status && data.status !== 'all') ||
        (data.type && data.type !== 'all') ||
        (data.date_from && data.date_from !== '') ||
        (data.date_to && data.date_to !== '');

    const activeFilterCount = [
        data.search && data.search !== '' ? 1 : 0,
        data.category_id && data.category_id !== 'all' ? 1 : 0,
        data.status && data.status !== 'all' ? 1 : 0,
        data.type && data.type !== 'all' ? 1 : 0,
        data.date_from && data.date_from !== '' ? 1 : 0,
        data.date_to && data.date_to !== '' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Manajemen Pengumuman" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pengumuman</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola semua pengumuman, dokumentasi galeri, dan agenda event
                        </p>
                    </div>
                    <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl shadow-xs">
                        <Link href="/admin/announcements/create">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
                        </Link>
                    </Button>
                </div>

                <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden">
                    <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                                    <SlidersHorizontal className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                    Filter & Pencarian
                                    {activeFilterCount > 0 && (
                                        <Badge className="ml-1 h-5 min-w-5 px-1.5 text-xs bg-brand-700 text-white">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                                </Button>
                            </CollapsibleTrigger>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-red-600 text-xs">
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                        <CollapsibleContent>
                            <form onSubmit={applyFilters} className="p-4 border-b border-slate-100 dark:border-neutral-800 bg-muted/20 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari judul..."
                                            className="pl-9 h-10 rounded-xl"
                                            value={data.search}
                                            onChange={e => setData('search', e.target.value)}
                                        />
                                    </div>
                                    <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                        <SelectTrigger className="h-10 rounded-xl">
                                            <SelectValue placeholder="Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Kategori</SelectItem>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={data.status} onValueChange={val => setData('status', val)}>
                                        <SelectTrigger className="h-10 rounded-xl">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={data.type} onValueChange={val => setData('type', val)}>
                                        <SelectTrigger className="h-10 rounded-xl">
                                            <SelectValue placeholder="Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tipe</SelectItem>
                                            <SelectItem value="regular">Reguler</SelectItem>
                                            <SelectItem value="event">Event / Agenda</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="date"
                                        value={data.date_from}
                                        onChange={e => setData('date_from', e.target.value)}
                                        placeholder="Dari tanggal"
                                        className="h-10 rounded-xl"
                                    />
                                    <Input
                                        type="date"
                                        value={data.date_to}
                                        onChange={e => setData('date_to', e.target.value)}
                                        placeholder="Sampai tanggal"
                                        className="h-10 rounded-xl"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" size="sm" className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold">
                                        <Search className="h-3.5 w-3.5 mr-1.5" />
                                        Terapkan Filter
                                    </Button>
                                </div>
                            </form>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/70 dark:bg-neutral-900/70">
                                    <TableHead className="w-[70px]">Sampul</TableHead>
                                    <TableHead className="min-w-[280px]">Judul Pengumuman</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right w-[110px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <FileText className="h-8 w-8 opacity-40 text-brand-700" />
                                                <p className="text-sm font-semibold">Tidak ada pengumuman ditemukan</p>
                                                {hasActiveFilters && (
                                                    <Button variant="link" size="sm" onClick={resetFilters} className="text-brand-700">
                                                        Reset filter untuk melihat semua
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    announcements.data.map((announcement) => (
                                        <TableRow key={announcement.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-800/40 transition-colors">
                                            {/* Column: Thumbnail / Image Count */}
                                            <TableCell>
                                                <div className="relative h-11 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
                                                    {announcement.thumbnail ? (
                                                        <img
                                                            src={`/storage/${announcement.thumbnail}`}
                                                            alt={announcement.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-4 w-4 text-slate-400" />
                                                    )}
                                                    {announcement.images_count !== undefined && announcement.images_count > 1 && (
                                                        <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[8px] font-extrabold bg-black/75 text-white backdrop-blur-xs flex items-center gap-0.5">
                                                            <ImageIcon className="h-2 w-2" />
                                                            {announcement.images_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Column: Title & Author */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Link href={`/admin/announcements/${announcement.id}`} className="group">
                                                        <p className="font-semibold text-sm leading-snug line-clamp-2 text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                                            {announcement.title}
                                                        </p>
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {announcement.author && (
                                                            <span>oleh {announcement.author.name}</span>
                                                        )}
                                                        {announcement.attachments_count !== undefined && announcement.attachments_count > 0 && (
                                                            <>
                                                                <span>&middot;</span>
                                                                <span className="text-[11px] font-medium text-slate-500">
                                                                    📎 {announcement.attachments_count} lampiran
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Column: Category */}
                                            <TableCell>
                                                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                                                    {announcement.category?.name || '-'}
                                                </span>
                                            </TableCell>

                                            {/* Column: Type */}
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        announcement.type === 'event'
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                                                            : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                                                    }
                                                >
                                                    {announcement.type === 'event' ? 'Agenda / Event' : 'Reguler'}
                                                </Badge>
                                            </TableCell>

                                            {/* Column: Status */}
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        announcement.status === 'published'
                                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold'
                                                            : 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 font-semibold'
                                                    }
                                                >
                                                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                                                        announcement.status === 'published'
                                                            ? 'bg-emerald-500'
                                                            : 'bg-slate-400'
                                                    }`} />
                                                    {announcement.status === 'published' ? 'Published' : 'Draft'}
                                                </Badge>
                                            </TableCell>

                                            {/* Column: Date */}
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 cursor-help">
                                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                                {formatDate(announcement.created_at)}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Dibuat: {new Date(announcement.created_at).toLocaleString('id-ID')}
                                                            {announcement.published_at && (
                                                                <> &middot; Dipublikasi: {new Date(announcement.published_at).toLocaleString('id-ID')}</>
                                                            )}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>

                                            {/* Column: Actions */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Quick View on Public Site */}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-brand-700">
                                                                    <a href={`/announcements/${announcement.slug}`} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                                    </a>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Lihat di Web Publik</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:text-brand-700">
                                                                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                                                        <Edit className="h-3.5 w-3.5" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit Pengumuman</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <DeleteAnnouncementDialog announcement={announcement} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>Hapus</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {announcements.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/30 dark:bg-neutral-900/30">
                            <p className="text-xs text-muted-foreground">
                                Menampilkan {announcements.from}–{announcements.to} dari {announcements.total} pengumuman
                            </p>
                            <div className="flex items-center gap-1">
                                {announcements.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`inline-flex items-center justify-center h-8 min-w-8 px-3 text-xs font-semibold rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-brand-700 text-white'
                                                    : 'bg-white dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:bg-slate-50'
                                            }`}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="inline-flex items-center justify-center h-8 min-w-8 px-3 text-xs rounded-lg text-muted-foreground/50 cursor-not-allowed"
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengumuman', href: '/admin/announcements' },
    ],
};
