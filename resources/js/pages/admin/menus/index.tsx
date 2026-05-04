import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash, Plus } from 'lucide-react';
import React from 'react';

export default function Index({ menus }: any) {
    const [editingMenu, setEditingMenu] = React.useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        label: '',
        type: 'internal' as 'internal' | 'external',
        url: '',
        order: 0,
        parent_id: null as number | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMenu) {
            put(`/admin/menus/${editingMenu.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setEditingMenu(null);
                    reset();
                },
            });
        } else {
            post('/admin/menus', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const openEditDialog = (menu: any) => {
        setEditingMenu(menu);
        setData({
            label: menu.label,
            type: menu.type,
            url: menu.url,
            order: menu.order,
            parent_id: menu.parent_id,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
            destroy(`/admin/menus/${id}`);
        }
    };

    return (
        <>
            <Head title="Manajemen Menu" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Menu Navigasi</h1>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingMenu(null);
                        reset();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-univrab-blue">
                            <Plus className="mr-2 h-4 w-4" /> Tambah Menu
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Label Menu</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={e => setData('label', e.target.value)}
                                    placeholder="Contoh: Pengumuman"
                                />
                                {errors.label && <p className="text-red-500 text-xs">{errors.label}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipe</Label>
                                    <Select value={data.type} onValueChange={(val: any) => setData('type', val)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="internal">Internal</SelectItem>
                                            <SelectItem value="external">Eksternal</SelectItem>
                                            <SelectItem value="label">Label (Induk dari Sub-Menu)</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            
                            <div className="space-y-2">
                                <Label>Induk Menu (Opsional)</Label>
                                <Select value={data.parent_id?.toString() || "none"} onValueChange={(val: string) => setData('parent_id', val === "none" ? null : parseInt(val))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sebagai Menu Utama" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Tidak ada (Sebagai Menu Utama)</SelectItem>
                                        {menus.filter((m: any) => !editingMenu || m.id !== editingMenu.id).map((m: any) => (
                                            <React.Fragment key={m.id}>
                                                <SelectItem value={m.id.toString()} className="font-bold">{m.label}</SelectItem>
                                                {m.children?.filter((c: any) => !editingMenu || c.id !== editingMenu.id).map((child: any) => (
                                                    <SelectItem key={child.id} value={child.id.toString()} className="pl-6 text-slate-500">— {child.label}</SelectItem>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.type !== 'label' && (
                                <div className="space-y-2">
                                    <Label htmlFor="url">URL / Path</Label>
                                    <Input
                                        id="url"
                                        value={data.url}
                                        onChange={e => setData('url', e.target.value)}
                                        placeholder={data.type === 'internal' ? '/example' : 'https://example.com'}
                                    />
                                    {errors.url && <p className="text-red-500 text-xs">{errors.url}</p>}
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="submit" disabled={processing} className="bg-univrab-blue">
                                    {editingMenu ? 'Perbarui' : 'Simpan'}
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
                            <TableHead>Label</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Urutan</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menus.map((menu: any) => (
                            <React.Fragment key={menu.id}>
                                <TableRow>
                                    <TableCell className="font-bold text-univrab-blue">{menu.label}</TableCell>
                                    <TableCell>{menu.type}</TableCell>
                                    <TableCell>{menu.url}</TableCell>
                                    <TableCell>{menu.order}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(menu)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(menu.id)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {menu.children?.map((child: any) => (
                                    <React.Fragment key={child.id}>
                                        <TableRow className="bg-slate-50 dark:bg-neutral-800/50">
                                            <TableCell className="pl-8 font-medium">— {child.label}</TableCell>
                                            <TableCell>{child.type}</TableCell>
                                            <TableCell>{child.url}</TableCell>
                                            <TableCell>{child.order}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(child)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(child.id)}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {child.children?.map((subchild: any) => (
                                            <TableRow key={subchild.id} className="bg-slate-100 dark:bg-neutral-800/20">
                                                <TableCell className="pl-14 text-slate-500">―― {subchild.label}</TableCell>
                                                <TableCell>{subchild.type}</TableCell>
                                                <TableCell>{subchild.url}</TableCell>
                                                <TableCell>{subchild.order}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(subchild)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(subchild.id)}>
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
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
        { title: 'Manajemen Menu', href: '/admin/menus' },
    ],
};
