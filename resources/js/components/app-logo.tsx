import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
    showText?: boolean;
}

export default function AppLogo({ className, showText = false }: AppLogoProps) {
    const { settings } = usePage().props as any;

    return (
        <>
            <div
                className={cn(
                    'flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#800000] text-white shadow-xs',
                    className,
                )}
            >
                {settings?.app_logo ? (
                    <img
                        src={`/storage/${settings.app_logo}`}
                        alt="Logo"
                        className="size-full object-cover"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current" />
                )}
            </div>
            {showText && (
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold tracking-tight text-foreground">
                        {settings?.app_name || 'LPDSA UNIVRAB'}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                        Penjaminan Mutu & Pangkalan Data
                    </span>
                </div>
            )}
        </>
    );
}
