import { useForm } from '@inertiajs/react';
import {
    Save, Calendar, FileText, Settings, ImageIcon, MapPin, User,
    Users, LinkIcon, Paperclip, Plus, Trash2, Globe, Star,
    Search, AlertCircle, CheckCircle2, Clock, Upload, Eye
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { AnnouncementCategory, AnnouncementFormData, AttachmentItem, AnnouncementImage } from '@/types/announcement';

const emptyEventDetail = {
    start_at: '',
    end_at: '',
    location: '',
    speaker: '',
    quota: '',
    registration_link: '',
};

type NewUploadItem = {
    id: string;
    file: File;
    preview: string;
    caption: string;
};

type AnnouncementFormProps = {
    categories: AnnouncementCategory[];
    initialData?: Partial<AnnouncementFormData> & { slug?: string };
    submitUrl: string;
    method: 'post' | 'put';
    submitLabel: string;
    thumbnailUrl?: string;
    existingImages?: AnnouncementImage[];
};

export default function AnnouncementForm({
    categories,
    initialData,
    submitUrl,
    method,
    submitLabel,
    thumbnailUrl,
    existingImages = [],
}: AnnouncementFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Multi-Image Gallery State
    const [existingList, setExistingList] = useState<AnnouncementImage[]>(existingImages);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [existingCaptions, setExistingCaptions] = useState<Record<number, string>>(() => {
        const caps: Record<number, string> = {};
        existingImages.forEach(img => {
            caps[img.id] = img.caption || '';
        });

        return caps;
    });

    // Selected cover state
    const [selectedCoverId, setSelectedCoverId] = useState<number | null>(() => {
        const cover = existingImages.find(img => img.is_cover);

        return cover ? cover.id : (existingImages.length > 0 ? existingImages[0].id : null);
    });

    const [newImages, setNewImages] = useState<NewUploadItem[]>([]);
    const [newCoverIndex, setNewCoverIndex] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState<'content' | 'gallery' | 'event' | 'attachments' | 'seo'>('content');

    const { data, setData, post, processing, errors, transform } = useForm<AnnouncementFormData & { _method?: string }>({
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
        thumbnail: null,
        images: [],
        image_captions: [],
        cover_image_index: null,
        cover_image_id: null,
        existing_captions: {},
        deleted_image_ids: [],
        event_detail: initialData?.event_detail ?? { ...emptyEventDetail },
        attachments: initialData?.attachments ?? [],
        attachments_deleted: [],
    });

    // Transform data before submission
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

        // Attach multi-image gallery files & captions
        transformed.images = newImages.map(item => item.file);
        transformed.image_captions = newImages.map(item => item.caption);
        transformed.cover_image_index = newCoverIndex;
        transformed.cover_image_id = selectedCoverId;
        transformed.existing_captions = existingCaptions;
        transformed.deleted_image_ids = deletedImageIds;

        return transformed;
    });

    // Handle adding files to gallery
    const handleFilesSelected = (files: FileList | null) => {
        if (!files || files.length === 0) {
return;
}

        const validFiles: NewUploadItem[] = [];
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                toast.error(`File "${file.name}" bukan gambar.`);

                return;
            }

            if (file.size > 3 * 1024 * 1024) {
                toast.error(`Ukuran file "${file.name}" melebihi 3MB.`);

                return;
            }

            const item: NewUploadItem = {
                id: Math.random().toString(36).substring(2, 9),
                file,
                preview: URL.createObjectURL(file),
                caption: '',
            };
            validFiles.push(item);
        });

        if (validFiles.length > 0) {
            setNewImages(prev => {
                const combined = [...prev, ...validFiles];

                // If no cover was set at all (neither existing nor new), set the first new image as cover
                if (selectedCoverId === null && newCoverIndex === null) {
                    setNewCoverIndex(0);
                }

                return combined;
            });
            toast.success(`${validFiles.length} foto berhasil ditambahkan ke galeri`);
        }
    };

    // Remove new image
    const removeNewImage = (index: number) => {
        setNewImages(prev => {
            const updated = prev.filter((_, i) => i !== index);

            if (newCoverIndex === index) {
                if (updated.length > 0) {
                    setNewCoverIndex(0);
                } else if (existingList.length > 0) {
                    setNewCoverIndex(null);
                    setSelectedCoverId(existingList[0].id);
                } else {
                    setNewCoverIndex(null);
                }
            } else if (newCoverIndex !== null && newCoverIndex > index) {
                setNewCoverIndex(newCoverIndex - 1);
            }

            return updated;
        });
    };

    // Remove existing image
    const removeExistingImage = (id: number) => {
        setDeletedImageIds(prev => [...prev, id]);
        setExistingList(prev => prev.filter(img => img.id !== id));

        if (selectedCoverId === id) {
            const remaining = existingList.filter(img => img.id !== id);

            if (remaining.length > 0) {
                setSelectedCoverId(remaining[0].id);
            } else if (newImages.length > 0) {
                setSelectedCoverId(null);
                setNewCoverIndex(0);
            } else {
                setSelectedCoverId(null);
            }
        }
    };

    // Set cover photo
    const setAsCover = (type: 'existing' | 'new', idOrIndex: number) => {
        if (type === 'existing') {
            setSelectedCoverId(idOrIndex);
            setNewCoverIndex(null);
            toast.info('Foto sampul utama diperbarui');
        } else {
            setNewCoverIndex(idOrIndex);
            setSelectedCoverId(null);
            toast.info('Foto sampul utama diperbarui');
        }
    };

    // Attachments management
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

        setData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
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

        post(submitUrl, options);
    };

    const updateEventDetail = (field: keyof AnnouncementFormData['event_detail'], value: string) => {
        setData('event_detail', { ...data.event_detail, [field]: value });
    };

    // Compute error counts for each tab
    const contentErrorsCount = ['title', 'content', 'category_id', 'type', 'status'].filter(f => !!errors[f as keyof typeof errors]).length;
    const eventErrorsCount = Object.keys(errors).filter(f => f.startsWith('event_detail')).length;
    const galleryErrorsCount = Object.keys(errors).filter(f => f.startsWith('images') || f === 'thumbnail').length;
    const attachmentErrorsCount = Object.keys(errors).filter(f => f.startsWith('attachments')).length;
    const seoErrorsCount = ['meta_title', 'meta_description'].filter(f => !!errors[f as keyof typeof errors]).length;

    // Scroll to first error field and switch tab if necessary
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstErrorField = Object.keys(errors)[0];
            const fieldId = firstErrorField.replace('event_detail.', 'event_');
            const element = document.getElementById(fieldId);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }

            setTimeout(() => {
                if (firstErrorField.startsWith('event_detail')) {
                    setActiveTab('event');
                } else if (firstErrorField.startsWith('images') || firstErrorField === 'thumbnail') {
                    setActiveTab('gallery');
                } else if (firstErrorField.startsWith('attachments')) {
                    setActiveTab('attachments');
                } else if (firstErrorField.startsWith('meta')) {
                    setActiveTab('seo');
                }
            }, 0);
        }
    }, [errors]);

    // Calculate current cover preview URL
    let coverPreviewUrl: string | null = null;

    if (newCoverIndex !== null && newImages[newCoverIndex]) {
        coverPreviewUrl = newImages[newCoverIndex].preview;
    } else if (selectedCoverId !== null) {
        const found = existingList.find(img => img.id === selectedCoverId);

        if (found) {
            coverPreviewUrl = `/storage/${found.image_path}`;
        }
    } else if (existingList.length > 0) {
        coverPreviewUrl = `/storage/${existingList[0].image_path}`;
    } else if (newImages.length > 0) {
        coverPreviewUrl = newImages[0].preview;
    } else if (thumbnailUrl) {
        coverPreviewUrl = `/storage/${thumbnailUrl}`;
    }

    const totalImagesCount = existingList.length + newImages.length;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-20">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 sticky top-4 z-40 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-700 dark:bg-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-900/20">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            {method === 'post' ? 'Buat Pengumuman Baru' : 'Edit Pengumuman'}
                        </h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            {data.status === 'published' ? (
                                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Siap Ditayangkan ke Publik
                                </span>
                            ) : (
                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                                    <Clock className="h-3.5 w-3.5" /> Draft (Tersimpan Internal)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-md hover:shadow-lg transition-all gap-2 h-10 px-6 rounded-xl flex-1 sm:flex-none font-bold"
                    >
                        {processing ? <Clock className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Content Column (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Navigation Tabs with Error Indicators */}
                    <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-neutral-800/80 rounded-2xl w-full sm:w-fit overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                                activeTab === 'content'
                                    ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <FileText className="h-4 w-4" />
                            <span>Konten Utama</span>
                            {contentErrorsCount > 0 && (
                                <span className="h-4 min-w-4 px-1 rounded-full text-[10px] bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                    {contentErrorsCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('gallery')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                                activeTab === 'gallery'
                                    ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <ImageIcon className="h-4 w-4" />
                            <span>Galeri Foto</span>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-300 font-bold">
                                {totalImagesCount}
                            </span>
                            {galleryErrorsCount > 0 && (
                                <span className="h-4 min-w-4 px-1 rounded-full text-[10px] bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                    {galleryErrorsCount}
                                </span>
                            )}
                        </button>

                        {data.type === 'event' && (
                            <button
                                type="button"
                                onClick={() => setActiveTab('event')}
                                className={cn(
                                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                                    activeTab === 'event'
                                        ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                        : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <Calendar className="h-4 w-4" />
                                <span>Detail Event</span>
                                {eventErrorsCount > 0 && (
                                    <span className="h-4 min-w-4 px-1 rounded-full text-[10px] bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                        {eventErrorsCount}
                                    </span>
                                )}
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setActiveTab('attachments')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                                activeTab === 'attachments'
                                    ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Paperclip className="h-4 w-4" />
                            <span>Lampiran</span>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-300 font-bold">
                                {data.attachments.length}
                            </span>
                            {attachmentErrorsCount > 0 && (
                                <span className="h-4 min-w-4 px-1 rounded-full text-[10px] bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                    {attachmentErrorsCount}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('seo')}
                            className={cn(
                                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                                activeTab === 'seo'
                                    ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Search className="h-4 w-4" />
                            <span>SEO</span>
                            {seoErrorsCount > 0 && (
                                <span className="h-4 min-w-4 px-1 rounded-full text-[10px] bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                    {seoErrorsCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tab 1: Konten Utama */}
                    {activeTab === 'content' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-bold">Judul & Isi Pengumuman</CardTitle>
                                    <CardDescription>Tuliskan judul dan rincian informasi selengkap mungkin</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                            Judul Pengumuman <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Contoh: Jadwal Pelaksanaan Audit Mutu Internal SPMI Semester Gasal..."
                                            className={cn(
                                                "text-lg font-bold h-12 px-4 rounded-xl border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50 transition-all",
                                                errors.title && "border-red-500 focus:ring-red-500"
                                            )}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="content" className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                                Konten Lengkap <span className="text-red-500">*</span>
                                            </Label>
                                            <span className="text-[11px] text-slate-400">Gunakan tab Galeri Foto untuk mengunggah gambar</span>
                                        </div>
                                        <div className={cn(
                                            "rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
                                            errors.content && "border-red-500"
                                        )}>
                                            <ReactQuill
                                                theme="snow"
                                                value={data.content}
                                                onChange={(value) => setData('content', value)}
                                                className="h-80 mb-12"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, 3, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        [{ 'color': [] }, { 'background': [] }],
                                                        ['link', 'clean']
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

                    {/* Tab 2: Galeri Foto (Multi-Image Manager) */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                <CardHeader className="border-b border-slate-100 dark:border-neutral-800 pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5 text-brand-700 dark:text-gold-400" />
                                                Galeri & Dokumentasi Foto
                                            </CardTitle>
                                            <CardDescription>
                                                Unggah satu atau banyak foto pengumuman (maksimal 10 foto, maks 3MB per foto). Tentukan satu sebagai foto sampul.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-brand-700 hover:bg-brand-800 text-white rounded-xl h-9 text-xs font-bold gap-1.5 shadow-xs"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Tambah Foto</span>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Drag & Drop Upload Zone */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-neutral-950/40 group"
                                    >
                                        <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-gold-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            Klik untuk memilih foto atau seret file ke sini
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                                            Mendukung banyak file sekaligus (JPG, PNG, WebP hingga 3MB)
                                        </p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        className="hidden"
                                        onChange={e => {
                                            handleFilesSelected(e.target.files);
                                            e.target.value = '';
                                        }}
                                    />

                                    {/* Gallery Preview Grid */}
                                    {totalImagesCount === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-400 dark:text-neutral-500 border border-slate-100 dark:border-neutral-800 rounded-2xl">
                                            Belum ada foto yang ditambahkan ke galeri.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 font-medium">
                                                <span>Total {totalImagesCount} foto ({existingList.length} tersimpan, {newImages.length} baru)</span>
                                                <span className="text-[11px] italic">Klik tombol "Jadikan Sampul" untuk memilih foto cover</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Existing Images */}
                                                {existingList.map((img) => {
                                                    const isCover = selectedCoverId === img.id;

                                                    return (
                                                        <div
                                                            key={`existing-${img.id}`}
                                                            className={cn(
                                                                "relative rounded-2xl border p-3 bg-white dark:bg-neutral-950 transition-all flex flex-col gap-3 group",
                                                                isCover
                                                                    ? "border-gold-500 ring-2 ring-gold-400/30 dark:border-gold-500 shadow-md"
                                                                    : "border-slate-200 dark:border-neutral-800 hover:border-slate-300"
                                                            )}
                                                        >
                                                            {/* Image Box */}
                                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-900">
                                                                <img
                                                                    src={`/storage/${img.image_path}`}
                                                                    alt={img.caption || 'Foto'}
                                                                    className="w-full h-full object-cover"
                                                                />

                                                                {/* Cover Badge */}
                                                                {isCover ? (
                                                                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gold-500 text-neutral-950 flex items-center gap-1 shadow-md">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        <span>FOTO SAMPUL</span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setAsCover('existing', img.id)}
                                                                        className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                                                    >
                                                                        <Star className="h-3 w-3" />
                                                                        <span>Jadikan Sampul</span>
                                                                    </button>
                                                                )}

                                                                {/* Delete Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeExistingImage(img.id)}
                                                                    className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                                    title="Hapus foto"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>

                                                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-semibold bg-black/50 text-white backdrop-blur-xs">
                                                                    Tersimpan
                                                                </div>
                                                            </div>

                                                            {/* Caption Input */}
                                                            <div className="space-y-1">
                                                                <Input
                                                                    placeholder="Tulis keterangan foto ini..."
                                                                    value={existingCaptions[img.id] ?? ''}
                                                                    onChange={e => setExistingCaptions(prev => ({ ...prev, [img.id]: e.target.value }))}
                                                                    className="h-8 text-xs rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* New Uploads */}
                                                {newImages.map((item, idx) => {
                                                    const isCover = newCoverIndex === idx;

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={cn(
                                                                "relative rounded-2xl border p-3 bg-white dark:bg-neutral-950 transition-all flex flex-col gap-3 group",
                                                                isCover
                                                                    ? "border-gold-500 ring-2 ring-gold-400/30 dark:border-gold-500 shadow-md"
                                                                    : "border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400"
                                                            )}
                                                        >
                                                            {/* Image Box */}
                                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-900">
                                                                <img
                                                                    src={item.preview}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />

                                                                {/* Cover Badge */}
                                                                {isCover ? (
                                                                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gold-500 text-neutral-950 flex items-center gap-1 shadow-md">
                                                                        <Star className="h-3 w-3 fill-current" />
                                                                        <span>FOTO SAMPUL</span>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setAsCover('new', idx)}
                                                                        className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-1"
                                                                    >
                                                                        <Star className="h-3 w-3" />
                                                                        <span>Jadikan Sampul</span>
                                                                    </button>
                                                                )}

                                                                {/* Delete Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeNewImage(idx)}
                                                                    className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                                    title="Batal unggah"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>

                                                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-600 text-white">
                                                                    Baru
                                                                </div>
                                                            </div>

                                                            {/* Caption Input */}
                                                            <div className="space-y-1">
                                                                <Input
                                                                    placeholder="Tulis keterangan foto ini..."
                                                                    value={item.caption}
                                                                    onChange={e => {
                                                                        const val = e.target.value;
                                                                        setNewImages(prev => prev.map((img, i) => i === idx ? { ...img, caption: val } : img));
                                                                    }}
                                                                    className="h-8 text-xs rounded-lg"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tab 3: Detail Event (Conditional) */}
                    {activeTab === 'event' && data.type === 'event' && (
                        <div className="animate-in fade-in duration-300">
                            <Card className="border-2 border-gold-400/40 bg-gold-50/30 dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xs">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                                        Informasi Pelaksanaan Agenda
                                    </CardTitle>
                                    <CardDescription>Jadwal, waktu, dan lokasi acara yang akan ditampilkan kepada peserta</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="event_start_at" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Waktu Mulai <span className="text-red-500">*</span>
                                        </Label>
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
                                        <Label htmlFor="event_end_at" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Waktu Selesai <span className="text-red-500">*</span>
                                        </Label>
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
                                        <Label htmlFor="event_location" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Lokasi / Ruangan Acara <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="event_location"
                                                value={data.event_detail.location}
                                                onChange={e => updateEventDetail('location', e.target.value)}
                                                placeholder="Contoh: Auditorium Prof. Tabrani Rab / Zoom Meeting"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                        </div>
                                        <InputError message={errors['event_detail.location']} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event_speaker" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Narasumber / Pemateri
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="event_speaker"
                                                value={data.event_detail.speaker}
                                                onChange={e => updateEventDetail('speaker', e.target.value)}
                                                placeholder="Nama lengkap & gelar"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="event_quota" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Kuota Peserta (Opsional)
                                        </Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="event_quota"
                                                type="number"
                                                value={data.event_detail.quota}
                                                onChange={e => updateEventDetail('quota', e.target.value)}
                                                placeholder="Contoh: 150"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="event_registration_link" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            Tautan Pendaftaran (Opsional)
                                        </Label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="event_registration_link"
                                                type="url"
                                                value={data.event_detail.registration_link}
                                                onChange={e => updateEventDetail('registration_link', e.target.value)}
                                                placeholder="https://form.univrab.ac.id/pendaftaran-event"
                                                className="pl-10 h-11 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tab 4: Lampiran Dokumen & Tautan */}
                    {activeTab === 'attachments' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                <CardHeader className="border-b border-slate-100 dark:border-neutral-800 pb-4">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <div>
                                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                                <Paperclip className="h-5 w-5 text-brand-700 dark:text-gold-400" />
                                                Lampiran Berkas & Tautan
                                            </CardTitle>
                                            <CardDescription>Tambahkan dokumen PDF/Word atau tautan eksternal</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addAttachment('file')}
                                                className="rounded-xl text-xs font-bold h-9"
                                            >
                                                <Plus className="h-4 w-4 mr-1 text-brand-700" /> Dokumen Berkas
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addAttachment('link')}
                                                className="rounded-xl text-xs font-bold h-9"
                                            >
                                                <Plus className="h-4 w-4 mr-1 text-brand-700" /> Tautan URL
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {data.attachments.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl">
                                            <Paperclip className="h-10 w-10 mb-3 opacity-30 text-slate-400" />
                                            <p className="text-sm font-semibold text-slate-600 dark:text-neutral-400">Belum ada lampiran ditambahkan</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Pilih tombol "Dokumen Berkas" atau "Tautan URL" di atas</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data.attachments.map((attachment, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col p-4 border border-slate-200 dark:border-neutral-800 rounded-2xl bg-slate-50/50 dark:bg-neutral-950/50 group relative gap-3"
                                                >
                                                    <button
                                                        type="button"
                                                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                                        onClick={() => removeAttachment(index)}
                                                        title="Hapus lampiran"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <div className="flex items-center gap-3 pr-8">
                                                        <div className={cn(
                                                            "h-9 w-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 font-bold",
                                                            attachment.type === 'link' ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-gold-400"
                                                        )}>
                                                            {attachment.type === 'link' ? <LinkIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                        </div>
                                                        <Input
                                                            className="border-none bg-transparent font-bold focus-visible:ring-0 h-8 px-0 text-sm"
                                                            value={attachment.title}
                                                            onChange={e => updateAttachment(index, 'title', e.target.value)}
                                                            placeholder="Judul / Nama Berkas..."
                                                        />
                                                    </div>

                                                    {attachment.type === 'link' ? (
                                                        <div className="relative">
                                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                            <Input
                                                                type="url"
                                                                className="h-9 pl-9 rounded-xl bg-white dark:bg-neutral-900 text-xs"
                                                                value={attachment.path || ''}
                                                                onChange={e => updateAttachment(index, 'path', e.target.value)}
                                                                placeholder="https://univrab.ac.id/dokumen.pdf"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1">
                                                            <Input
                                                                type="file"
                                                                className="h-9 rounded-xl bg-white dark:bg-neutral-900 text-xs file:bg-transparent file:border-none file:text-brand-700 dark:file:text-gold-400 file:font-bold"
                                                                onChange={e => updateAttachment(index, 'file', e.target.files?.[0] || null)}
                                                            />
                                                            {attachment.path && (
                                                                <p className="text-[10px] text-muted-foreground truncate">
                                                                    File saat ini: {attachment.path.split('/').pop()}
                                                                </p>
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

                    {/* Tab 5: SEO & Metadata */}
                    {activeTab === 'seo' && (
                        <div className="animate-in fade-in duration-300">
                            <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-brand-700 dark:text-gold-400" />
                                        Optimasi SEO & Pencarian Google
                                    </CardTitle>
                                    <CardDescription>Bantu pengumuman terindeks rapi dan tampil profesional saat dibagikan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            SEO Meta Title (Opsional)
                                        </Label>
                                        <Input
                                            id="meta_title"
                                            value={data.meta_title}
                                            onChange={e => setData('meta_title', e.target.value)}
                                            placeholder="Biarkan kosong untuk otomatis memakai judul utama"
                                            className="h-11 rounded-xl"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Panjang disarankan: 50–60 karakter</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description" className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                                            SEO Meta Description (Opsional)
                                        </Label>
                                        <Textarea
                                            id="meta_description"
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            placeholder="Ringkasan singkat untuk hasil pencarian Google dan pesan WhatsApp..."
                                            className="min-h-[100px] rounded-xl"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Panjang disarankan: 150–160 karakter</p>
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-neutral-950/50 rounded-2xl border border-slate-200/80 dark:border-neutral-800 space-y-2">
                                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Pratinjau Hasil Pencarian Google
                                        </h4>
                                        <div className="space-y-1">
                                            <div className="text-brand-700 dark:text-gold-400 font-bold text-base truncate">
                                                {data.meta_title || data.title || 'Judul Pengumuman Anda'}
                                            </div>
                                            <div className="text-emerald-700 dark:text-emerald-400 text-xs truncate">
                                                {window.location.origin}/announcements/{initialData?.slug || 'slug-pengumuman'}
                                            </div>
                                            <div className="text-slate-600 dark:text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                                                {data.meta_description || (data.content ? data.content.replace(/<[^>]*>/g, '').substring(0, 160) : 'Ringkasan isi pengumuman akan ditampilkan di sini...')}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Right Sidebar Column (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Atribut & Status Publikasi */}
                    <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Settings className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                Atribut Publikasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Content Type Selector */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Tipe Konten
                                </Label>
                                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-neutral-800 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'regular')}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            data.type === 'regular'
                                                ? "bg-white dark:bg-neutral-900 shadow-xs text-brand-700 dark:text-gold-400"
                                                : "text-slate-500 dark:text-neutral-400 hover:text-slate-800"
                                        )}
                                    >
                                        REGULER
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'event')}
                                        className={cn(
                                            "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            data.type === 'event'
                                                ? "bg-white dark:bg-neutral-900 shadow-xs text-gold-600 dark:text-gold-400"
                                                : "text-slate-500 dark:text-neutral-400 hover:text-slate-800"
                                        )}
                                    >
                                        EVENT / AGENDA
                                    </button>
                                </div>
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="category_id" className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Kategori <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.category_id} onValueChange={val => setData('category_id', val)}>
                                    <SelectTrigger id="category_id" className="h-11 rounded-xl">
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

                            {/* Status Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Status Publikasi
                                </Label>
                                <Select value={data.status} onValueChange={val => setData('status', val as 'draft' | 'published')}>
                                    <SelectTrigger id="status" className="h-11 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft (Tersimpan Internal)</SelectItem>
                                        <SelectItem value="published">Published (Ditayangkan Umum)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Featured Toggle */}
                            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-neutral-950/50 rounded-2xl border border-slate-200/60 dark:border-neutral-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 rounded-lg bg-gold-50 dark:bg-gold-950/60 text-gold-600 dark:text-gold-400 flex items-center justify-center">
                                        <Star className="h-4 w-4 fill-current" />
                                    </div>
                                    <div>
                                        <Label htmlFor="is_featured" className="text-xs font-bold cursor-pointer block">
                                            Sematkan (Featured)
                                        </Label>
                                        <span className="text-[10px] text-slate-400">Tampil di sorotan beranda</span>
                                    </div>
                                </div>
                                <Switch
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={checked => setData('is_featured', checked)}
                                />
                            </div>

                            {/* Published At */}
                            <div className="space-y-2">
                                <Label htmlFor="published_at" className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Jadwal Publikasi
                                </Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={e => setData('published_at', e.target.value)}
                                        className="pl-10 h-11 rounded-xl"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Kosongkan untuk otomatis tayang saat status "Published"</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Foto Sampul Utama (Cover Preview Card) */}
                    <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                    Foto Sampul Utama
                                </CardTitle>
                                {totalImagesCount > 0 && (
                                    <Badge variant="secondary" className="text-[10px] font-bold">
                                        {totalImagesCount} Foto
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 flex items-center justify-center group">
                                {coverPreviewUrl ? (
                                    <>
                                        <img src={coverPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => setActiveTab('gallery')}
                                                className="bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs gap-1.5 shadow-md"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                <span>Ganti di Galeri</span>
                                            </Button>
                                        </div>
                                        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-neutral-950 shadow-xs flex items-center gap-1">
                                            <Star className="h-2.5 w-2.5 fill-current" />
                                            <span>Sampul Aktif</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6 space-y-2">
                                        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-400 flex items-center justify-center mx-auto">
                                            <ImageIcon className="h-5 w-5" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-500 dark:text-neutral-400">Belum ada foto sampul</p>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setActiveTab('gallery')}
                                            className="text-xs rounded-xl h-8"
                                        >
                                            Kelola Galeri Foto
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setActiveTab('gallery')}
                                className="w-full rounded-xl text-xs font-bold h-10 border-slate-200 dark:border-neutral-800 hover:border-brand-700 hover:text-brand-700"
                            >
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                <span>Buka Manajemen Galeri ({totalImagesCount} foto)</span>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Hint / Tips Card */}
                    <Card className="border-none bg-gradient-to-br from-brand-800 to-plum-950 text-white rounded-3xl overflow-hidden shadow-lg shadow-brand-900/20">
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 text-gold-400">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-gold-300">Tips Dokumentasi</h4>
                                    <p className="text-xs text-white/80 leading-relaxed">
                                        Unggah 3–5 foto kegiatan untuk meningkatkan interaksi. Foto pertama atau bertanda bintang emas akan otomatis menjadi cover kartu beranda dan thumbnail media sosial.
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
