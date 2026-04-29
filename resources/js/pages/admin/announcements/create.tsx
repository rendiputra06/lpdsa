import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AnnouncementForm from '@/components/announcement-form';
import { ArrowLeft } from 'lucide-react';
import type { AnnouncementCategory } from '@/types/announcement';

type CreateProps = {
    categories: AnnouncementCategory[];
};

export default function Create({ categories }: CreateProps) {
    return (
        <>
            <Head title="Tambah Pengumuman" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tambah Pengumuman Baru</h1>
                        <p className="text-muted-foreground text-sm mt-1">Buat pengumuman baru untuk sivitas akademika</p>
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
                    submitUrl="/admin/announcements"
                    method="post"
                    submitLabel="Simpan Pengumuman"
                />
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen Pengumuman', href: '/admin/announcements' },
        { title: 'Tambah Pengumuman', href: '/admin/announcements/create' },
    ],
};
