import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, ExternalLink } from 'lucide-react';

export default function Index({ pages }: any) {
    return (
        <>
            <Head title="Manajemen Halaman Statis" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Halaman Statis</h1>
                <p className="text-slate-500">Kelola konten halaman seperti Tentang LPDSA dan Kontak.</p>
            </div>

            <div className="bg-white rounded-lg shadow dark:bg-neutral-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Terakhir Diperbarui</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.map((page: any) => (
                            <TableRow key={page.id}>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell><code>/{page.slug}</code></TableCell>
                                <TableCell>{new Date(page.updated_at).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild title="Lihat di Web">
                                            <a href={`/${page.slug}`} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild title="Edit Konten">
                                            <Link href={`/admin/static-pages/${page.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
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
