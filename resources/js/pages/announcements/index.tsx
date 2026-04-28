import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Index({ announcements, categories, filters }: any) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category: filters.category || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/announcements');
    };

    return (
        <PublicLayout>
            <Head title="Arsip Pengumuman" />

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
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Pencarian</h3>
                                <div className="relative">
                                    <Input
                                        placeholder="Cari pengumuman..."
                                        value={data.search}
                                        onChange={e => setData('search', e.target.value)}
                                        className="pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Kategori</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setData('category', ''); get('/announcements'); }}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${data.category === '' ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-univrab-blue'}`}
                                    >
                                        Semua
                                    </button>
                                    {categories.map((cat: any) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => { setData('category', cat.slug); get('/announcements'); }}
                                            className={`px-3 py-1 text-xs rounded-full border transition-all ${data.category === cat.slug ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:border-univrab-blue'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-univrab-blue">
                                Filter
                            </Button>
                        </form>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {announcements.data.map((announcement: any) => (
                                <Card key={announcement.id} className="overflow-hidden border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                                    <CardHeader className="p-0">
                                        <div className="aspect-video bg-slate-50 dark:bg-neutral-800">
                                            {announcement.thumbnail && (
                                                <img src={announcement.thumbnail} alt="" className="h-full w-full object-cover" />
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
                            <div className="mt-12 flex justify-center gap-2">
                                {announcements.links.map((link: any, i: number) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-4 py-2 text-sm rounded-md border ${link.active ? 'bg-univrab-blue text-white border-univrab-blue' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                    />
                                ))}
                            </div>
                        )}

                        {announcements.data.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-slate-500">Tidak ada pengumuman yang ditemukan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
