import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <div className={cn("flex aspect-square size-8 items-center justify-center rounded-md bg-univrab-blue text-white", className)}>
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    LPDSA
                </span>
            </div>
        </>
    );
}
