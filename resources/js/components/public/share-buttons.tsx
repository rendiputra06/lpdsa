import { Share2, Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopy = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex items-center flex-wrap gap-2 pt-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 flex items-center gap-1.5 mr-2">
                <Share2 className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400" />
                <span>Bagikan:</span>
            </span>

            {/* WhatsApp */}
            <a
                href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60 hover:bg-emerald-100 transition-colors"
            >
                WhatsApp
            </a>

            {/* Facebook */}
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-100 transition-colors"
            >
                Facebook
            </a>

            {/* X / Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 transition-colors"
            >
                X (Twitter)
            </a>

            {/* Copy Link */}
            <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
                {copied ? (
                    <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Tersalin!</span>
                    </>
                ) : (
                    <>
                        <Copy className="h-3 w-3" />
                        <span>Salin Link</span>
                    </>
                )}
            </button>
        </div>
    );
}
