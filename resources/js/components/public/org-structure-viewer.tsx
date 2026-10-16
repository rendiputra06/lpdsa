import { Award } from 'lucide-react';

export default function OrgStructureViewer({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-slate-500">
                Data struktur organisasi belum ditambahkan.
            </div>
        );
    }

    // Group members by level
    const grouped = data.reduce((acc: any, item: any) => {
        const level = item.level || '1';

        if (!acc[level]) {
acc[level] = [];
}

        acc[level].push(item);

        return acc;
    }, {});

    const sortedLevels = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

    const getLevelTitle = (level: string) => {
        switch (level) {
            case '1':
                return 'Pimpinan Lembaga';
            case '2':
                return 'Sekretaris & Penjaminan Mutu';
            case '3':
                return 'Kepala Bidang & Koordinator';
            default:
                return `Tingkat ${level}`;
        }
    };

    return (
        <div className="space-y-12 py-6">
            {sortedLevels.map((level) => (
                <div key={level} className="relative">
                    {/* Level Divider / Heading */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-gold-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400">
                            {getLevelTitle(level)}
                        </h3>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-neutral-800" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {grouped[level].map((member: any, mIdx: number) => {
                            const nameInitial = member.name
                                ? member.name
                                      .replace(/^(Dr\.|Prof\.|H\.|Hj\.)\s*/gi, '')
                                      .trim()
                                      .charAt(0)
                                      .toUpperCase()
                                : 'L';

                            return (
                                <div
                                    key={mIdx}
                                    className="w-full sm:w-72 flex flex-col items-center bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-neutral-800 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-xl transition-all duration-300 text-center group"
                                >
                                    <div className="relative mb-4">
                                        <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-brand-50 dark:border-neutral-800 group-hover:border-brand-700 dark:group-hover:border-gold-400 transition-colors bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                                            {member.photo ? (
                                                <img
                                                    src={`/storage/${member.photo}`}
                                                    alt={member.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-linear-to-br from-brand-700 to-brand-950 flex items-center justify-center text-white font-extrabold text-2xl">
                                                    {nameInitial}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1.5 right-0 h-6 w-6 rounded-full bg-gold-400 text-neutral-950 flex items-center justify-center shadow-xs">
                                            <Award className="h-3.5 w-3.5" />
                                        </div>
                                    </div>

                                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                        {member.name}
                                    </h4>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-neutral-800/80 border border-brand-200/60 dark:border-neutral-700 mt-1">
                                        {member.position}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
