import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Megaphone, 
    Tags, 
    Users, 
    Clock, 
    FileText, 
    AlertCircle,
    Plus,
    Settings,
    Eye,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { dashboard } from '@/routes';
import type { DashboardProps } from '@/types/dashboard';

export default function Dashboard({ stats, recentAnnouncements, recentLogs }: DashboardProps) {
    // Error handling untuk stats undefined
    const safeStats = stats || {
        totalAnnouncements: 0,
        totalCategories: 0,
        totalUsers: 0,
        pendingAnnouncements: 0,
    };

    const safeAnnouncements = recentAnnouncements || [];
    const safeLogs = recentLogs || [];

    return (
        <>
            <Head title="Dashboard" />

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Selamat datang kembali. Berikut ringkasan aktivitas sistem hari ini.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Total Pengumuman
                        </CardTitle>
                        <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                            <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {safeStats.totalAnnouncements}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            {safeStats.pendingAnnouncements > 0 ? (
                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
                                    {safeStats.pendingAnnouncements} Draft
                                </Badge>
                            ) : (
                                <p className="text-xs text-slate-500">Tidak ada draft</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Kategori
                        </CardTitle>
                        <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/30">
                            <Tags className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {safeStats.totalCategories}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Kategori aktif</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Pengguna
                        </CardTitle>
                        <div className="rounded-md bg-violet-100 p-2 dark:bg-violet-900/30">
                            <Users className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {safeStats.totalUsers}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Pengguna terdaftar</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Aktivitas 24h
                        </CardTitle>
                        <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900/30">
                            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {safeLogs.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Log terbaru</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Aksi Cepat
                </h2>
                <div className="flex flex-wrap gap-2">
                    <Button size="sm" asChild>
                        <Link href="/admin/announcements/create">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Buat Pengumuman
                        </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/admin/announcements">
                            <Eye className="mr-1.5 h-4 w-4" />
                            Lihat Semua
                        </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                        <Link href="/settings/profile">
                            <Settings className="mr-1.5 h-4 w-4" />
                            Pengaturan
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Recent Announcements - Takes 4 columns */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Pengumuman Terbaru</CardTitle>
                                <CardDescription>
                                    {safeAnnouncements.length} pengumuman ditemukan
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/announcements" className="gap-1">
                                    Lihat Semua
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {safeAnnouncements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800 mb-3">
                                    <FileText className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Belum ada pengumuman
                                </p>
                                <p className="text-xs text-slate-500 mt-1 mb-3">
                                    Mulai dengan membuat pengumuman pertama
                                </p>
                                <Button size="sm" asChild>
                                    <Link href="/admin/announcements/create">
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Buat Pengumuman
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {safeAnnouncements.map((announcement, index) => (
                                    <Link
                                        key={announcement.id}
                                        href={`/admin/announcements/${announcement.id}`}
                                        className="group flex items-center gap-4 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                                    {announcement.title}
                                                </p>
                                                {announcement.status === 'draft' && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        Draft
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{announcement.category?.name || 'Tanpa Kategori'}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(announcement.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Logs - Takes 3 columns */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
                                <CardDescription>
                                    Riwayat aktivitas sistem
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/activity-logs" className="gap-1">
                                    Log
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {safeLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800 mb-3">
                                    <AlertCircle className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    Belum ada aktivitas
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Aktivitas akan muncul di sini
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {safeLogs.map((log) => (
                                    <div key={log.id} className="flex gap-3">
                                        <div className="relative mt-1">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                <Clock className="h-3 w-3 text-slate-500" />
                                            </div>
                                            {log.id !== safeLogs[safeLogs.length - 1]?.id && (
                                                <div className="absolute left-1/2 top-6 h-full w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-sm text-slate-900 dark:text-slate-100">
                                                {log.activity}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                                <span className="font-medium">{log.user?.name || 'System'}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(log.created_at).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
