import { Link } from '@inertiajs/react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { getDateBadgeParts } from '@/lib/format';

interface EventCardProps {
    event: any;
    className?: string;
}

export default function EventCard({ event, className = '' }: EventCardProps) {
    const detailUrl = `/announcements/${event.slug}`;
    const eventDetail = event.event_detail;
    const dateSource = eventDetail?.start_at || event.published_at;
    const { day, month, year } = getDateBadgeParts(dateSource);

    return (
        <article className={`group flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
            {/* Big Date Badge (Univrab Agenda style) */}
            <div className="shrink-0 w-18 h-22 rounded-2xl bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-900/60 flex flex-col items-center justify-center text-center p-2 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-black text-brand-700 dark:text-brand-300 leading-none">
                    {day}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700/80 dark:text-brand-300/80 mt-1">
                    {month}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-medium">
                    {year}
                </span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch overflow-hidden">
                <div className="min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 break-words overflow-hidden group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors leading-snug">
                        <Link href={detailUrl} className="break-words">{event.title}</Link>
                    </h3>

                    <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-neutral-400">
                        {eventDetail?.location && (
                            <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-700 dark:text-gold-400" />
                                <span className="truncate">{eventDetail.location}</span>
                            </div>
                        )}
                        {eventDetail?.start_at && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-neutral-500">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span>
                                    {new Date(eventDetail.start_at).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}{' '}
                                    WIB
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2 pt-2 flex justify-end">
                    <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-gold-400 hover:underline"
                    >
                        <span>Detail Agenda</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
