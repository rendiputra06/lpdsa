import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, FileText, FilterX, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export default function Index({ announcements, categories, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/announcements', { search, category }, { preserveState: true });
    };

    const handleCategoryClick = (slug: string) => {
        setCategory(slug);
        // Fix: Don't send empty category parameter to avoid backend filter issue
        const params: any = { search };
        if (slug) {
            params.category = slug;
        }
        router.get('/announcements', params, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearch('');
        setCategory('');
        router.get('/announcements', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Arsip Pengumuman">
                <meta name="description" content="Arsip pengumuman dan informasi terkini dari LPDSA Universitas Abdurrab. Temukan berita akademik, event, dan pengumuman penting lainnya." />
                <meta property="og:title" content="Arsip Pengumuman - LPDSA Universitas Abdurrab" />
                <meta property="og:description" content="Arsip pengumuman dan informasi terkini dari LPDSA Universitas Abdurrab." />
                <meta property="og:type" content="website" />
            </Head>

            <div className="bg-slate-100 py-12 dark:bg-neutral-900/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Arsip Pengumuman</h1>
                    <p className="mt-2 text-slate-600 dark:text-neutral-400">Cari dan filter informasi yang Anda butuhkan.</p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <form onSubmit={handleSearch} className="space-y-6">
                            {/* Search */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Pencarian</h3>
                                <div className="relative">
                                    <Input
                                        placeholder="Cari pengumuman..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Urutan</h3>
                                <Select defaultValue="latest">
                                    <SelectTrigger className="w-full">
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Pilih urutan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Terbaru</SelectItem>
                                        <SelectItem value="oldest">Terlama</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Kategori</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryClick('')}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${category === '' ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-univrab-blue'}`}
                                    >
                                        Semua
                                    </button>
                                    {categories.map((cat: any) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-all ${category === cat.slug ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-univrab-blue'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button type="submit" className="w-full bg-univrab-blue">
                                    <Search className="h-4 w-4 mr-2" /> Terapkan Filter
                                </Button>
                                {(search || category) && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={handleResetFilters}
                                    >
                                        <FilterX className="h-4 w-4 mr-2" /> Reset Filter
                                    </Button>
                                )}
                            </div>
                        </form>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {announcements.data.map((announcement: any) => (
                                <Card key={announcement.id} className="overflow-hidden border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video bg-slate-50 dark:bg-neutral-800 overflow-hidden">
                                            {announcement.thumbnail ? (
                                                <img 
                                                    src={`/storage/${announcement.thumbnail}`} 
                                                    alt={announcement.title}
                                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-gradient-to-br from-univrab-blue/10 via-slate-100 to-univrab-gold/10 dark:from-univrab-blue/20 dark:via-neutral-800 dark:to-univrab-gold/20">
                                                    <div className="text-center">
                                                        <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                                        <span className="text-xs text-slate-400 dark:text-slate-500">LPDSA</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5">
                                        <Badge variant="secondary" className="mb-2">{announcement.category.name}</Badge>
                                        <CardTitle className="line-clamp-2 text-lg mb-2">
                                            <Link href={`/announcements/${announcement.slug}`} className="hover:text-univrab-blue dark:hover:text-univrab-gold">
                                                {announcement.title}
                                            </Link>
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(announcement.published_at).toLocaleDateString('id-ID')}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {announcements.links.length > 3 && (
                            <div className="mt-12 flex justify-center gap-2 flex-wrap">
                                {announcements.links.map((link: any, i: number) => {
                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={i}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-4 py-2 text-sm rounded-md border bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 text-sm rounded-md border ${link.active ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Enhanced Empty State */}
                        {announcements.data.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-neutral-700">
                                <div className="bg-white dark:bg-neutral-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Search className="h-10 w-10 text-slate-300 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                    Tidak ada pengumuman ditemukan
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                    {search || category 
                                        ? 'Coba ubah kata kunci pencarian atau pilih kategori lain.'
                                        : 'Belum ada pengumuman yang dipublikasikan saat ini.'}
                                </p>
                                {(search || category) && (
                                    <Button 
                                        onClick={handleResetFilters}
                                        className="bg-univrab-blue hover:bg-blue-700"
                                    >
                                        <FilterX className="h-4 w-4 mr-2" /> Reset Filter
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
