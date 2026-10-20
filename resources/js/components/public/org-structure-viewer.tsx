import { useState } from 'react';
import {
    Award,
    CheckCircle2,
    ClipboardList,
    Eye,
    GitFork,
    LayoutGrid,
    Mail,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface OrgMember {
    id?: string;
    name: string;
    position: string;
    level: string;
    parentId?: string | null;
    photo?: string | null;
    email?: string;
    responsibilities?: string;
    authorities?: string;
}

export default function OrgStructureViewer({ data }: { data: OrgMember[] }) {
    const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
    const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

    if (!data || data.length === 0) {
        return (
            <div className="py-16 text-center text-sm text-slate-500 bg-slate-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800">
                Data struktur organisasi belum ditambahkan.
            </div>
        );
    }

    // Normalisasi data: memastikan setiap personil memiliki ID unik
    const normalizedData: OrgMember[] = data.map((item, idx) => ({
        ...item,
        id: item.id || `mem_${idx + 1}`,
    }));

    // Lookup map untuk pencarian cepat anggota berdasarkan id
    const memberMap = new Map<string, OrgMember>();
    normalizedData.forEach((item) => {
        if (item.id) {
            memberMap.set(item.id, item);
        }
    });

    // Petakan relasi staf (level 4) ke atasan langsung (parentId)
    const childrenByParent = new Map<string, OrgMember[]>();
    const unassignedStaff: OrgMember[] = [];

    normalizedData.forEach((item) => {
        if (item.level === '4') {
            if (item.parentId && memberMap.has(item.parentId)) {
                const list = childrenByParent.get(item.parentId) || [];
                list.push(item);
                childrenByParent.set(item.parentId, list);
            } else {
                unassignedStaff.push(item);
            }
        }
    });

    // Grouping umum untuk grid mode
    const grouped = normalizedData.reduce((acc: { [level: string]: OrgMember[] }, item: OrgMember) => {
        const level = item.level || '1';
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(item);
        return acc;
    }, {});

    const sortedLevels = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

    // Level utama yang dirender pada bagan pohon (Level 1, 2, 3)
    const mainLevels = ['1', '2', '3'].filter((lvl) =>
        normalizedData.some((m) => m.level === lvl),
    );

    const getLevelTitle = (level: string) => {
        switch (level) {
            case '1':
                return 'Pimpinan Lembaga';
            case '2':
                return 'Sekretaris Lembaga';
            case '3':
                return 'Kepala Bidang & Koordinator Unit';
            case '4':
                return 'Staf Teknis & Pelaksana Mutu';
            default:
                return `Tingkat ${level}`;
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'L';
        return name
            .replace(/^(Dr\.|Prof\.|H\.|Hj\.|Ir\.|M\.)\s*/gi, '')
            .trim()
            .charAt(0)
            .toUpperCase();
    };

    const parseBulletPoints = (text?: string) => {
        if (!text) return [];
        return text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .map((line) => line.replace(/^[-•*]\s*/, ''));
    };

    // Kartu Standar untuk Pimpinan & Kepala Bidang
    const renderStandardCard = (member: OrgMember, level: string) => {
        const isLevel1 = level === '1';
        return (
            <button
                type="button"
                onClick={() => setSelectedMember(member)}
                className={cn(
                    'w-full text-center p-5 rounded-2xl bg-white dark:bg-neutral-900 border transition-all duration-300 group cursor-pointer relative shadow-xs hover:-translate-y-1 hover:shadow-lg',
                    isLevel1
                        ? 'border-brand-300 dark:border-gold-500/60 ring-2 ring-brand-700/10 dark:ring-gold-400/10'
                        : 'border-slate-200/90 dark:border-neutral-800 hover:border-brand-700/70 dark:hover:border-gold-400/70',
                )}
            >
                {/* Avatar Foto dengan Aksen Univrab */}
                <div className="relative inline-block mb-3">
                    <div
                        className={cn(
                            'rounded-full overflow-hidden border-2 bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105',
                            isLevel1
                                ? 'h-20 w-20 border-brand-700 dark:border-gold-400'
                                : 'h-18 w-18 border-slate-200 dark:border-neutral-700 group-hover:border-brand-700 dark:group-hover:border-gold-400',
                        )}
                    >
                        {member.photo ? (
                            <img
                                src={`/storage/${member.photo}`}
                                alt={member.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-linear-to-br from-brand-700 via-brand-850 to-brand-950 flex items-center justify-center text-white font-black text-xl">
                                {getInitials(member.name)}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 right-0 h-6 w-6 rounded-full bg-gold-400 text-neutral-950 flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-neutral-900">
                        <Award className="h-3.5 w-3.5" />
                    </div>
                </div>

                {/* Nama Lengkap & Gelar */}
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors line-clamp-2">
                    {member.name}
                </h4>

                {/* Jabatan */}
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-neutral-800/90 border border-brand-200/50 dark:border-neutral-700 mt-1 max-w-full truncate">
                    {member.position}
                </span>

                {/* Tombol Aksi Detail */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500 group-hover:text-brand-700 dark:text-neutral-400 dark:group-hover:text-gold-400 transition-colors">
                    <Eye className="h-3 w-3" />
                    <span>Lihat Tupoksi & Wewenang</span>
                </div>
            </button>
        );
    };

    // Kartu Sub-Cabang untuk Staf Pelaksana
    const renderStaffCard = (staff: OrgMember) => {
        return (
            <button
                type="button"
                onClick={() => setSelectedMember(staff)}
                className="w-full text-center p-3.5 sm:p-4 rounded-xl bg-white dark:bg-neutral-900/90 border border-slate-200/90 dark:border-neutral-800 hover:border-brand-700/70 dark:hover:border-gold-400/70 hover:shadow-md transition-all duration-300 group cursor-pointer relative shadow-2xs hover:-translate-y-0.5"
            >
                {/* Avatar Foto Staf */}
                <div className="relative inline-block mb-2">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-slate-200 dark:border-neutral-700 group-hover:border-brand-700 dark:group-hover:border-gold-400 bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105">
                        {staff.photo ? (
                            <img
                                src={`/storage/${staff.photo}`}
                                alt={staff.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-linear-to-br from-brand-700 to-brand-950 flex items-center justify-center text-white font-extrabold text-base">
                                {getInitials(staff.name)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Badge Staf Pelaksana */}
                <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[9.5px] font-bold text-slate-600 dark:text-neutral-300 bg-slate-100 dark:bg-neutral-800 border border-slate-200/60 dark:border-neutral-700 max-w-full truncate">
                        Staf Pelaksana
                    </span>
                </div>

                {/* Nama Lengkap Staf */}
                <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight mt-1 mb-0.5 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors line-clamp-2">
                    {staff.name}
                </h5>

                {/* Posisi / Jabatan Staf */}
                <p className="text-[10.5px] font-medium text-brand-700 dark:text-gold-400 truncate max-w-full">
                    {staff.position}
                </p>

                {/* Detail Link */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-center gap-1 text-[9.5px] font-semibold text-slate-400 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                    <Eye className="h-2.5 w-2.5" />
                    <span>Rincian Wewenang</span>
                </div>
            </button>
        );
    };

    // Supervisor & Subordinat dari personil yang dipilih
    const selectedSupervisor = selectedMember?.parentId ? memberMap.get(selectedMember.parentId) : null;
    const selectedSubordinates = selectedMember?.id ? childrenByParent.get(selectedMember.id) || [] : [];

    return (
        <div className="space-y-8 py-2">
            {/* Header Kontrol: Informasi & Mode Tampilan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-neutral-800">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Bagan Hirarki LPDSA</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-neutral-800 dark:text-gold-400 border border-brand-200/60 dark:border-neutral-700">
                            {normalizedData.length} Anggota
                        </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                        Klik pada kartu anggota untuk melihat rincian wewenang, uraian tugas pokok, dan relasi kerja.
                    </p>
                </div>

                {/* View Mode Switcher */}
                <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200/60 dark:border-neutral-700/60 self-start sm:self-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => setViewMode('tree')}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                            viewMode === 'tree'
                                ? 'bg-white dark:bg-neutral-900 text-brand-700 dark:text-gold-400 shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <GitFork className="h-3.5 w-3.5 rotate-180" />
                        <span>Bagan Pohon</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                            viewMode === 'grid'
                                ? 'bg-white dark:bg-neutral-900 text-brand-700 dark:text-gold-400 shadow-xs'
                                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white',
                        )}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        <span>Daftar Profil</span>
                    </button>
                </div>
            </div>

            {/* Hint geser horizontal pada layar kecil saat mode bagan pohon */}
            {viewMode === 'tree' && (
                <div className="lg:hidden flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-neutral-900/60 border border-amber-200/60 dark:border-neutral-800 text-[11px] text-amber-800 dark:text-amber-300">
                    <span>💡</span>
                    <span>Bagan pohon bergaris dapat digeser secara horizontal untuk meninjau seluruh struktur.</span>
                </div>
            )}

            {/* ========================================================= */}
            {/* TAMPILAN 1: BAGAN POHON BERGARIS (TREE ORG-CHART)        */}
            {/* ========================================================= */}
            {viewMode === 'tree' && (
                <div className="overflow-x-auto pb-8 pt-4 scrollbar-thin">
                    <div className="min-w-[760px] flex flex-col items-center">
                        {mainLevels.map((level, levelIdx) => {
                            const members = grouped[level] || [];
                            const memberCount = members.length;
                            const isFirstLevel = levelIdx === 0;

                            return (
                                <div key={level} className="flex flex-col items-center w-full">
                                    {/* Konektor Batang Vertikal dari Level Sebelumnya */}
                                    {!isFirstLevel && (
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-0.5 h-8 bg-brand-700/40 dark:bg-gold-400/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-700 dark:bg-gold-400 ring-4 ring-slate-50 dark:ring-neutral-950" />
                                        </div>
                                    )}

                                    {/* Level Label Badge */}
                                    <div className="my-2.5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white dark:bg-neutral-900 text-brand-700 dark:text-gold-400 border border-brand-200/80 dark:border-neutral-700 shadow-2xs">
                                            <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-gold-400" />
                                            {getLevelTitle(level)}
                                        </span>
                                    </div>

                                    {/* Baris Anggota dengan Garis Konektor Cabang Horizontal */}
                                    <div className="flex justify-center items-start w-full gap-4 sm:gap-6 px-4">
                                        {members.map((member, mIdx) => {
                                            const attachedStaff = (member.id && childrenByParent.get(member.id)) || [];
                                            const hasChildren = attachedStaff.length > 0;

                                            return (
                                                <div
                                                    key={member.id || mIdx}
                                                    className={cn(
                                                        'flex flex-col items-center flex-1 transition-all',
                                                        hasChildren && attachedStaff.length > 1
                                                            ? 'min-w-[320px] max-w-[480px]'
                                                            : 'max-w-[280px]',
                                                    )}
                                                >
                                                    {/* Konektor Cabang Atas (T-Bar / Stem) */}
                                                    {!isFirstLevel && (
                                                        <div className="relative w-full h-8 flex items-center justify-center">
                                                            {/* Garis Horizontal Penghubung Antar Anggota (Branch Bus Bar) */}
                                                            {memberCount > 1 && (
                                                                <div
                                                                    className={cn(
                                                                        'absolute top-0 h-0.5 bg-brand-700/40 dark:bg-gold-400/50',
                                                                        mIdx === 0 && 'left-1/2 right-0',
                                                                        mIdx === memberCount - 1 && 'left-0 right-1/2',
                                                                        mIdx > 0 && mIdx < memberCount - 1 && 'left-0 right-0',
                                                                    )}
                                                                />
                                                            )}
                                                            {/* Garis Vertikal Menuju Kartu */}
                                                            <div className="w-0.5 h-full bg-brand-700/40 dark:bg-gold-400/50" />
                                                            {/* Titik Simpul Persimpangan */}
                                                            {memberCount > 1 && (
                                                                <div className="absolute top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-700 dark:bg-gold-400 ring-2 ring-white dark:ring-neutral-950" />
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Kartu Pejabat */}
                                                    <div className="w-full max-w-[280px]">
                                                        {renderStandardCard(member, level)}
                                                    </div>

                                                    {/* Sub-Cabang Hierarki untuk Staf di Bawah Pejabat Ini */}
                                                    {hasChildren && (
                                                        <div className="flex flex-col items-center w-full mt-0">
                                                            {/* Batang Vertikal Turun Menuju Cabang Staf */}
                                                            <div className="w-0.5 h-6 bg-brand-700/40 dark:bg-gold-400/50" />
                                                            <div className="w-2 h-2 rounded-full bg-brand-700 dark:bg-gold-400 -mt-1 ring-2 ring-white dark:ring-neutral-950" />

                                                            {/* Container Kartu-kartu Staf di Bawah Pejabat */}
                                                            <div className="flex justify-center items-start gap-3 w-full mt-0">
                                                                {attachedStaff.map((staff, sIdx) => (
                                                                    <div
                                                                        key={staff.id || sIdx}
                                                                        className="flex flex-col items-center flex-1 max-w-[220px]"
                                                                    >
                                                                        {/* Bus bar penghubung jika staf > 1 */}
                                                                        {attachedStaff.length > 1 && (
                                                                            <div className="relative w-full h-4 flex items-center justify-center">
                                                                                <div
                                                                                    className={cn(
                                                                                        'absolute top-0 h-0.5 bg-brand-700/40 dark:bg-gold-400/50',
                                                                                        sIdx === 0 && 'left-1/2 right-0',
                                                                                        sIdx === attachedStaff.length - 1 && 'left-0 right-1/2',
                                                                                        sIdx > 0 && sIdx < attachedStaff.length - 1 && 'left-0 right-0',
                                                                                    )}
                                                                                />
                                                                                <div className="w-0.5 h-full bg-brand-700/40 dark:bg-gold-400/50" />
                                                                            </div>
                                                                        )}
                                                                        {attachedStaff.length === 1 && (
                                                                            <div className="w-0.5 h-3 bg-brand-700/40 dark:bg-gold-400/50" />
                                                                        )}

                                                                        {/* Kartu Staf Sub-Branch */}
                                                                        {renderStaffCard(staff)}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Cabang Khusus untuk Staf yang Belum Memilih Atasan / Staf Umum (Jika Ada) */}
                        {unassignedStaff.length > 0 && (
                            <div className="flex flex-col items-center w-full mt-2">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-0.5 h-8 bg-brand-700/40 dark:bg-gold-400/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-slate-50 dark:ring-neutral-950" />
                                </div>

                                <div className="my-2.5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 shadow-2xs">
                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                        Staf Pelaksana & Administrasi (Umum)
                                    </span>
                                </div>

                                <div className="flex justify-center items-start w-full gap-4 sm:gap-6 px-4">
                                    {unassignedStaff.map((staff, sIdx) => (
                                        <div
                                            key={staff.id || sIdx}
                                            className="flex flex-col items-center flex-1 max-w-[240px]"
                                        >
                                            {unassignedStaff.length > 1 && (
                                                <div className="relative w-full h-8 flex items-center justify-center">
                                                    <div
                                                        className={cn(
                                                            'absolute top-0 h-0.5 bg-brand-700/40 dark:bg-gold-400/50',
                                                            sIdx === 0 && 'left-1/2 right-0',
                                                            sIdx === unassignedStaff.length - 1 && 'left-0 right-1/2',
                                                            sIdx > 0 && sIdx < unassignedStaff.length - 1 && 'left-0 right-0',
                                                        )}
                                                    />
                                                    <div className="w-0.5 h-full bg-brand-700/40 dark:bg-gold-400/50" />
                                                    <div className="absolute top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-500 ring-2 ring-white dark:ring-neutral-950" />
                                                </div>
                                            )}
                                            {unassignedStaff.length === 1 && (
                                                <div className="w-0.5 h-6 bg-brand-700/40 dark:bg-gold-400/50" />
                                            )}

                                            {renderStaffCard(staff)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* TAMPILAN 2: DAFTAR PROFIL (GRID CARD LIST)                */}
            {/* ========================================================= */}
            {viewMode === 'grid' && (
                <div className="space-y-10">
                    {sortedLevels.map((level) => (
                        <div key={level} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-gold-400" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400">
                                    {getLevelTitle(level)}
                                </h4>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {grouped[level].map((member, mIdx) => (
                                    <button
                                        key={member.id || mIdx}
                                        type="button"
                                        onClick={() => setSelectedMember(member)}
                                        className="text-left p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700/70 dark:hover:border-gold-400/70 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
                                    >
                                        <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-neutral-800 shrink-0 border border-slate-200 dark:border-neutral-700 group-hover:border-brand-700 dark:group-hover:border-gold-400 transition-colors">
                                            {member.photo ? (
                                                <img
                                                    src={`/storage/${member.photo}`}
                                                    alt={member.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-linear-to-br from-brand-700 to-brand-950 flex items-center justify-center text-white font-extrabold text-lg">
                                                    {getInitials(member.name)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <span className="inline-block text-[10px] font-bold uppercase text-brand-700 dark:text-gold-400 mb-0.5">
                                                {getLevelTitle(level)}
                                            </span>
                                            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                                {member.name}
                                            </h5>
                                            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-1 truncate">
                                                {member.position}
                                            </p>

                                            {/* Badge Atasan untuk Staf Level 4 */}
                                            {member.level === '4' && member.parentId && memberMap.get(member.parentId) && (
                                                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-800/90 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-neutral-700/60 max-w-full">
                                                    <Users className="h-3 w-3 text-brand-700 dark:text-gold-400 shrink-0" />
                                                    <span className="truncate">
                                                        Bernaung di bawah: <strong className="text-slate-800 dark:text-neutral-200">{memberMap.get(member.parentId)?.position}</strong>
                                                    </span>
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 dark:text-gold-400">
                                                    <span>Detail Wewenang</span> &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL POP-UP: DETAIL PROFIL, TUPOKSI, WEWENANG & RELASI   */}
            {/* ========================================================= */}
            <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-slate-200/80 dark:border-neutral-800 shadow-2xl">
                    {selectedMember && (
                        <div>
                            {/* Header Dialog Bergaya Khas Univrab Crimson */}
                            <div className="relative bg-linear-to-br from-brand-900 via-brand-950 to-plum-950 text-white p-6 sm:p-7 overflow-hidden">
                                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

                                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                                    {/* Avatar Foto Besar */}
                                    <div className="h-22 w-22 rounded-full overflow-hidden border-3 border-gold-400 bg-neutral-900 shrink-0 shadow-lg flex items-center justify-center">
                                        {selectedMember.photo ? (
                                            <img
                                                src={`/storage/${selectedMember.photo}`}
                                                alt={selectedMember.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-linear-to-br from-brand-700 to-brand-950 flex items-center justify-center text-white font-black text-2xl">
                                                {getInitials(selectedMember.name)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Teks Identitas Pejabat */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-400/20 text-gold-300 border border-gold-400/40">
                                            {getLevelTitle(selectedMember.level)}
                                        </div>

                                        <DialogTitle className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                                            {selectedMember.name}
                                        </DialogTitle>

                                        <DialogDescription className="text-xs sm:text-sm font-medium text-slate-200">
                                            {selectedMember.position}
                                        </DialogDescription>

                                        {selectedMember.email && (
                                            <div className="pt-1">
                                                <a
                                                    href={`mailto:${selectedMember.email}`}
                                                    className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-gold-300 transition-colors"
                                                >
                                                    <Mail className="h-3.5 w-3.5 text-gold-400" />
                                                    <span>{selectedMember.email}</span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Badan Dialog: Tupoksi, Wewenang & Relasi Tim */}
                            <div className="p-6 sm:p-7 space-y-6 bg-slate-50/60 dark:bg-neutral-900/60">
                                {/* Relasi Atasan Langsung (Jika anggota adalah Staf) */}
                                {selectedSupervisor && (
                                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/80 border border-amber-200/80 dark:border-neutral-700 text-xs shadow-2xs">
                                        <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-neutral-700 flex items-center justify-center shrink-0 text-amber-800 dark:text-gold-400 shadow-2xs">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-gold-400">
                                                Atasan Langsung & Unit Kerja
                                            </div>
                                            <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                                {selectedSupervisor.name}
                                            </div>
                                            <div className="text-[11px] text-slate-600 dark:text-neutral-400 truncate">
                                                {selectedSupervisor.position}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Relasi Bawahan / Staf Binaan (Jika anggota adalah Kabid/Sekretaris yang memiliki staf binaan) */}
                                {selectedSubordinates.length > 0 && (
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-850 border border-slate-200/80 dark:border-neutral-700 text-xs space-y-2.5 shadow-2xs">
                                        <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wider text-brand-700 dark:text-gold-400">
                                            <Users className="h-4 w-4" />
                                            <span>Staf Pelaksana di Bawah Koordinasi ({selectedSubordinates.length})</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            {selectedSubordinates.map((sub, sIdx) => (
                                                <div
                                                    key={sub.id || sIdx}
                                                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-750"
                                                >
                                                    <div className="h-7 w-7 rounded-full bg-linear-to-br from-brand-700 to-brand-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                                        {getInitials(sub.name)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                                            {sub.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 dark:text-neutral-400 truncate">
                                                            {sub.position}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bagian 1: Tanggung Jawab & Tupoksi */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-gold-400 border-b border-slate-200/70 dark:border-neutral-800 pb-2">
                                        <ClipboardList className="h-4 w-4" />
                                        <span>Tugas Pokok & Tanggung Jawab</span>
                                    </div>

                                    {parseBulletPoints(selectedMember.responsibilities).length > 0 ? (
                                        <div className="space-y-2">
                                            {parseBulletPoints(selectedMember.responsibilities).map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-3 rounded-xl border border-slate-200/70 dark:border-neutral-800 shadow-2xs"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 text-xs text-slate-500 italic">
                                            Rincian tugas pokok dan tanggung jawab belum dikonfigurasi.
                                        </div>
                                    )}
                                </div>

                                {/* Bagian 2: Wewenang Jabatan */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-gold-400 border-b border-slate-200/70 dark:border-neutral-800 pb-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Wewenang Struktural</span>
                                    </div>

                                    {parseBulletPoints(selectedMember.authorities).length > 0 ? (
                                        <div className="space-y-2">
                                            {parseBulletPoints(selectedMember.authorities).map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-3 rounded-xl border border-slate-200/70 dark:border-neutral-800 shadow-2xs"
                                                >
                                                    <Award className="h-3.5 w-3.5 text-gold-500 dark:text-gold-400 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200/70 dark:border-neutral-800 text-xs text-slate-500 italic">
                                            Rincian wewenang jabatan belum dikonfigurasi.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Dialog */}
                            <div className="px-6 py-4 border-t border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-[11px] text-slate-500 dark:text-neutral-400 italic">
                                    LPDSA Universitas Abdurrab &bull; Tata Kelola Mutu & Pangkalan Data
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMember(null)}
                                    className="text-xs h-8 px-4"
                                >
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

