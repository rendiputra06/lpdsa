import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Tag, MapPin, Users, LinkIcon, FileText, Settings } from 'lucide-react';
import type { AnnouncementDetail } from '@/types/announcement';

type ShowProps = {
    announcement: AnnouncementDetail;
};

export default function Show({ announcement }: ShowProps) {
    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatEventDate = (date: string | null) => {
        if (!date) return '-';
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
            <Head title={announcement.title} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/announcements">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Pengumuman</h1>
                        <p className="text-muted-foreground text-sm">Lihat informasi lengkap pengumuman</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl mb-2">{announcement.title}</CardTitle>
                                <CardDescription className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {announcement.author?.name || 'Unknown'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(announcement.created_at)}
                                    </span>
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                                    {announcement.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                                <Badge variant="outline">
                                    {announcement.type === 'event' ? 'Event' : 'Reguler'}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {announcement.thumbnail && (
                            <div className="w-full max-w-2xl">
                                <img
                                    src={`/storage/${announcement.thumbnail}`}
                                    alt={announcement.title}
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Tag className="h-4 w-4" />
                            <span>Kategori: {announcement.category?.name || 'Uncategorized'}</span>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Konten
                            </h3>
                            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                                {announcement.content}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Informasi Publikasi
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                                            {announcement.status === 'published' ? 'Published' : 'Draft'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tipe:</span>
                                        <span>{announcement.type === 'event' ? 'Event' : 'Reguler'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Dibuat:</span>
                                        <span>{formatDate(announcement.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Diperbarui:</span>
                                        <span>{formatDate(announcement.updated_at)}</span>
                                    </div>
                                    {announcement.published_at && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Dipublikasikan:</span>
                                            <span>{formatDate(announcement.published_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {announcement.type === 'event' && announcement.eventDetail && (
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Detail Event
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Waktu Mulai:</span>
                                            <span>{formatEventDate(announcement.eventDetail.start_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Waktu Selesai:</span>
                                            <span>{formatEventDate(announcement.eventDetail.end_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Lokasi:</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {announcement.eventDetail.location}
                                            </span>
                                        </div>
                                        {announcement.eventDetail.speaker && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Speaker:</span>
                                                <span>{announcement.eventDetail.speaker}</span>
                                            </div>
                                        )}
                                        {announcement.eventDetail.quota && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Kuota:</span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {announcement.eventDetail.quota} peserta
                                                </span>
                                            </div>
                                        )}
                                        {announcement.eventDetail.registration_link && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Link Pendaftaran:</span>
                                                <a
                                                    href={announcement.eventDetail.registration_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                                >
                                                    <LinkIcon className="h-3 w-3" />
                                                    Buka Link
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-3">
                            <Link href={`/admin/announcements/${announcement.id}/edit`}>
                                <Button>Edit</Button>
                            </Link>
                        </div>
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
