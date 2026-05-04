export default function OrgStructureViewer({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    // Group by level
    const grouped = data.reduce((acc: any, item: any) => {
        const level = item.level || '1';
        if (!acc[level]) acc[level] = [];
        acc[level].push(item);
        return acc;
    }, {});

    const sortedLevels = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <div className="space-y-12 py-8">
            {sortedLevels.map((level, idx) => (
                <div key={level} className="relative">
                    <div className="flex flex-wrap justify-center gap-8 relative z-10">
                        {grouped[level].map((member: any, mIdx: number) => (
                            <div key={mIdx} className="w-64 flex flex-col items-center bg-white dark:bg-neutral-950 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-neutral-800 transition-transform hover:-translate-y-2">
                                <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-4 border-univrab-blue/10 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center">
                                    {member.photo ? (
                                        <img src={`/storage/${member.photo}`} alt={member.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-4xl text-slate-300">👤</span>
                                    )}
                                </div>
                                <h3 className="font-bold text-center text-slate-900 dark:text-white leading-tight mb-1">{member.name}</h3>
                                <p className="text-sm font-medium text-univrab-blue dark:text-univrab-gold text-center">{member.position}</p>
                            </div>
                        ))}
                    </div>
                    {/* Connecting lines could be added here for a true tree, but flex-wrap centers them nicely for a responsive grid */}
                </div>
            ))}
        </div>
    );
}
