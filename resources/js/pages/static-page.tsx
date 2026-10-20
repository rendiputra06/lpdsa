import { Head, Link } from '@inertiajs/react';
import { FileText, ArrowRight, ExternalLink } from 'lucide-react';
import DocumentsViewer from '@/components/public/documents-viewer';
import OrgStructureViewer from '@/components/public/org-structure-viewer';
import PageHero from '@/components/public/page-hero';

interface StaticPageProps {
    page: any;
    otherPages?: any[];
}

export default function StaticPage({ page, otherPages = [] }: StaticPageProps) {
    const isOrgStructure = page.type === 'org_structure';

    return (
        <>
            <Head title={page.title}>
                <meta name="description" content={page.meta_description || `${page.title} - LPDSA Universitas Abdurrab`} />
                <meta property="og:title" content={`${page.title} - LPDSA Universitas Abdurrab`} />
                <meta property="og:type" content="website" />
            </Head>

            {/* Page Hero matching Univrab Inner Page Layout */}
            <PageHero
                breadcrumbs={[
                    { label: 'Profil & Informasi', href: '/about' },
                    { label: page.title },
                ]}
                eyebrow="PROFIL & REGULASI"
                title={page.title}
            />

            {/* Page Content & Navigation */}
            <div className="bg-slate-50 dark:bg-neutral-950 py-12 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isOrgStructure ? (
                        /* Full-Width Canvas for Org Structure */
                        <div className="space-y-10">
                            <main className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-neutral-800 shadow-sm min-w-0">
                                <OrgStructureViewer data={page.data} />

                                {/* Footer inside card */}
                                <div className="mt-12 pt-6 border-t border-slate-100 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400">
                                    <span className="font-medium italic">
                                        Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab
                                    </span>
                                </div>
                            </main>

                            {/* Bottom Secondary Widgets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch no-print">
                                {otherPages.length > 0 && (
                                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="border-b-2 border-brand-700 dark:border-gold-400 pb-3 mb-4">
                                                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                                    Halaman Profil Lainnya
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {otherPages.map((item: any) => (
                                                    <Link
                                                        key={item.slug}
                                                        href={`/${item.slug}`}
                                                        className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-800/60 transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                                                            <span className="truncate">{item.title}</span>
                                                        </span>
                                                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Widget: Hubungi Sekretariat */}
                                <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-brand-900 to-brand-950 text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
                                    <div className="relative space-y-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                                            Bantuan & Layanan
                                        </span>
                                        <h4 className="font-extrabold text-lg text-white">
                                            Konsultasi SPMI & Akreditasi
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                                            Perlu panduan instrumen atau konsultasi data PDDIKTI program studi? Hubungi tim sekretariat kami.
                                        </p>
                                    </div>
                                    <div className="relative mt-4 pt-2">
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-400 text-neutral-950 text-xs font-bold hover:bg-gold-300 transition-colors"
                                        >
                                            <span>Hubungi Kami</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Standard 2-Column Layout for Default & Document Pages */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                            {/* Main Content Area (Col 8) */}
                            <main className="lg:col-span-8 bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-neutral-800 shadow-sm min-w-0 overflow-hidden">
                                {page.type === 'default' && (
                                    <article
                                        className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-neutral-200 leading-relaxed break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden
                                            prose-headings:font-extrabold prose-headings:text-slate-900 dark:prose-headings:text-white
                                            prose-a:text-brand-700 dark:prose-a:text-gold-400 hover:prose-a:underline
                                            prose-img:rounded-2xl prose-img:shadow-md"
                                        dangerouslySetInnerHTML={{ __html: page.content }}
                                    />
                                )}

                                {page.type === 'documents' && (
                                    <DocumentsViewer data={page.data} />
                                )}

                                {/* Footer inside card */}
                                <div className="mt-12 pt-6 border-t border-slate-100 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400">
                                    <span className="font-medium italic">
                                        Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab
                                    </span>
                                </div>
                            </main>

                            {/* Navigation Sidebar (Col 4) */}
                            <aside className="lg:col-span-4 space-y-8 no-print">
                                {otherPages.length > 0 && (
                                    <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm">
                                        <div className="border-b-2 border-brand-700 dark:border-gold-400 pb-3 mb-4">
                                            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                                                Halaman Terkait
                                            </h3>
                                        </div>

                                        <div className="space-y-1.5">
                                            {otherPages.map((item: any) => (
                                                <Link
                                                    key={item.slug}
                                                    href={`/${item.slug}`}
                                                    className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-800/60 transition-colors"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-slate-400" />
                                                        <span>{item.title}</span>
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 rounded-3xl bg-linear-to-br from-brand-900 to-brand-950 text-white shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />
                                    <div className="relative space-y-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                                            Bantuan & Layanan
                                        </span>
                                        <h4 className="font-extrabold text-base text-white">
                                            Konsultasi SPMI & Akreditasi
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Perlu panduan instrumen atau konsultasi data PDDIKTI program studi? Hubungi tim kami.
                                        </p>
                                        <Link
                                            href="/contact"
                                            className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-gold-400 text-neutral-950 text-xs font-bold hover:bg-gold-300 transition-colors"
                                        >
                                            <span>Hubungi Kami</span>
                                            <ExternalLink className="h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
