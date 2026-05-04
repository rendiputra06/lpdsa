import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    const { settings } = usePage().props as any;

    return (
        <>
            <div className={cn("flex aspect-square size-8 items-center justify-center rounded-md bg-univrab-blue text-white overflow-hidden", className)}>
                {settings?.app_logo ? (
                    <img src={`/storage/${settings.app_logo}`} alt="Logo" className="size-full object-cover" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current" />
                )}
            </div>
            {/* <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {settings?.app_name || 'LPDSA'}
                </span>
            </div> */}
        </>
    );
}
