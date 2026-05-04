import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, ExternalLink, FileText, Layout, Search, Plus, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Index({ pages }: any) {
    const [search, setSearch] = useState('');

    const filteredPages = pages.filter((page: any) => 
        page.title.toLowerCase().includes(search.toLowerCase()) || 
        page.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title="Manajemen Halaman Statis" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Halaman Statis</h1>
                    <p className="text-muted-foreground mt-1">Kelola konten halaman informasi LPDSA.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari halaman..." 
                            className="pl-9 bg-white dark:bg-neutral-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button asChild className="bg-univrab-blue">
                        <Link href="/admin/static-pages/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Halaman
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-neutral-800/50">
                        <TableRow>
                            <TableHead className="w-[40%]">Halaman</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Terakhir Diperbarui</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPages.length > 0 ? filteredPages.map((page: any) => (
                            <TableRow key={page.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-lg bg-univrab-blue/10 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-univrab-blue" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{page.title}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {page.meta_description || 'Tidak ada deskripsi meta'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-neutral-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-700">
                                        /{page.slug}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {new Date(page.updated_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" asChild title="Lihat di Web" className="h-8 w-8">
                                            <a href={`/${page.slug}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild title="Edit Konten" className="h-8 w-8 text-univrab-blue hover:text-univrab-blue hover:bg-univrab-blue/10">
                                            <Link href={`/admin/static-pages/${page.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            title="Hapus Halaman" 
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                if (confirm('Apakah Anda yakin ingin menghapus halaman ini?')) {
                                                    router.delete(`/admin/static-pages/${page.id}`);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    Tidak ada halaman yang ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman Statis', href: '/admin/static-pages' },
    ],
};
