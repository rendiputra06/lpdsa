import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AnnouncementForm from '@/components/announcement-form';
import { ArrowLeft } from 'lucide-react';
import type { AnnouncementDetail, AnnouncementCategory } from '@/types/announcement';

type EditProps = {
    announcement: AnnouncementDetail;
    categories: AnnouncementCategory[];
};

export default function Edit({ announcement, categories }: EditProps) {
    const formatDatetimeLocal = (date: string | null | undefined) => {
        if (!date) return '';
        const d = new Date(date);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    return (
        <>
            <Head title="Edit Pengumuman" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Pengumuman</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Perbarui informasi pengumuman &middot; <span className="text-muted-foreground/70">{announcement.title}</span>
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/announcements">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <AnnouncementForm
                    categories={categories}
                    initialData={{
                        title: announcement.title,
                        category_id: announcement.category_id.toString(),
                        content: announcement.content,
                        status: announcement.status,
                        type: announcement.type,
                        published_at: formatDatetimeLocal(announcement.published_at),
                        thumbnail: null,
                        event_detail: announcement.eventDetail
                            ? {
                                start_at: formatDatetimeLocal(announcement.eventDetail.start_at),
                                end_at: formatDatetimeLocal(announcement.eventDetail.end_at),
                                location: announcement.eventDetail.location,
                                speaker: announcement.eventDetail.speaker,
                                quota: announcement.eventDetail.quota,
                                registration_link: announcement.eventDetail.registration_link,
                            }
                            : {
                                start_at: '',
                                end_at: '',
                                location: '',
                                speaker: '',
                                quota: '',
                                registration_link: '',
                            },
                    }}
                    submitUrl={`/admin/announcements/${announcement.id}`}
                    method="put"
                    submitLabel="Update Pengumuman"
                    thumbnailUrl={announcement.thumbnail}
                />
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengumuman', href: '/admin/announcements' },
        { title: 'Edit Pengumuman', href: '#' },
    ],
};
