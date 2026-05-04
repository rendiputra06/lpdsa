import { FileText, ExternalLink, Download } from 'lucide-react';

export default function DocumentsViewer({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {data.map((item: any, idx: number) => {
                const href = item.is_external_link ? item.url : `/storage/${item.file}`;
                const target = item.is_external_link ? '_blank' : '_self';
                
                return (
                    <a 
                        key={idx} 
                        href={href}
                        target={target}
                        rel={item.is_external_link ? "noopener noreferrer" : ""}
                        className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-univrab-blue/50 dark:hover:border-univrab-blue/50 hover:shadow-lg transition-all no-underline"
                    >
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-neutral-900 text-univrab-blue flex items-center justify-center shrink-0 group-hover:bg-univrab-blue group-hover:text-white transition-colors">
                            {item.is_external_link ? <ExternalLink className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-univrab-blue transition-colors leading-tight mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="shrink-0 text-slate-400 group-hover:text-univrab-blue">
                            {item.is_external_link ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
