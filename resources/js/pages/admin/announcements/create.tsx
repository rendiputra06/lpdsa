import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Manajemen Pengumuman', href: '/admin/announcements' },
    { title: 'Tambah Pengumuman', href: '/admin/announcements/create' },
];

export default function Create({ categories }: any) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        content: '',
        status: 'draft',
        type: 'regular',
        published_at: '',
        thumbnail: null as any,
        event_detail: {
            start_at: '',
            end_at: '',
            location: '',
            speaker: '',
            quota: '',
            registration_link: '',
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengumuman" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tambah Pengumuman Baru</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/announcements">Batal</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="title">Judul Pengumuman</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Masukkan judul..."
                                />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Kategori</Label>
                                    <Select onValueChange={val => setData('category_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label>Tipe</Label>
                                    <Select defaultValue={data.type} onValueChange={val => setData('type', val as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="regular">Reguler</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="content">Konten (Markdown/HTML Support)</Label>
                                <textarea
                                    id="content"
                                    rows={10}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    placeholder="Tulis isi pengumuman di sini..."
                                />
                                {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Status</Label>
                                    <Select defaultValue={data.status} onValueChange={val => setData('status', val as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        onChange={e => setData('thumbnail', e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {data.type === 'event' && (
                        <Card className="border-univrab-gold/50 bg-yellow-50/10">
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-semibold text-lg text-univrab-gold">Detail Event</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Mulai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={data.event_detail.start_at}
                                            onChange={e => setData('event_detail', { ...data.event_detail, start_at: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Selesai</Label>
                                        <Input
                                            type="datetime-local"
                                            value={data.event_detail.end_at}
                                            onChange={e => setData('event_detail', { ...data.event_detail, end_at: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Lokasi</Label>
                                        <Input
                                            value={data.event_detail.location}
                                            onChange={e => setData('event_detail', { ...data.event_detail, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Speaker</Label>
                                        <Input
                                            value={data.event_detail.speaker}
                                            onChange={e => setData('event_detail', { ...data.event_detail, speaker: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={processing} className="bg-univrab-blue">
                            Simpan Pengumuman
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
