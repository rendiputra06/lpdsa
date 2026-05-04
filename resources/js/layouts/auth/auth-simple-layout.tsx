import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { settings } = usePage().props as any;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-xl bg-univrab-blue overflow-hidden shadow-lg shadow-univrab-blue/20">
                                {settings?.app_logo ? (
                                    <img src={`/storage/${settings.app_logo}`} alt="Logo" className="h-full w-full object-cover" />
                                ) : (
                                    <AppLogoIcon className="size-10 fill-current text-white" />
                                )}
                            </div>
                            <span className="sr-only">{settings?.app_name || 'LPDSA'}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-univrab-blue dark:text-univrab-gold">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
