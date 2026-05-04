import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, FileText, Globe, Settings2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { toast } from 'sonner';
import { useEffect } from 'react';
import OrgStructureForm from '@/components/admin/org-structure-form';
import DocumentsForm from '@/components/admin/documents-form';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        type: 'default',
        content: '',
        meta_description: '',
        data: [] as any[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/static-pages', {
            onSuccess: () => {
                toast.success('Halaman berhasil dibuat');
            },
        });
    };

    useEffect(() => {
        if (data.title && !data.slug) {
            const s = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            setData('slug', s);
        }
    }, [data.title]);

    // Initialize data array when type changes
    useEffect(() => {
        if (data.type === 'org_structure' && (!data.data || data.data.length === 0)) {
            setData('data', [{ name: '', position: '', level: '1', photo: null }]);
        } else if (data.type === 'documents' && (!data.data || data.data.length === 0)) {
            setData('data', [{ title: '', description: '', file: null, is_external_link: false, url: '' }]);
        }
    }, [data.type]);

    return (
        <>
            <Head title="Buat Halaman Baru" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Buat Halaman Baru</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Tambahkan halaman statis baru ke website LPDSA.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/static-pages">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-univrab-blue" />
                                    Informasi Halaman
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Halaman</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="Contoh: Struktur Organisasi"
                                        className={`text-lg font-medium ${errors.title ? 'border-red-500' : ''}`}
                                    />
                                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Settings2 className="h-5 w-5 text-univrab-blue" />
                                        Konten Builder
                                    </CardTitle>
                                    
                                    <div className="flex items-center gap-2">
                                        <Label>Tipe Halaman:</Label>
                                        <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                            <SelectTrigger className="w-[180px] h-8 text-xs font-semibold bg-univrab-blue/5 text-univrab-blue border-univrab-blue/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default (Teks Bebas)</SelectItem>
                                                <SelectItem value="org_structure">Struktur Organisasi</SelectItem>
                                                <SelectItem value="documents">Pusat Dokumen</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <CardDescription>Pilih tipe halaman untuk mengubah mode editor.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {data.type === 'default' && (
                                    <div className="space-y-2">
                                        <div className={`rounded-md bg-white dark:bg-neutral-950 ${errors.content ? 'border border-red-500' : ''}`}>
                                            <ReactQuill
                                                theme="snow"
                                                value={data.content || ''}
                                                onChange={(value) => setData('content', value)}
                                                className="h-96 mb-12"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, 4, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'color': [] }, { 'background': [] }],
                                                        [{ 'align': [] }],
                                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                        ['link', 'image', 'video'],
                                                        ['clean']
                                                    ],
                                                }}
                                            />
                                        </div>
                                        {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'org_structure' && (
                                    <div className="pt-2 border-t border-dashed">
                                        <OrgStructureForm data={data.data} onChange={(d) => setData('data', d)} />
                                    </div>
                                )}

                                {data.type === 'documents' && (
                                    <div className="pt-2 border-t border-dashed">
                                        <DocumentsForm data={data.data} onChange={(d) => setData('data', d)} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Globe className="h-5 w-5 text-univrab-blue" />
                                    SEO & Navigasi
                                </CardTitle>
                                <CardDescription>Atur alamat URL dan optimasi pencarian.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Slug</Label>
                                    <div className="flex items-center">
                                        <span className="bg-slate-100 dark:bg-neutral-800 border border-r-0 rounded-l-md px-3 py-2 text-sm text-slate-500">/</span>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={e => setData('slug', e.target.value)}
                                            className={`rounded-l-none ${errors.slug ? 'border-red-500' : ''}`}
                                            placeholder="struktur-organisasi"
                                        />
                                    </div>
                                    {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <textarea
                                        id="meta_description"
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={data.meta_description}
                                        onChange={e => setData('meta_description', e.target.value)}
                                        placeholder="Ringkasan halaman untuk hasil pencarian..."
                                    />
                                    {errors.meta_description && <p className="text-red-500 text-xs">{errors.meta_description}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="sticky bottom-6">
                            <Button type="submit" disabled={processing} className="w-full bg-univrab-blue hover:bg-univrab-blue/90 h-12 shadow-lg transition-all">
                                <Save className="h-4 w-4 mr-2" />
                                {processing ? 'Menyimpan...' : 'Simpan Halaman'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman Statis', href: '/admin/static-pages' },
        { title: 'Buat Baru', href: '#' },
    ],
};
