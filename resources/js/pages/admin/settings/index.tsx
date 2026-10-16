import { Head, useForm } from '@inertiajs/react';
import {
    Save,
    Globe,
    Image as ImageIcon,
    Contact,
    Sparkles,
    Database,
    ExternalLink,
    Key,
    Info,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings({ settings }: { settings: Record<string, string | null> }) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: settings.app_name || 'LPDSA',
        app_description: settings.app_description || '',
        app_logo: null as File | null,
        app_favicon: null as File | null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        footer_text: settings.footer_text || '',
        social_facebook: settings.social_facebook || '',
        social_instagram: settings.social_instagram || '',
        social_youtube: settings.social_youtube || '',
        hero_badge_text: settings.hero_badge_text || 'Lembaga Penjaminan Mutu & Pengembangan Pendidikan',
        hero_welcome_title: settings.hero_welcome_title || 'Selamat Datang di Pusat Informasi & Pengumuman LPDSA',
        hero_welcome_subtitle:
            settings.hero_welcome_subtitle ||
            'Media resmi publikasi pengumuman akademik, penjaminan mutu, layanan digital, dan agenda Universitas Abdurrab.',
        academic_api_url: settings.academic_api_url || '',
        academic_api_token: settings.academic_api_token || '',
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
                    <p className="text-muted-foreground mt-1 text-sm">
                        Kelola konfigurasi dasar, konten hero beranda, integrasi API sistem akademik, dan informasi kontak.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="bg-white dark:bg-neutral-900 border">
                            <TabsTrigger value="general" className="gap-2 text-xs sm:text-sm">
                                <Globe className="h-4 w-4" />
                                Umum & Hero
                            </TabsTrigger>
                            <TabsTrigger value="visual" className="gap-2 text-xs sm:text-sm">
                                <ImageIcon className="h-4 w-4" />
                                Visual
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="gap-2 text-xs sm:text-sm">
                                <Contact className="h-4 w-4" />
                                Kontak
                            </TabsTrigger>
                            <TabsTrigger value="api" className="gap-2 text-xs sm:text-sm">
                                <Database className="h-4 w-4" />
                                Integrasi API
                            </TabsTrigger>
                        </TabsList>

                        {/* General & Hero Settings */}
                        <TabsContent value="general" className="space-y-6">
                            {/* Hero Landing Section */}
                            <Card className="border-[#8B142C]/20 shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-[#8B142C] dark:text-red-400" />
                                        <CardTitle className="text-lg">Teks Hero Sambutan (Halaman Utama)</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Ubah teks ucapan selamat datang, badge label, dan deskripsi hero di landing page.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="hero_badge_text">Teks Badge Label Atas</Label>
                                        <Input
                                            id="hero_badge_text"
                                            value={data.hero_badge_text}
                                            onChange={(e) => setData('hero_badge_text', e.target.value)}
                                            placeholder="Contoh: Lembaga Penjaminan Mutu & Pengembangan Pendidikan"
                                        />
                                        {errors.hero_badge_text && (
                                            <p className="text-red-500 text-xs">{errors.hero_badge_text}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero_welcome_title">Judul Utama Selamat Datang</Label>
                                        <Input
                                            id="hero_welcome_title"
                                            value={data.hero_welcome_title}
                                            onChange={(e) => setData('hero_welcome_title', e.target.value)}
                                            placeholder="Contoh: Selamat Datang di Pusat Informasi & Pengumuman LPDSA"
                                        />
                                        {errors.hero_welcome_title && (
                                            <p className="text-red-500 text-xs">{errors.hero_welcome_title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="hero_welcome_subtitle">Subjudul / Deskripsi Sambutan</Label>
                                        <textarea
                                            id="hero_welcome_subtitle"
                                            rows={3}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={data.hero_welcome_subtitle}
                                            onChange={(e) => setData('hero_welcome_subtitle', e.target.value)}
                                            placeholder="Teks deskripsi lengkap di bawah judul utama..."
                                        />
                                        {errors.hero_welcome_subtitle && (
                                            <p className="text-red-500 text-xs">{errors.hero_welcome_subtitle}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Base Application Settings */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Identitas Aplikasi</CardTitle>
                                    <CardDescription>Nama dan deskripsi dasar aplikasi.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="app_name">Nama Aplikasi</Label>
                                        <Input
                                            id="app_name"
                                            value={data.app_name}
                                            onChange={(e) => setData('app_name', e.target.value)}
                                        />
                                        {errors.app_name && <p className="text-red-500 text-xs">{errors.app_name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="app_description">Deskripsi Aplikasi</Label>
                                        <textarea
                                            id="app_description"
                                            rows={2}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            value={data.app_description}
                                            onChange={(e) => setData('app_description', e.target.value)}
                                        />
                                        {errors.app_description && (
                                            <p className="text-red-500 text-xs">{errors.app_description}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="footer_text">Teks Footer</Label>
                                        <Input
                                            id="footer_text"
                                            value={data.footer_text}
                                            onChange={(e) => setData('footer_text', e.target.value)}
                                            placeholder="© 2024 LPDSA Universitas Abdurrab"
                                        />
                                        {errors.footer_text && <p className="text-red-500 text-xs">{errors.footer_text}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Visual Settings */}
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
                                                    <img
                                                        src={`/storage/${settings.app_logo}`}
                                                        alt="Logo"
                                                        className="h-20 object-contain"
                                                    />
                                                ) : (
                                                    <div className="h-20 w-20 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                                        No Logo
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setData('app_logo', e.target.files ? e.target.files[0] : null)
                                                    }
                                                    className="max-w-xs"
                                                />
                                            </div>
                                            {errors.app_logo && <p className="text-red-500 text-xs">{errors.app_logo}</p>}
                                        </div>

                                        <div className="space-y-4">
                                            <Label>Favicon</Label>
                                            <div className="flex flex-col items-center gap-4 p-4 border rounded-lg border-dashed">
                                                {settings.app_favicon ? (
                                                    <img
                                                        src={`/storage/${settings.app_favicon}`}
                                                        alt="Favicon"
                                                        className="h-10 w-10 object-contain"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                                                        No
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    onChange={(e) =>
                                                        setData('app_favicon', e.target.files ? e.target.files[0] : null)
                                                    }
                                                    className="max-w-xs"
                                                />
                                            </div>
                                            {errors.app_favicon && (
                                                <p className="text-red-500 text-xs">{errors.app_favicon}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Contact Settings */}
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
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_phone">Telepon Kontak</Label>
                                            <Input
                                                id="contact_phone"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
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
                                            onChange={(e) => setData('contact_address', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* External API Integration Settings */}
                        <TabsContent value="api" className="space-y-6">
                            <Card className="border-blue-200 dark:border-blue-900/50">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <CardTitle className="text-lg">API Sistem Akademik (Sistem Sebelah)</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Konfigurasi endpoint untuk sinkronisasi otomatis master data Universitas, Fakultas, dan Program Studi (lengkap dengan jenjang D3/S1/Profesi).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="academic_api_url" className="flex items-center gap-1.5">
                                            <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                                            Endpoint URL API
                                        </Label>
                                        <Input
                                            id="academic_api_url"
                                            value={data.academic_api_url}
                                            onChange={(e) => setData('academic_api_url', e.target.value)}
                                            placeholder="https://akademik.univrab.ac.id/api/v1/academic-units"
                                            className="font-mono text-xs"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Jika dikosongkan atau server belum tersedia, sistem akan otomatis menggunakan data struktur baku Univrab sebagai fallback tanpa error.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="academic_api_token" className="flex items-center gap-1.5">
                                            <Key className="h-3.5 w-3.5 text-amber-500" />
                                            Bearer Token / API Key (Opsional)
                                        </Label>
                                        <Input
                                            id="academic_api_token"
                                            type="password"
                                            value={data.academic_api_token}
                                            onChange={(e) => setData('academic_api_token', e.target.value)}
                                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                                            className="font-mono text-xs"
                                        />
                                    </div>

                                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                                        <div className="flex items-center gap-1.5 font-semibold">
                                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                            <span>Format JSON yang diharapkan dari API Sistem Sebelah:</span>
                                        </div>
                                        <pre className="p-2.5 bg-slate-900 text-slate-100 rounded text-[11px] overflow-x-auto font-mono">
{`{
  "status": "success",
  "data": [
    {
      "code": "73201",
      "name": "Farmasi",
      "type": "study_program",
      "level": "S1",
      "faculty_name": "Fakultas Farmasi dan Ilmu Kesehatan"
    }
  ]
}`}
                                        </pre>
                                        <p className="text-[11px] text-blue-700 dark:text-blue-300">
                                            Dokumentasi API lengkap untuk pengembang sistem sebelah tersedia di file catatan perencanaan akreditasi.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#8B142C] hover:bg-[#721024] text-white px-8 h-12 shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
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
