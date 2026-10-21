import { Head, usePage } from '@inertiajs/react';
import React from 'react';

export interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export default function SeoHead({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    jsonLd,
}: SeoHeadProps) {
    const page = usePage();
    const sharedProps = page.props as Record<string, any>;
    const settings = sharedProps.settings || {};

    const siteName = settings.app_name || sharedProps.name || 'LPDSA Universitas Abdurrab';
    const defaultDescription =
        settings.app_description ||
        'Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab. Menjamin mutu akademik, akurasi data pangkalan data, dan fasilitasi akreditasi universitas.';

    const pageDescription = description || defaultDescription;

    // Determine Base URL (from server props or browser window)
    const baseUrl =
        sharedProps.appUrl ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

    // Canonical URL: If not explicitly passed, use current clean path (strip query params for clean canonical)
    let finalCanonical = '';
    if (canonicalUrl) {
        if (canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://')) {
            finalCanonical = canonicalUrl;
        } else {
            finalCanonical = `${baseUrl}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`;
        }
    } else {
        const cleanPath = (page.url || '').split('?')[0];
        finalCanonical = `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
    }

    // Image Resolution: Absolute URL is mandatory for social scrapers (WhatsApp, FB, Twitter)
    let finalOgImage = '';
    if (ogImage) {
        if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) {
            finalOgImage = ogImage;
        } else if (ogImage.startsWith('/')) {
            finalOgImage = `${baseUrl}${ogImage}`;
        } else {
            finalOgImage = `${baseUrl}/${ogImage}`;
        }
    } else if (settings.app_logo) {
        finalOgImage = `${baseUrl}/storage/${settings.app_logo}`;
    } else {
        finalOgImage = `${baseUrl}/apple-touch-icon.png`;
    }

    // Ensure title displays brand properly
    const fullTitle = title ? `${title} - ${siteName}` : siteName;

    return (
        <Head title={title}>
            <meta name="description" content={pageDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Canonical Link */}
            <link rel="canonical" href={finalCanonical} />

            {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={finalCanonical} />
            <meta property="og:image" content={finalOgImage} />
            <meta property="og:image:alt" content={title || siteName} />
            <meta property="og:locale" content="id_ID" />

            {/* Article Specific Open Graph */}
            {ogType === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {ogType === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {ogType === 'article' && author && (
                <meta property="article:author" content={author} />
            )}
            {ogType === 'article' && section && (
                <meta property="article:section" content={section} />
            )}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={finalOgImage} />

            {/* Structured Data (JSON-LD) */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Head>
    );
}
