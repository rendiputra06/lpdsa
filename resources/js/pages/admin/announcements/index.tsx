import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import DeleteAnnouncementDialog from '@/components/delete-announcement-dialog';
import { Edit, Plus, Search, SlidersHorizontal, X, ChevronDown, Calendar, FileText } from 'lucide-react';
import type { AnnouncementDetail, AnnouncementCategory, AnnouncementFilters, PaginatedAnnouncements } from '@/types/announcement';

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
                        <h1 className="text-2xl font-bold tracking-tight">Pengumuman</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Kelola semua pengumuman dan event
                        </p>
                    </div>
                    <Button asChild className="bg-univrab-blue">
                        <Link href="/admin/announcements/create">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
                        </Link>
                    </Button>
                </div>

                <Card>
                    <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                        <div className="flex items-center justify-between p-4 border-b">
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
                                            {activeFilterCount}
                                        </Badge>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                                </Button>
                            </CollapsibleTrigger>
                            {hasActiveFilters && (
                                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                                    <X className="h-4 w-4 mr-1" />
                                    Reset
                                </Button>
                            )}
                        </div>
                        <CollapsibleContent>
                            <form onSubmit={applyFilters} className="p-4 border-b bg-muted/30 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari judul..."
                                            className="pl-9"
                                            value={data.search}
                                            onChange={e => setData('search', e.target.value)}
                                        />
                                    </div>
                                    <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                        <SelectTrigger>
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={data.type} onValueChange={val => setData('type', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tipe</SelectItem>
                                            <SelectItem value="regular">Reguler</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="date"
                                        value={data.date_from}
                                        onChange={e => setData('date_from', e.target.value)}
                                        placeholder="Dari tanggal"
                                    />
                                    <Input
                                        type="date"
                                        value={data.date_to}
                                        onChange={e => setData('date_to', e.target.value)}
                                        placeholder="Sampai tanggal"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" size="sm" className="bg-univrab-blue">
                                        <Search className="h-4 w-4 mr-2" />
                                        Terapkan Filter
                                    </Button>
                                </div>
                            </form>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Judul</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {announcements.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <FileText className="h-8 w-8 opacity-40" />
                                                <p className="text-sm">Tidak ada pengumuman ditemukan</p>
                                                {hasActiveFilters && (
                                                    <Button variant="link" size="sm" onClick={resetFilters}>
                                                        Reset filter untuk melihat semua
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    announcements.data.map((announcement) => (
                                        <TableRow key={announcement.id}>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Link href={`/admin/announcements/${announcement.id}`}>
                                                        <p className="font-medium leading-tight line-clamp-1 hover:text-blue-600 cursor-pointer">{announcement.title}</p>
                                                    </Link>
                                                    {announcement.author && (
                                                        <p className="text-xs text-muted-foreground">
                                                            oleh {announcement.author.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{announcement.category?.name || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={announcement.type === 'event' ? 'default' : 'secondary'}
                                                    className={announcement.type === 'event' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                                                >
                                                    {announcement.type === 'event' ? 'Event' : 'Reguler'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        announcement.status === 'published'
                                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                                                            : 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400'
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
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                                <Calendar className="h-3.5 w-3.5" />
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
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" asChild>
                                                                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit</TooltipContent>
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {announcements.from}–{announcements.to} dari {announcements.total} pengumuman
                            </p>
                            <div className="flex items-center gap-1">
                                {announcements.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`inline-flex items-center justify-center h-8 min-w-8 px-3 text-sm rounded-md transition-colors ${
                                                link.active
                                                    ? 'bg-univrab-blue text-white'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                            }`}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="inline-flex items-center justify-center h-8 min-w-8 px-3 text-sm rounded-md text-muted-foreground/50 cursor-not-allowed"
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
