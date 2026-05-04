import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Globe, Image as ImageIcon, Contact, Layout } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings({ settings }: { settings: any }) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || 'LPDSA',
        app_description: settings.app_description || '',
        app_logo: null as File | null,
        app_favicon: null as File | null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        footer_text: settings.footer_text || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            onSuccess: () => {
                toast.success('Pengaturan berhasil diperbarui');
            },
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Pengaturan Sistem" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Pengaturan Sistem</h1>
                    <p className="text-muted-foreground mt-1">
                        Kelola konfigurasi dasar, identitas visual, dan informasi kontak website.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="bg-white dark:bg-neutral-900 border">
                            <TabsTrigger value="general" className="gap-2">
                                <Globe className="h-4 w-4" />
                                Umum
                            </TabsTrigger>
                            <TabsTrigger value="visual" className="gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Visual
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="gap-2">
                                <Contact className="h-4 w-4" />
                                Kontak
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pengaturan Umum</CardTitle>
                                    <CardDescription>Nama dan deskripsi dasar aplikasi.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="app_name">Nama Aplikasi</Label>
                                        <Input
                                            id="app_name"
                                            value={data.app_name}
                                            onChange={e => setData('app_name', e.target.value)}
                                        />
                                        {errors.app_name && <p className="text-red-500 text-xs">{errors.app_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="app_description">Deskripsi Aplikasi</Label>
                                        <textarea
                                            id="app_description"
                                            rows={3}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={data.app_description}
                                            onChange={e => setData('app_description', e.target.value)}
                                        />
                                        {errors.app_description && <p className="text-red-500 text-xs">{errors.app_description}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="footer_text">Teks Footer</Label>
                                        <Input
                                            id="footer_text"
                                            value={data.footer_text}
                                            onChange={e => setData('footer_text', e.target.value)}
                                            placeholder="© 2024 LPDSA Universitas Abdurrab"
                                        />
                                        {errors.footer_text && <p className="text-red-500 text-xs">{errors.footer_text}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="visual" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Identitas Visual</CardTitle>
                                    <CardDescription>Logo dan favicon aplikasi.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label>Logo Aplikasi</Label>
                                            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg border-dashed">
                                                {settings.app_logo ? (
                                                    <img src={`/storage/${settings.app_logo}`} alt="Logo" className="h-20 object-contain" />
                                                ) : (
                                                    <div className="h-20 w-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                                        No Logo
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    onChange={e => setData('app_logo', e.target.files ? e.target.files[0] : null)}
                                                    className="max-w-xs"
                                                />
                                            </div>
                                            {errors.app_logo && <p className="text-red-500 text-xs">{errors.app_logo}</p>}
                                        </div>

                                        <div className="space-y-4">
                                            <Label>Favicon</Label>
                                            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg border-dashed">
                                                {settings.app_favicon ? (
                                                    <img src={`/storage/${settings.app_favicon}`} alt="Favicon" className="h-10 w-10 object-contain" />
                                                ) : (
                                                    <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                                        No
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    onChange={e => setData('app_favicon', e.target.files ? e.target.files[0] : null)}
                                                    className="max-w-xs"
                                                />
                                            </div>
                                            {errors.app_favicon && <p className="text-red-500 text-xs">{errors.app_favicon}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Kontak</CardTitle>
                                    <CardDescription>Data kontak yang akan ditampilkan di website.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_email">Email Kontak</Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                value={data.contact_email}
                                                onChange={e => setData('contact_email', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_phone">Telepon Kontak</Label>
                                            <Input
                                                id="contact_phone"
                                                value={data.contact_phone}
                                                onChange={e => setData('contact_phone', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_address">Alamat</Label>
                                        <textarea
                                            id="contact_address"
                                            rows={3}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={data.contact_address}
                                            onChange={e => setData('contact_address', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 flex justify-end">
                        <Button type="submit" disabled={processing} className="bg-univrab-blue px-8 h-12 shadow-lg transition-all hover:scale-105 active:scale-95">
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Settings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengaturan Sistem', href: '#' },
    ],
};
