import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title?: string;
    description?: string;
    onReset?: () => void;
    resetLabel?: string;
    icon?: React.ReactNode;
}

export default function EmptyState({
    title = 'Tidak ada data ditemukan',
    description = 'Coba ubah kata kunci pencarian atau sesuaikan filter yang dipilih.',
    onReset,
    resetLabel = 'Reset Filter',
    icon,
}: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-50/70 dark:bg-neutral-900/60 border-2 border-dashed border-slate-200 dark:border-neutral-800 max-w-xl mx-auto my-8">
            <div className="h-16 w-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm border border-slate-200/80 dark:border-neutral-700 flex items-center justify-center mx-auto mb-4 text-brand-700 dark:text-gold-400">
                {icon || <Search className="h-8 w-8 text-slate-400 dark:text-neutral-500" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-sm mx-auto mb-6 leading-relaxed">
                {description}
            </p>
            {onReset && (
                <Button
                    type="button"
                    onClick={onReset}
                    className="rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs px-5 py-2 shadow-sm"
                >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    <span>{resetLabel}</span>
                </Button>
            )}
        </div>
    );
}
