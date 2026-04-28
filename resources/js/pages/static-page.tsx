import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function StaticPage({ page }: any) {
    return (
        <PublicLayout>
            <Head title={page.title}>
                <meta name="description" content={page.meta_description} />
            </Head>

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl mb-8">
                    {page.title}
                </h1>

                <article className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
        </PublicLayout>
    );
}
