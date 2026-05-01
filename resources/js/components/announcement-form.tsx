import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import { Save, Calendar, FileText, Tag, Settings, ImageIcon, MapPin, User, Users, LinkIcon, X, Paperclip, Plus, Trash2 } from 'lucide-react';
import type { AnnouncementCategory, AnnouncementFormData, AttachmentItem } from '@/types/announcement';
import ReactQuill from 'react-quill-new';

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
    initialData?: Partial<AnnouncementFormData>;
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
    const { data, setData, post, put, processing, errors } = useForm<AnnouncementFormData>({
        title: initialData?.title ?? '',
        category_id: initialData?.category_id ?? '',
        content: initialData?.content ?? '',
        status: initialData?.status ?? 'draft',
        type: initialData?.type ?? 'regular',
        published_at: initialData?.published_at ?? '',
        thumbnail: initialData?.thumbnail ?? null,
        event_detail: initialData?.event_detail ?? { ...emptyEventDetail },
        attachments: initialData?.attachments ?? [],
        attachments_deleted: [],
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(thumbnailUrl ? `/storage/${thumbnailUrl}` : null);

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
        if (method === 'post') {
            post(submitUrl, {
                onSuccess: () => {
                    toast.success('Pengumuman berhasil dibuat');
                },
            });
        } else {
            put(submitUrl, {
                onSuccess: () => {
                    toast.success('Pengumuman berhasil diperbarui');
                },
            });
        }
    };

    const updateEventDetail = (field: keyof AnnouncementFormData['event_detail'], value: string) => {
        setData('event_detail', { ...data.event_detail, [field]: value });
    };

    // Scroll to first error field when errors exist
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementById(firstErrorField.replace('event_detail.', 'event_'));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
        }
    }, [errors]);

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Informasi Dasar
                        </CardTitle>
                        <CardDescription>Isi informasi utama pengumuman</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Pengumuman</Label>
                            <Input
                                id="title"
                                name="title"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Masukkan judul pengumuman..."
                                className={`text-lg ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Konten</Label>
                            <div className={`rounded-md bg-white ${errors.content ? 'border border-red-500' : ''}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(value) => setData('content', value)}
                                    className="h-64 mb-12"
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                            ['link', 'clean']
                                        ],
                                    }}
                                />
                            </div>
                            <InputError message={errors.content} />
                        </div>
                    </CardContent>
                </Card>

                {data.type === 'event' && (
                    <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Calendar className="h-5 w-5" />
                                Detail Event
                            </CardTitle>
                            <CardDescription>Informasi spesifik untuk event</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event_start_at">Waktu Mulai</Label>
                                    <Input
                                        id="event_start_at"
                                        name="event_detail[start_at]"
                                        type="datetime-local"
                                        value={data.event_detail.start_at}
                                        onChange={e => updateEventDetail('start_at', e.target.value)}
                                        className={errors['event_detail.start_at'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.start_at']} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="event_end_at">Waktu Selesai</Label>
                                    <Input
                                        id="event_end_at"
                                        name="event_detail[end_at]"
                                        type="datetime-local"
                                        value={data.event_detail.end_at}
                                        onChange={e => updateEventDetail('end_at', e.target.value)}
                                        className={errors['event_detail.end_at'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.end_at']} />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <Label htmlFor="event_location" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Lokasi
                                    </Label>
                                    <Input
                                        id="event_location"
                                        name="event_detail[location]"
                                        value={data.event_detail.location}
                                        onChange={e => updateEventDetail('location', e.target.value)}
                                        placeholder="Contoh: Aula Gedung Tariq Bin Ziyad"
                                        className={errors['event_detail.location'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.location']} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="event_speaker" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Speaker
                                    </Label>
                                    <Input
                                        id="event_speaker"
                                        name="event_detail[speaker]"
                                        value={data.event_detail.speaker}
                                        onChange={e => updateEventDetail('speaker', e.target.value)}
                                        placeholder="Nama pembicara"
                                        className={errors['event_detail.speaker'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.speaker']} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="event_quota" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Kuota Peserta
                                    </Label>
                                    <Input
                                        id="event_quota"
                                        name="event_detail[quota]"
                                        type="number"
                                        value={data.event_detail.quota}
                                        onChange={e => updateEventDetail('quota', e.target.value)}
                                        placeholder="Jumlah peserta"
                                        className={errors['event_detail.quota'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.quota']} />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <Label htmlFor="event_registration_link" className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4" />
                                        Link Pendaftaran
                                    </Label>
                                    <Input
                                        id="event_registration_link"
                                        name="event_detail[registration_link]"
                                        type="url"
                                        value={data.event_detail.registration_link}
                                        onChange={e => updateEventDetail('registration_link', e.target.value)}
                                        placeholder="https://forms.gle/..."
                                        className={errors['event_detail.registration_link'] ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    <InputError message={errors['event_detail.registration_link']} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Pengaturan Publikasi
                        </CardTitle>
                        <CardDescription>Atribut kategori dan status pengumuman</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                Kategori
                            </Label>
                            <input type="hidden" name="category_id" value={data.category_id} />
                            <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                <SelectTrigger id="category_id" className={`w-full ${errors.category_id ? 'border-red-500' : ''}`}>
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
                            <Label htmlFor="type">Tipe Pengumuman</Label>
                            <input type="hidden" name="type" value={data.type} />
                            <Select value={data.type} onValueChange={val => setData('type', val as 'regular' | 'event')}>
                                <SelectTrigger id="type" className={`w-full ${errors.type ? 'border-red-500' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="regular">Reguler</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <Separator className="my-2" />

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <input type="hidden" name="status" value={data.status} />
                            <Select value={data.status} onValueChange={val => setData('status', val as 'draft' | 'published')}>
                                <SelectTrigger id="status" className={`w-full ${errors.status ? 'border-red-500' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="published_at">Jadwal Publikasi (Opsional)</Label>
                            <Input
                                id="published_at"
                                name="published_at"
                                type="datetime-local"
                                value={data.published_at}
                                onChange={e => setData('published_at', e.target.value)}
                                className={errors.published_at ? 'border-red-500 focus-visible:ring-red-500' : ''}
                            />
                            <InputError message={errors.published_at} />
                        </div>

                        </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Thumbnail
                        </CardTitle>
                        <CardDescription>Gambar sampul pengumuman (opsional)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {previewUrl && (
                                <div className="relative w-full rounded-lg overflow-hidden border group">
                                    <img
                                        src={previewUrl}
                                        alt="Thumbnail Preview"
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                setData('thumbnail', null);
                                                setPreviewUrl(null);
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Hapus Gambar
                                        </Button>
                                    </div>
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                        Preview
                                    </span>
                                </div>
                            )}
                            <Input
                                id="thumbnail"
                                name="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files?.[0] || null;
                                    setData('thumbnail', file);
                                    if (file) {
                                        setPreviewUrl(URL.createObjectURL(file));
                                    } else {
                                        setPreviewUrl(thumbnailUrl ? `/storage/${thumbnailUrl}` : null);
                                    }
                                }}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-univrab-blue/10 file:text-univrab-blue hover:file:bg-univrab-blue/20"
                            />
                            <p className="text-xs text-muted-foreground">Maksimal 2MB. (JPG, PNG, GIF)</p>
                            <InputError message={errors.thumbnail} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Paperclip className="h-5 w-5" />
                            Lampiran Utama
                        </CardTitle>
                        <CardDescription>Tambahkan dokumen atau tautan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.attachments.map((attachment, index) => (
                            <div key={index} className="flex gap-2 items-start p-3 border rounded-md relative bg-slate-50 dark:bg-neutral-900 group">
                                <div className="space-y-2 w-full flex-1 min-w-0">
                                    <Input
                                        className="h-8 text-sm"
                                        value={attachment.title}
                                        onChange={e => updateAttachment(index, 'title', e.target.value)}
                                        placeholder="Judul (Petunjuk...)"
                                        required
                                    />
                                    {attachment.type === 'link' ? (
                                        <Input
                                            type="url"
                                            className="h-8 text-sm"
                                            value={attachment.path || ''}
                                            onChange={e => updateAttachment(index, 'path', e.target.value)}
                                            placeholder="https://..."
                                            required
                                        />
                                    ) : (
                                        <div className="flex flex-col w-full">
                                            <Input
                                                type="file"
                                                className="text-xs file:h-full h-8 flex items-center pr-2 p-0"
                                                onChange={e => updateAttachment(index, 'file', e.target.files?.[0] || null)}
                                                required={!attachment.id}
                                            />
                                            {attachment.id && attachment.path && (
                                                <span className="text-[10px] text-muted-foreground mt-1 truncate">({attachment.path})</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 opacity-50 group-hover:opacity-100 flex-shrink-0" onClick={() => removeAttachment(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        
                        <div className="flex flex-col gap-2 pt-1 border-t border-dashed">
                            <Button type="button" variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => addAttachment('file')}>
                                <Plus className="h-3 w-3 mr-1" /> Dokumen Baru
                            </Button>
                            <Button type="button" variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => addAttachment('link')}>
                                <Plus className="h-3 w-3 mr-1" /> Tautan (Link) Baru
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="sticky bottom-6 mt-4">
                    <Button type="submit" disabled={processing} className="w-full bg-univrab-blue h-12 text-md shadow-lg hover:shadow-xl transition-all">
                        <Save className="h-5 w-5 mr-2" />
                        {processing ? 'Menyimpan...' : submitLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
}
