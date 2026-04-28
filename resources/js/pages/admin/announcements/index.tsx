import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Pengumuman', href: '/admin/announcements' },
];

export default function Index({ announcements, filters }: any) {
    const { data, setData, get, delete: destroy } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/announcements');
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            destroy(`/admin/announcements/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pengumuman" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Pengumuman</h1>
                <Button asChild className="bg-univrab-blue">
                    <Link href="/admin/announcements/create">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow dark:bg-neutral-900">
                <div className="p-4 border-b dark:border-neutral-800">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari judul..."
                                className="pl-10"
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">Cari</Button>
                    </form>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Judul</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.data.map((announcement: any) => (
                            <TableRow key={announcement.id}>
                                <TableCell className="font-medium">{announcement.title}</TableCell>
                                <TableCell>{announcement.category.name}</TableCell>
                                <TableCell>
                                    <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                                        {announcement.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(announcement.id)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination placeholder */}
                <div className="p-4 border-t dark:border-neutral-800 flex justify-center gap-2">
                     {announcements.links.map((link: any, i: number) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 text-xs rounded border ${link.active ? 'bg-univrab-blue text-white' : 'bg-white text-slate-600'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
