import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Calendar, Clock, Share2 } from 'lucide-react';
import OrgStructureViewer from '@/components/public/org-structure-viewer';
import DocumentsViewer from '@/components/public/documents-viewer';

export default function StaticPage({ page }: any) {
    return (
        <>
            <Head title={page.title}>
                <meta name="description" content={page.meta_description} />
            </Head>

            <div className="relative overflow-hidden bg-univrab-blue py-16 sm:py-24">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                            {page.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Terakhir diperbarui: {new Date(page.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative -mt-12 mb-20 px-6 lg:px-8">
                <div className="mx-auto max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 sm:p-12 border border-slate-100 dark:border-neutral-800">
                    
                    {page.type === 'default' && (
                        <article className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                            prose-headings:text-univrab-blue dark:prose-headings:text-univrab-gold
                            prose-a:text-univrab-blue hover:prose-a:text-univrab-blue/80
                            prose-img:rounded-xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    )}

                    {page.type === 'org_structure' && (
                        <OrgStructureViewer data={page.data} />
                    )}

                    {page.type === 'documents' && (
                        <DocumentsViewer data={page.data} />
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                        <p className="text-slate-500 text-sm italic">
                            LPDSA Universitas Abdurrab
                        </p>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 text-sm text-univrab-blue font-medium hover:underline"
                        >
                            Cetak Halaman
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
