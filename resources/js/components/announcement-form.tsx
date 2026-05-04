import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    Save, Calendar, FileText, Tag, Settings, ImageIcon, MapPin, User,
    Users, LinkIcon, X, Paperclip, Plus, Trash2, Globe, Star,
    Search, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import type { AnnouncementCategory, AnnouncementFormData, AttachmentItem } from '@/types/announcement';
import ReactQuill from 'react-quill-new';
import { cn } from '@/lib/utils';

const emptyEventDetail = {
    start_at: '',
    end_at: '',
    location: '',
    speaker: '',
    quota: '',
    registration_link: '',
};

type AnnouncementFormProps = {
    categories: AnnouncementCategory[];
    initialData?: Partial<AnnouncementFormData> & { slug?: string };
    submitUrl: string;
    method: 'post' | 'put';
    submitLabel: string;
    thumbnailUrl?: string;
};

export default function AnnouncementForm({
    categories,
    initialData,
    submitUrl,
    method,
    submitLabel,
    thumbnailUrl,
}: AnnouncementFormProps) {
    const { data, setData, post, put, processing, errors, transform } = useForm<AnnouncementFormData & { _method?: string }>({
        _method: method === 'put' ? 'PUT' : undefined,
        title: initialData?.title ?? '',
        category_id: initialData?.category_id?.toString() ?? '',
        content: initialData?.content ?? '',
        status: initialData?.status ?? 'draft',
        type: initialData?.type ?? 'regular',
        is_featured: initialData?.is_featured ?? false,
        published_at: initialData?.published_at ?? '',
        meta_title: initialData?.meta_title ?? '',
        meta_description: initialData?.meta_description ?? '',
        thumbnail: initialData?.thumbnail ?? null,
        event_detail: initialData?.event_detail ?? { ...emptyEventDetail },
        attachments: initialData?.attachments ?? [],
        attachments_deleted: [],
    });

    // Transform data before submission to fix type conversions
    transform((formData) => {
        const transformed = { ...formData };

        // Convert quota to number or null for event_detail
        if (transformed.event_detail?.quota !== undefined) {
            const quotaValue = transformed.event_detail.quota;
            if (quotaValue === '' || quotaValue === null || quotaValue === undefined) {
                transformed.event_detail = { ...transformed.event_detail, quota: null as any };
            } else {
                const quotaNum = parseInt(quotaValue as string, 10);
                transformed.event_detail = { ...transformed.event_detail, quota: (isNaN(quotaNum) ? null : quotaNum) as any };
            }
        }

        return transformed;
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(thumbnailUrl ? `/storage/${thumbnailUrl}` : null);
    const [activeTab, setActiveTab] = useState<'content' | 'event' | 'attachments' | 'seo'>('content');

    const addAttachment = (type: 'link' | 'file') => {
        setData('attachments', [
            ...data.attachments,
            { title: '', type, file: null, path: '' }
        ]);
    };

    const updateAttachment = (index: number, field: keyof AttachmentItem, value: any) => {
        const newAttachments = [...data.attachments];
        newAttachments[index] = { ...newAttachments[index], [field]: value };
        setData('attachments', newAttachments);
    };

    const removeAttachment = (index: number) => {
        const attachment = data.attachments[index];
        const newDeleted = [...data.attachments_deleted];
        if (attachment.id) {
            newDeleted.push(attachment.id);
        }

        setData(data => ({
            ...data,
            attachments: data.attachments.filter((_, i) => i !== index),
            attachments_deleted: newDeleted
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                toast.success(method === 'post' ? 'Pengumuman berhasil dibuat' : 'Pengumuman berhasil diperbarui');
            },
            onError: (err: any) => {
                console.error(err);
                toast.error('Gagal menyimpan pengumuman. Periksa kembali form Anda.');
            },
            forceFormData: true,
        };

        // We always use post here because even in edit mode,
        // we use _method spoofing to support file uploads (multipart/form-data)
        post(submitUrl, options);
    };

    const updateEventDetail = (field: keyof AnnouncementFormData['event_detail'], value: string) => {
        setData('event_detail', { ...data.event_detail, [field]: value });
    };

    // Scroll to first error field when errors exist
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const fieldId = firstErrorField.replace('event_detail.', 'event_');
            const element = document.getElementById(fieldId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }

            // Switch to relevant tab if error is in a tab
            if (firstErrorField.startsWith('event_detail')) setActiveTab('event');
            if (firstErrorField.startsWith('attachments')) setActiveTab('attachments');
            if (firstErrorField.startsWith('meta')) setActiveTab('seo');
        }
    }, [errors]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-20">
            {/* Top Bar / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 sticky top-4 z-40 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-univrab-blue flex items-center justify-center text-white shadow-lg shadow-univrab-blue/20">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight">{method === 'post' ? 'Buat Pengumuman Baru' : 'Edit Pengumuman'}</h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {data.status === 'published' ? (
                                <span className="text-green-500 flex items-center gap-1 font-medium"><CheckCircle2 className="h-3 w-3" /> Siap Dipublikasikan</span>
                            ) : (
                                <span className="text-amber-500 flex items-center gap-1 font-medium"><Clock className="h-3 w-3" /> Mode Draft</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-univrab-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all gap-2 h-10 px-6 rounded-xl flex-1 sm:flex-none"
                    >
                        {processing ? <Clock className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'content' ? "bg-white dark:bg-neutral-900 shadow-sm text-univrab-blue dark:text-univrab-gold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <FileText className="h-4 w-4" /> Konten
                        </button>
                        {data.type === 'event' && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('event')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    activeTab === 'event' ? "bg-white dark:bg-neutral-900 shadow-sm text-univrab-blue dark:text-univrab-gold" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Calendar className="h-4 w-4" /> Detail Event
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setActiveTab('attachments')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'attachments' ? "bg-white dark:bg-neutral-900 shadow-sm text-univrab-blue dark:text-univrab-gold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Paperclip className="h-4 w-4" /> Lampiran ({data.attachments.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('seo')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'seo' ? "bg-white dark:bg-neutral-900 shadow-sm text-univrab-blue dark:text-univrab-gold" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Search className="h-4 w-4" /> SEO
                        </button>
                    </div>

                    {/* Tab Panels */}
                    <div className="space-y-6">
                        {activeTab === 'content' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                    <CardHeader className="pb-4">
                                        <CardTitle>Konten Pengumuman</CardTitle>
                                        <CardDescription>Tuliskan judul dan isi pengumuman dengan lengkap</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-sm font-semibold">Judul Pengumuman</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="Contoh: Pengumuman Jadwal UAS Semester Genap..."
                                                className={cn(
                                                    "text-xl font-bold h-14 px-4 rounded-xl border-slate-200 dark:border-neutral-800 focus:ring-univrab-blue focus:border-univrab-blue bg-slate-50/50 dark:bg-neutral-950/50 transition-all",
                                                    errors.title && "border-red-500 focus:ring-red-500"
                                                )}
                                            />
                                            <InputError message={errors.title} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="content" className="text-sm font-semibold">Isi Konten</Label>
                                            <div className={cn(
                                                "rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
                                                errors.content && "border-red-500"
                                            )}>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={data.content}
                                                    onChange={(value) => setData('content', value)}
                                                    className="h-96 mb-12"
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            ['link', 'image', 'clean']
                                                        ],
                                                    }}
                                                />
                                            </div>
                                            <InputError message={errors.content} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'event' && data.type === 'event' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="border-none shadow-xl shadow-amber-100/50 dark:shadow-none bg-gradient-to-br from-white to-amber-50/30 dark:from-neutral-900 dark:to-amber-950/10 rounded-3xl">
                                    <CardHeader>
                                        <CardTitle className="text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                            <Calendar className="h-5 w-5" /> Detail Pelaksanaan Event
                                        </CardTitle>
                                        <CardDescription>Berikan informasi waktu dan tempat bagi calon peserta</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="event_start_at">Waktu Mulai</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_start_at"
                                                    type="datetime-local"
                                                    value={data.event_detail.start_at}
                                                    onChange={e => updateEventDetail('start_at', e.target.value)}
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                            <InputError message={errors['event_detail.start_at']} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="event_end_at">Waktu Selesai</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_end_at"
                                                    type="datetime-local"
                                                    value={data.event_detail.end_at}
                                                    onChange={e => updateEventDetail('end_at', e.target.value)}
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                            <InputError message={errors['event_detail.end_at']} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="event_location">Lokasi Event</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_location"
                                                    value={data.event_detail.location}
                                                    onChange={e => updateEventDetail('location', e.target.value)}
                                                    placeholder="Contoh: Gedung Rektorat, Lantai 4"
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                            <InputError message={errors['event_detail.location']} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="event_speaker">Pembicara / Speaker</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_speaker"
                                                    value={data.event_detail.speaker}
                                                    onChange={e => updateEventDetail('speaker', e.target.value)}
                                                    placeholder="Nama lengkap"
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="event_quota">Kuota Peserta</Label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_quota"
                                                    type="number"
                                                    value={data.event_detail.quota}
                                                    onChange={e => updateEventDetail('quota', e.target.value)}
                                                    placeholder="Misal: 100"
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="event_registration_link">Link Pendaftaran (Opsional)</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="event_registration_link"
                                                    type="url"
                                                    value={data.event_detail.registration_link}
                                                    onChange={e => updateEventDetail('registration_link', e.target.value)}
                                                    placeholder="https://univrab.id/daftar-event"
                                                    className="pl-10 h-11 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'attachments' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                    <CardHeader className="border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle>Daftar Lampiran</CardTitle>
                                                <CardDescription>File dokumen atau tautan penting</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button type="button" variant="outline" size="sm" onClick={() => addAttachment('file')} className="rounded-lg h-9">
                                                    <Plus className="h-4 w-4 mr-1 text-univrab-blue" /> Dokumen
                                                </Button>
                                                <Button type="button" variant="outline" size="sm" onClick={() => addAttachment('link')} className="rounded-lg h-9">
                                                    <Plus className="h-4 w-4 mr-1 text-univrab-blue" /> Tautan Link
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {data.attachments.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-slate-100 dark:border-neutral-800 rounded-2xl">
                                                <Paperclip className="h-10 w-10 mb-4 opacity-20" />
                                                <p className="text-sm">Belum ada lampiran ditambahkan</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {data.attachments.map((attachment, index) => (
                                                    <div key={index} className="flex flex-col p-4 border border-slate-100 dark:border-neutral-800 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/50 group relative">
                                                        <button
                                                            type="button"
                                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                                            onClick={() => removeAttachment(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className={cn(
                                                                "h-9 w-9 rounded-lg flex items-center justify-center shadow-sm",
                                                                attachment.type === 'link' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                                                            )}>
                                                                {attachment.type === 'link' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                            </div>
                                                            <Input
                                                                className="border-none bg-transparent font-semibold focus-visible:ring-0 h-8 px-0"
                                                                value={attachment.title}
                                                                onChange={e => updateAttachment(index, 'title', e.target.value)}
                                                                placeholder="Nama file/link..."
                                                            />
                                                        </div>
                                                        {attachment.type === 'link' ? (
                                                            <div className="relative">
                                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                                                                <Input
                                                                    type="url"
                                                                    className="h-9 pl-8 rounded-lg bg-white dark:bg-neutral-900 text-xs"
                                                                    value={attachment.path || ''}
                                                                    onChange={e => updateAttachment(index, 'path', e.target.value)}
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <Input
                                                                    type="file"
                                                                    className="h-9 rounded-lg bg-white dark:bg-neutral-900 text-xs file:bg-transparent file:border-none file:text-univrab-blue file:font-semibold"
                                                                    onChange={e => updateAttachment(index, 'file', e.target.files?.[0] || null)}
                                                                />
                                                                {attachment.path && (
                                                                    <p className="text-[10px] mt-1.5 text-muted-foreground truncate">File saat ini: {attachment.path.split('/').pop()}</p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-blue-500" /> Pengaturan SEO & Metadata
                                        </CardTitle>
                                        <CardDescription>Optimalkan pengumuman agar mudah ditemukan di mesin pencari</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="meta_title">SEO Title (Opsional)</Label>
                                            <Input
                                                id="meta_title"
                                                value={data.meta_title}
                                                onChange={e => setData('meta_title', e.target.value)}
                                                placeholder="Biarkan kosong untuk menggunakan judul utama"
                                                className="h-11 rounded-xl"
                                            />
                                            <p className="text-[10px] text-muted-foreground">Disarankan: 50-60 karakter</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="meta_description">Meta Description (Opsional)</Label>
                                            <Textarea
                                                id="meta_description"
                                                value={data.meta_description}
                                                onChange={e => setData('meta_description', e.target.value)}
                                                placeholder="Ringkasan singkat untuk hasil pencarian Google..."
                                                className="min-h-[100px] rounded-xl"
                                            />
                                            <p className="text-[10px] text-muted-foreground">Disarankan: 150-160 karakter</p>
                                        </div>

                                        <div className="p-4 bg-slate-50 dark:bg-neutral-950/50 rounded-2xl border border-slate-100 dark:border-neutral-800">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Preview Hasil Pencarian</h4>
                                            <div className="space-y-1">
                                                <div className="text-blue-600 dark:text-blue-400 font-medium text-lg truncate">
                                                    {data.meta_title || data.title || 'Judul Pengumuman Anda'}
                                                </div>
                                                <div className="text-green-700 dark:text-green-500 text-xs truncate">
                                                    {window.location.origin}/announcements/{initialData?.slug || 'slug-otomatis'}
                                                </div>
                                                <div className="text-slate-500 text-sm line-clamp-2">
                                                    {data.meta_description || (data.content ? data.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'Ringkasan konten pengumuman akan muncul di sini...')}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status & Attributes */}
                    <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-md flex items-center gap-2">
                                <Settings className="h-4 w-4" /> Atribut Publikasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tipe Konten</Label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'regular')}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            data.type === 'regular' ? "bg-white dark:bg-neutral-900 shadow-sm text-univrab-blue dark:text-univrab-gold" : "text-muted-foreground"
                                        )}
                                    >
                                        REGULER
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'event')}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            data.type === 'event' ? "bg-white dark:bg-neutral-900 shadow-sm text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                                        )}
                                    >
                                        EVENT
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kategori</Label>
                                <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                    <SelectTrigger id="category_id" className="h-11 rounded-xl border-slate-200 dark:border-neutral-800">
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status Publikasi</Label>
                                <Select value={data.status} onValueChange={val => setData('status', val as 'draft' | 'published')}>
                                    <SelectTrigger id="status" className="h-11 rounded-xl border-slate-200 dark:border-neutral-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft (Disimpan Internal)</SelectItem>
                                        <SelectItem value="published">Published (Umum)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-neutral-950/50 rounded-xl border border-slate-100 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-univrab-gold/10 flex items-center justify-center text-univrab-gold">
                                        <Star className="h-4 w-4 fill-current" />
                                    </div>
                                    <Label htmlFor="is_featured" className="text-sm font-semibold cursor-pointer">Featured (Pin)</Label>
                                </div>
                                <Switch
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={checked => setData('is_featured', checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jadwal Tayang</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={e => setData('published_at', e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-slate-200 dark:border-neutral-800"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Kosongkan untuk tayang segera saat di-publish</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thumbnail Section */}
                    <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-md flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" /> Gambar Sampul
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className={cn(
                                    "relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-neutral-950 border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group",
                                    previewUrl ? "border-solid border-slate-200 dark:border-neutral-800" : "border-slate-200 dark:border-neutral-800 hover:border-univrab-blue"
                                )}
                                onClick={() => document.getElementById('thumbnail')?.click()}
                            >
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-xs font-bold flex items-center gap-2">
                                                <ImageIcon className="h-4 w-4" /> Ganti Gambar
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="h-12 w-12 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 dark:border-neutral-800">
                                            <Plus className="h-6 w-6 text-univrab-blue" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-500">Pilih Gambar</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG, max 2MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0] || null;
                                    setData('thumbnail', file);
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />
                            <InputError message={errors.thumbnail} />

                            {previewUrl && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setData('thumbnail', null);
                                        setPreviewUrl(null);
                                    }}
                                >
                                    <X className="h-3 w-3 mr-1" /> Hapus Gambar
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hint / Tip Card */}
                    <Card className="border-none bg-blue-600 text-white rounded-3xl overflow-hidden shadow-lg shadow-blue-200/50 dark:shadow-none">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Tips Menarik</h4>
                                    <p className="text-xs text-blue-100 leading-relaxed">
                                        Gunakan thumbnail berkualitas tinggi (1200x630px) untuk hasil optimal saat pengumuman dibagikan ke Media Sosial.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
