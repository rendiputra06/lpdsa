import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User, FileText, ExternalLink, Image as ImageIcon, Star, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AnnouncementDetail } from '@/types/announcement';

type ShowProps = {
    announcement: AnnouncementDetail;
};

export default function Show({ announcement }: ShowProps) {
    const formatDate = (date: string | null) => {
        if (!date) {
return '-';
}

        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatEventDate = (date: string | null) => {
        if (!date) {
return '-';
}

        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`Detail: ${announcement.title}`} />

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/announcements">
                            <Button variant="ghost" size="icon" className="rounded-xl">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Detail Pengumuman</h1>
                            <p className="text-muted-foreground text-xs mt-0.5">Informasi konten, jadwal, dan galeri dokumentasi</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="rounded-xl text-xs font-semibold gap-1.5 h-9">
                            <a href={`/announcements/${announcement.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                                <span>Lihat di Web Publik</span>
                            </a>
                        </Button>
                        <Button asChild className="bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs gap-1.5 h-9 shadow-xs">
                            <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit Pengumuman</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="border border-slate-200/80 dark:border-neutral-800 shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-neutral-900">
                    <CardHeader className="border-b border-slate-100 dark:border-neutral-800 pb-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-brand-700 dark:text-gold-400">
                                        {announcement.category?.name || 'Umum'}
                                    </span>
                                    {announcement.is_featured && (
                                        <Badge className="bg-gold-500 text-neutral-950 font-bold text-[10px] gap-1">
                                            <Star className="h-2.5 w-2.5 fill-current" />
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                    {announcement.title}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                                        <User className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                                        Ditulis oleh: <strong>{announcement.author?.name || 'Admin'}</strong>
                                    </span>
                                    <span>&middot;</span>
                                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-neutral-400">
                                        <Calendar className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                                        Dibuat: {formatDate(announcement.created_at)}
                                    </span>
                                </CardDescription>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <Badge
                                    variant="outline"
                                    className={
                                        announcement.status === 'published'
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold'
                                            : 'border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 font-semibold'
                                    }
                                >
                                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                                        announcement.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'
                                    }`} />
                                    {announcement.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className={
                                        announcement.type === 'event'
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                                            : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300'
                                    }
                                >
                                    {announcement.type === 'event' ? 'Agenda / Event' : 'Reguler'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 p-6 sm:p-8">
                        {/* Event Detail Widget if Event */}
                        {announcement.type === 'event' && announcement.event_detail && (
                            <div className="rounded-2xl border-2 border-gold-400/40 bg-gold-50/40 dark:bg-neutral-950 p-6 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                                    Informasi Pelaksanaan Agenda
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Waktu Mulai:</span>
                                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                                            {formatEventDate(announcement.event_detail.start_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Waktu Selesai:</span>
                                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                                            {formatEventDate(announcement.event_detail.end_at)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-0.5">Lokasi / Ruangan:</span>
                                        <span className="font-bold text-slate-800 dark:text-neutral-200">
                                            {announcement.event_detail.location}
                                        </span>
                                    </div>
                                    {announcement.event_detail.speaker && (
                                        <div>
                                            <span className="text-slate-500 block mb-0.5">Narasumber:</span>
                                            <span className="font-bold text-slate-800 dark:text-neutral-200">
                                                {announcement.event_detail.speaker}
                                            </span>
                                        </div>
                                    )}
                                    {announcement.event_detail.quota && (
                                        <div>
                                            <span className="text-slate-500 block mb-0.5">Kuota:</span>
                                            <span className="font-bold text-slate-800 dark:text-neutral-200">
                                                {announcement.event_detail.quota} peserta
                                            </span>
                                        </div>
                                    )}
                                    {announcement.event_detail.registration_link && (
                                        <div>
                                            <span className="text-slate-500 block mb-0.5">Tautan Pendaftaran:</span>
                                            <a
                                                href={announcement.event_detail.registration_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-brand-700 dark:text-gold-400 hover:underline flex items-center gap-1"
                                            >
                                                <span>Buka Tautan</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Photo Gallery Section */}
                        {announcement.images && announcement.images.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-800">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                        Galeri Dokumentasi Foto ({announcement.images.length} foto)
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {announcement.images.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 flex flex-col group shadow-xs"
                                        >
                                            <div className="relative aspect-video">
                                                <img
                                                    src={`/storage/${img.image_path}`}
                                                    alt={img.caption || 'Foto Dokumentasi'}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                {img.is_cover && (
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gold-500 text-neutral-950 shadow-xs flex items-center gap-1">
                                                        <Star className="h-2.5 w-2.5 fill-current" />
                                                        <span>Cover</span>
                                                    </div>
                                                )}
                                            </div>
                                            {img.caption && (
                                                <div className="p-2 text-[11px] text-slate-600 dark:text-neutral-400 truncate">
                                                    {img.caption}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-neutral-800">
                                <FileText className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                Isi Pengumuman
                            </h3>
                            <div 
                                className="prose prose-slate dark:prose-invert max-w-none text-sm break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: announcement.content }} 
                            />
                        </div>

                        {/* Attachments Section */}
                        {announcement.attachments && announcement.attachments.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-neutral-800">
                                    <FileText className="h-4 w-4 text-brand-700 dark:text-gold-400" />
                                    Daftar Lampiran ({announcement.attachments.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {announcement.attachments.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.type === 'link' ? file.path : `/storage/${file.path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-neutral-800 text-xs hover:border-brand-700 transition-colors bg-slate-50/50 dark:bg-neutral-950/50 group"
                                        >
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-700 dark:bg-neutral-800 dark:text-gold-400 flex items-center justify-center shrink-0">
                                                    {file.type === 'file' ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                                                </div>
                                                <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate group-hover:text-brand-700 transition-colors">
                                                    {file.title}
                                                </span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 shrink-0">
                                                {file.type === 'file' ? 'Berkas' : 'Link'}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Show.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengumuman', href: '/admin/announcements' },
        { title: 'Detail', href: '' },
    ],
};
