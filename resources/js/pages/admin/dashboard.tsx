import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Tags, Users, Clock, History } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
];

export default function Dashboard({ stats, recentAnnouncements, recentLogs }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Pengumuman</CardTitle>
                        <Megaphone className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
                        <p className="text-xs text-slate-500">{stats.pendingAnnouncements} Draft</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                        <Tags className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCategories}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Log Hari Ini</CardTitle>
                        <History className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentLogs.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Pengumuman Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentAnnouncements.map((announcement: any) => (
                                <div key={announcement.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{announcement.title}</p>
                                        <p className="text-xs text-slate-500">{announcement.category.name}</p>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {new Date(announcement.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLogs.map((log: any) => (
                                <div key={log.id} className="flex items-start gap-3 border-b pb-2 last:border-0">
                                    <Clock className="h-4 w-4 mt-0.5 text-slate-400" />
                                    <div>
                                        <p className="text-sm">{log.activity}</p>
                                        <p className="text-xs text-slate-500">
                                            {log.user?.name} • {new Date(log.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
