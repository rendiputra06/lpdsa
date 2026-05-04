import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { settings } = usePage().props as any;
    const appName = settings?.app_name || 'LPDSA';

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-univrab-blue" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3 text-xl font-bold tracking-tight"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md overflow-hidden">
                        {settings?.app_logo ? (
                            <img src={`/storage/${settings.app_logo}`} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        )}
                    </div>
                    {appName}
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-medium">
                            &ldquo;{settings?.app_description || 'Universitas Abdurrab'}&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-univrab-blue overflow-hidden shadow-xl shadow-univrab-blue/20">
                            {settings?.app_logo ? (
                                <img src={`/storage/${settings.app_logo}`} alt="Logo" className="h-full w-full object-cover" />
                            ) : (
                                <AppLogoIcon className="size-10 fill-current text-white" />
                            )}
                        </div>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-univrab-blue dark:text-univrab-gold">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
