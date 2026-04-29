import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function Edit({ page }: any) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        content: page.content,
        meta_description: page.meta_description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/static-pages/${page.id}`);
    };

    return (
        <>
            <Head title={`Edit ${page.title}`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Halaman: {page.title}</h1>
                    <Button variant="outline" asChild>
                        <Link href="/admin/static-pages">Batal</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="title">Judul Halaman</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="content">Konten (HTML Support)</Label>
                                <textarea
                                    id="content"
                                    rows={20}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                />
                                {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                                <Input
                                    id="meta_description"
                                    value={data.meta_description}
                                    onChange={e => setData('meta_description', e.target.value)}
                                    placeholder="Ringkasan halaman untuk pencarian..."
                                />
                                {errors.meta_description && <p className="text-red-500 text-xs">{errors.meta_description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-univrab-blue px-8">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Halaman Statis', href: '/admin/static-pages' },
        { title: 'Edit Halaman', href: '#' },
    ],
};
