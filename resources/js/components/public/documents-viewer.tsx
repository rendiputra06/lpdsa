import { ExternalLink, Download, Search, FileCheck } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function DocumentsViewer({ data }: { data: any[] }) {
    const [search, setSearch] = useState('');

    if (!data || data.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-slate-500">
                Belum ada dokumen yang dipublikasikan pada repositori ini.
            </div>
        );
    }

    const filtered = data.filter((item) => {
        if (!search) {
return true;
}

        const q = search.toLowerCase();

        return (
            (item.title && item.title.toLowerCase().includes(q)) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
    });

    return (
        <div className="py-6 space-y-6">
            {/* Filter Search Input */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama dokumen, SOP, atau regulasi..."
                    className="pl-10 pr-4 py-2 h-11 rounded-full bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-sm focus-visible:ring-brand-700"
                />
            </div>

            {/* Document Cards Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item: any, idx: number) => {
                        const isExternal =
                            item.is_external_link === true ||
                            item.is_external_link === 'true' ||
                            item.is_external_link === 1 ||
                            item.is_external_link === '1';
                        const href = isExternal ? item.url : `/storage/${item.file}`;

                        return (
                            <a
                                key={idx}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-brand-700 dark:hover:border-gold-400 hover:shadow-lg transition-all no-underline"
                            >
                                <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-neutral-800 text-brand-700 dark:text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-brand-700 group-hover:text-white dark:group-hover:bg-gold-400 dark:group-hover:text-neutral-950 transition-colors border border-brand-100 dark:border-neutral-700">
                                    {isExternal ? (
                                        <ExternalLink className="h-5 w-5" />
                                    ) : (
                                        <FileCheck className="h-5 w-5" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors leading-snug mb-1">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                                            {isExternal ? 'Portal Tautan' : 'Dokumen PDF / File'}
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0 p-2 rounded-lg text-slate-400 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-colors">
                                    {isExternal ? (
                                        <ExternalLink className="h-4 w-4" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 text-center text-sm text-slate-500 border border-dashed border-slate-200 dark:border-neutral-800 rounded-2xl">
                    Tidak ada dokumen yang cocok dengan kata kunci &ldquo;{search}&rdquo;.
                </div>
            )}
        </div>
    );
}
