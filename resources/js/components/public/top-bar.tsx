import { usePage, Link } from '@inertiajs/react';
import { Globe, ExternalLink } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function TopBar() {
    const { settings } = usePage().props as any;

    const appName = settings?.app_name || 'LPDSA';
    const appDesc = settings?.app_description || 'Lembaga Pangkalan Data, SPMI, dan Akreditasi';

    return (
        <aside aria-label="Identitas Lembaga" className="hidden lg:block bg-white dark:bg-neutral-950 border-b border-slate-200/80 dark:border-neutral-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center gap-6">
                {/* Brand Logo & Institutional Titles */}
                <Link href="/" className="flex items-center gap-3.5 group">
                    <AppLogo className="h-11 w-11 rounded-xl p-0.5 bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs group-hover:scale-105 transition-transform shrink-0" />
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black tracking-tight text-brand-700 dark:text-gold-400 group-hover:text-brand-800 dark:group-hover:text-gold-300 transition-colors leading-none">
                                {appName}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                                Universitas Abdurrab
                            </span>
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-neutral-300 mt-1 leading-none">
                            {appDesc}
                        </span>
                    </div>
                </Link>

                {/* Right side: Simple Portal Link */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://univrab.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-gold-400 hover:bg-slate-50 dark:hover:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 transition-colors"
                    >
                        <Globe className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                        <span>univrab.ac.id</span>
                        <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                </div>
            </div>
        </aside>
    );
}
