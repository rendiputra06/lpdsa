import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, ExternalLink, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Show({ announcement }: any) {
    return (
        <>
            <Head title={announcement.title} />

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <nav className="mb-8 flex text-sm text-slate-500">
                    <Link href="/announcements" className="hover:text-univrab-blue">Pengumuman</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-900 dark:text-white font-medium truncate">{announcement.title}</span>
                </nav>

                <header className="mb-8">
                    <Badge className="mb-4 bg-univrab-blue">{announcement.category.name}</Badge>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl leading-tight">
                        {announcement.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(announcement.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {announcement.author.name}
                        </div>
                    </div>
                </header>

                {announcement.thumbnail && (
                    <div className="mb-10 overflow-hidden rounded-xl bg-slate-100 dark:bg-neutral-800">
                        <img src={announcement.thumbnail} alt="" className="w-full object-cover" />
                    </div>
                )}

                {/* Event Detail Block */}
                {announcement.type === 'event' && announcement.event_detail && (
                    <div className="mb-10 rounded-xl border border-univrab-gold/30 bg-yellow-50 p-6 dark:bg-neutral-900 dark:border-univrab-gold/20">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-univrab-gold" /> Detail Event
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 text-slate-700 dark:text-neutral-300">
                                <Clock className="h-4 w-4 text-slate-400" />
                                <span>{new Date(announcement.event_detail.start_at).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-neutral-300">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span>{announcement.event_detail.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-neutral-300">
                                <User className="h-4 w-4 text-slate-400" />
                                <span>Speaker: {announcement.event_detail.speaker || '-'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700 dark:text-neutral-300">
                                <Users className="h-4 w-4 text-slate-400" />
                                <span>Kuota: {announcement.event_detail.quota || 'Tidak Terbatas'}</span>
                            </div>
                        </div>
                        {announcement.event_detail.registration_link && (
                            <Button className="mt-6 bg-univrab-gold text-slate-900 hover:bg-yellow-500 w-full sm:w-auto" asChild>
                                <a href={announcement.event_detail.registration_link} target="_blank">Daftar Sekarang</a>
                            </Button>
                        )}
                    </div>
                )}

                <article className="prose prose-slate dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: announcement.content }} />

                {/* Attachments */}
                {announcement.attachments.length > 0 && (
                    <div className="border-t border-slate-200 pt-8 dark:border-neutral-800">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Lampiran</h3>
                        <div className="space-y-3">
                            {announcement.attachments.map((file: any) => (
                                <a
                                    key={file.id}
                                    href={file.path}
                                    target="_blank"
                                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-univrab-blue hover:bg-slate-50 transition-all dark:border-neutral-800 dark:hover:bg-neutral-900 group"
                                >
                                    <div className="flex items-center gap-3">
                                        {file.type === 'file' ? <FileText className="h-5 w-5 text-slate-400" /> : <ExternalLink className="h-5 w-5 text-slate-400" />}
                                        <span className="text-sm font-medium text-slate-700 dark:text-neutral-300 group-hover:text-univrab-blue">{file.title}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        {file.type === 'file' ? 'Download' : 'Buka Link'}
                                    </Button>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
