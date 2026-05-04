import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus } from 'lucide-react';
import React from 'react';

export default function Index({ banners }: any) {
    const [editingBanner, setEditingBanner] = React.useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        _method: 'POST' as string,
        title: '',
        text: '',
        link: '',
        image: null as any,
        order: 0,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingBanner ? `/admin/banners/${editingBanner.id}` : '/admin/banners';

        if (editingBanner) {
            // We use POST with _method spoofing for file uploads in Laravel
            post(url, {
                forceFormData: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingBanner(null);
                    reset();
                },
            });
        } else {
            post(url, {
                forceFormData: true,
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const openEditDialog = (banner: any) => {
        setEditingBanner(banner);
        setData({
            _method: 'PUT',
            title: banner.title,
            text: banner.text || '',
            link: banner.link || '',
            image: null,
            order: banner.order,
            is_active: !!banner.is_active,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus banner ini?')) {
            destroy(`/admin/banners/${id}`);
        }
    };

    return (
        <>
            <Head title="Manajemen Banner" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Banner Hero</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingBanner(null);
                        reset();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-univrab-blue">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Banner
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Tambah Banner Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul Banner</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="text">Teks Deskripsi</Label>
                                <Input
                                    id="text"
                                    value={data.text}
                                    onChange={e => setData('text', e.target.value)}
                                />
                                {errors.text && <p className="text-red-500 text-xs">{errors.text}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">Link URL (Opsional)</Label>
                                <Input
                                    id="link"
                                    value={data.link}
                                    onChange={e => setData('link', e.target.value)}
                                    placeholder="https://example.com"
                                />
                                {errors.link && <p className="text-red-500 text-xs">{errors.link}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Gambar {editingBanner && '(Opsional)'}</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={e => setData('image', e.target.files?.[0])}
                                    />
                                    {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Urutan</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={data.order}
                                        onChange={e => setData('order', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(val: boolean) => setData('is_active', val)}
                                />
                                <Label htmlFor="is_active">Aktif</Label>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={processing} className="bg-univrab-blue">
                                    {editingBanner ? 'Perbarui' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow dark:bg-neutral-900 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banners.map((banner: any) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    <div className="h-12 w-20 bg-slate-100 rounded overflow-hidden">
                                        <img src={`/storage/${banner.image_path}`} alt="" className="h-full w-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{banner.title}</TableCell>
                                <TableCell>{banner.order}</TableCell>
                                <TableCell>
                                    <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                                        {banner.is_active ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(banner)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(banner.id)}>
                                            <Trash className="h-4 w-4" />
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
        { title: 'Manajemen Banner', href: '/admin/banners' },
    ],
};
