import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, Upload, X, ImageIcon, Eye, GripVertical } from 'lucide-react';
import React, { useRef, useState } from 'react';

export default function Index({ banners }: any) {
    const [editingBanner, setEditingBanner] = React.useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        _method: 'POST' as string,
        title: '',
        text: '',
        link: '',
        image: null as any,
        order: 0,
        is_active: true,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getImagePreview = () => {
        if (previewImage) return previewImage;
        if (editingBanner?.image_path) return `/storage/${editingBanner.image_path}`;
        return null;
    };

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
        setPreviewImage(null);
        setIsDialogOpen(true);
    };

    const openCreateDialog = () => {
        setEditingBanner(null);
        reset();
        setPreviewImage(null);
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
                        <Button className="bg-univrab-blue" onClick={openCreateDialog}>
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
                            {/* Enhanced Image Upload */}
                            <div className="space-y-2">
                                <Label>Gambar Banner {editingBanner && '(Opsional)'}</Label>
                                <Card className="border-dashed border-2 hover:border-univrab-blue/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="relative group">
                                            {getImagePreview() ? (
                                                <div className="relative">
                                                    <img
                                                        src={getImagePreview() || ''}
                                                        alt="Banner Preview"
                                                        className="w-full h-40 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-500">Klik untuk upload gambar</span>
                                                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max 2MB)</span>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />

                                        <div className="flex justify-center mt-3 gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <Upload className="h-4 w-4 mr-1" />
                                                {getImagePreview() ? 'Ganti Gambar' : 'Pilih Gambar'}
                                            </Button>
                                        </div>

                                        {editingBanner?.image_path && !previewImage && (
                                            <p className="text-xs text-muted-foreground text-center mt-2">
                                                📁 File saat ini: {editingBanner.image_path}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                                {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Urutan Tampil</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={e => setData('order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Semakin kecil angka, semakin awal ditampilkan</p>
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

            {/* Modern Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner: any, index: number) => (
                    <Card key={banner.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${!banner.is_active ? 'opacity-75' : ''}`}>
                        {/* Image Preview */}
                        <div className="relative h-40 bg-slate-100 overflow-hidden group">
                            {banner.image_path ? (
                                <img
                                    src={`/storage/${banner.image_path}`}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    <ImageIcon className="h-16 w-16" />
                                </div>
                            )}

                            {/* Overlay with Order Number */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <div className="bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                    <GripVertical className="h-3 w-3" />
                                    Urutan: {banner.order}
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <Badge variant={banner.is_active ? 'default' : 'secondary'} className={banner.is_active ? 'bg-green-500' : ''}>
                                    {banner.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>

                            {/* View Button on Hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => window.open(`/storage/${banner.image_path}`, '_blank')}
                                >
                                    <Eye className="h-4 w-4" /> Lihat Gambar
                                </Button>
                            </div>
                        </div>

                        <CardContent className="p-4">
                            {/* Title & Text */}
                            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{banner.title}</h3>
                            {banner.text && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{banner.text}</p>
                            )}

                            {/* Link Info */}
                            {banner.link && (
                                <p className="text-xs text-blue-500 mb-3 truncate">
                                    🔗 {banner.link}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openEditDialog(banner)}
                                >
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(banner.id)}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {banners.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-1">Belum ada banner</h3>
                    <p className="text-slate-500 mb-4">Tambahkan banner pertama untuk ditampilkan di halaman utama</p>
                    <Button className="bg-univrab-blue" onClick={openCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Banner
                    </Button>
                </div>
            )}
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Banner', href: '/admin/banners' },
    ],
};
