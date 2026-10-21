import { Link } from '@inertiajs/react';
import {
    Award,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileText,
    History,
    Plus,
} from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Accreditation } from '@/types/accreditation';

interface AccreditationTimelineProps {
    items: Accreditation[];
    currentId?: number;
    showAddButton?: boolean;
    academicUnitId?: number | null;
    unitName?: string;
    isAdmin?: boolean;
}

export default function AccreditationTimeline({
    items,
    currentId,
    showAddButton = false,
    academicUnitId,
    unitName,
    isAdmin = false,
}: AccreditationTimelineProps) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
                <History className="h-8 w-8 text-slate-300 dark:text-neutral-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-neutral-300">Belum Ada Riwayat Periode</p>
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
                    Ini adalah periode akreditasi pertama yang tercatat untuk entitas ini.
                </p>
            </div>
        );
    }

    const getGradeBadge = (grade: string) => {
        const lower = grade.toLowerCase();
        if (lower.includes('unggul') || lower === 'a') {
            return (
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] px-2 py-0.5">
                    ★ {grade}
                </Badge>
            );
        }
        if (lower.includes('baik sekali') || lower === 'b') {
            return (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] px-2 py-0.5">
                    {grade}
                </Badge>
            );
        }
        if (lower.includes('baik') || lower === 'c') {
            return (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] px-2 py-0.5">
                    {grade}
                </Badge>
            );
        }
        return <Badge variant="secondary" className="text-[11px] px-2 py-0.5">{grade}</Badge>;
    };

    const getPeriodYears = (item: Accreditation) => {
        const startYear = item.sk_date ? new Date(item.sk_date).getFullYear() : null;
        const endYear = item.valid_until ? new Date(item.valid_until).getFullYear() : null;

        if (startYear && endYear) {
            return `${startYear} – ${endYear}`;
        }
        if (endYear) {
            return `s.d. ${endYear}`;
        }
        return 'Periode Terdaftar';
    };

    const isCurrentActive = (item: Accreditation, index: number) => {
        if (index === 0 && item.status === 'active') {
            if (!item.valid_until) return true;
            return new Date(item.valid_until) >= new Date();
        }
        return false;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-[#8B142C] dark:text-red-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Riwayat Akreditasi ({items.length} Periode)
                    </h3>
                </div>
                {showAddButton && isAdmin && academicUnitId && (
                    <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-7 text-[11px] gap-1 border-slate-300 dark:border-neutral-700 text-[#8B142C] dark:text-red-400 hover:bg-brand-50 dark:hover:bg-brand-950/40"
                    >
                        <Link href={`/admin/accreditations/create?academic_unit_id=${academicUnitId}`}>
                            <Plus className="h-3 w-3" />
                            <span>Periode Baru</span>
                        </Link>
                    </Button>
                )}
            </div>

            {unitName && (
                <p className="text-xs text-slate-500 dark:text-neutral-400 -mt-2">
                    Kronologi sertifikasi untuk <span className="font-semibold text-slate-700 dark:text-neutral-200">{unitName}</span>
                </p>
            )}

            {/* Vertical Timeline */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-neutral-800">
                {items.map((item, idx) => {
                    const isSelected = currentId === item.id;
                    const isActive = isCurrentActive(item, idx);

                    return (
                        <div key={item.id} className="relative group">
                            {/* Dot / Indicator */}
                            <div
                                className={`absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected
                                        ? 'bg-[#8B142C] border-[#8B142C] text-white shadow-sm ring-4 ring-brand-100 dark:ring-brand-950/70'
                                        : isActive
                                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                                          : 'bg-white dark:bg-neutral-900 border-slate-300 dark:border-neutral-700 text-slate-400'
                                }`}
                            >
                                {isActive ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                ) : isSelected ? (
                                    <Award className="h-3 w-3" />
                                ) : (
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                )}
                            </div>

                            {/* Card Box */}
                            <div
                                className={`p-3.5 rounded-xl border transition-all text-xs ${
                                    isSelected
                                        ? 'bg-brand-50/70 dark:bg-brand-950/30 border-brand-200 dark:border-brand-900 shadow-xs'
                                        : 'bg-white dark:bg-neutral-900/80 border-slate-200 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-700 shadow-xs'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                                                Periode {getPeriodYears(item)}
                                            </span>
                                            {isActive && (
                                                <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-semibold">
                                                    Aktif Saat Ini
                                                </Badge>
                                            )}
                                            {isSelected && (
                                                <Badge className="bg-brand-100 dark:bg-brand-950 text-[#8B142C] dark:text-red-300 border border-brand-200 text-[10px] px-1.5 py-0 font-semibold">
                                                    Sedang Diedit
                                                </Badge>
                                            )}
                                            {!isActive && !isSelected && item.status === 'expired' && (
                                                <Badge variant="outline" className="text-slate-500 dark:text-neutral-400 text-[10px] px-1.5 py-0">
                                                    Arsip Riwayat
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-slate-600 dark:text-neutral-300 mt-1 text-[11px] font-medium flex items-center gap-1">
                                            <span>{item.accreditation_body}</span>
                                            <span>&bull;</span>
                                            <span className="font-mono text-slate-500 dark:text-neutral-400 truncate max-w-[160px]" title={item.sk_number}>
                                                SK: {item.sk_number}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="shrink-0">
                                        {getGradeBadge(item.grade)}
                                    </div>
                                </div>

                                {/* Validity & Certificate Links */}
                                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between gap-2 text-[11px]">
                                    <div className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
                                        <Calendar className="h-3 w-3 text-slate-400" />
                                        <span>
                                            Hingga: {item.valid_until ? new Date(item.valid_until).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            }) : 'Belum ditentukan'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {item.certificate_file && (
                                            <a
                                                href={`/storage/${item.certificate_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                                                title="Unduh Salinan Sertifikat"
                                            >
                                                <Download className="h-3 w-3" />
                                                <span>Sertifikat</span>
                                            </a>
                                        )}

                                        {isAdmin && !isSelected && (
                                            <Link
                                                href={`/admin/accreditations/${item.id}/edit`}
                                                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white font-medium hover:underline ml-1"
                                                title="Edit data periode ini"
                                            >
                                                <span>Edit</span>
                                                <ExternalLink className="h-2.5 w-2.5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
