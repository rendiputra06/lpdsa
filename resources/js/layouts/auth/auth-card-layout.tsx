import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    const { settings } = usePage().props as any;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-univrab-blue overflow-hidden shadow-lg shadow-univrab-blue/10">
                        {settings?.app_logo ? (
                            <img src={`/storage/${settings.app_logo}`} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <AppLogoIcon className="size-8 fill-current text-white" />
                        )}
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl shadow-xl border-none">
                        <CardHeader className="px-10 pt-10 pb-0 text-center">
                            <CardTitle className="text-2xl font-bold text-univrab-blue dark:text-univrab-gold">{title}</CardTitle>
                            <CardDescription className="mt-2">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-10">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
