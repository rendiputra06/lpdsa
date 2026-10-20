import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
}: {
    user: User;
    showEmail?: boolean;
    showRole?: boolean;
}) {
    const getInitials = useInitials();
    const isSuperAdmin = user.role === 'super_admin';

    return (
        <>
            <Avatar className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="truncate font-medium">{user.name}</span>
                    {showRole && user.role && (
                        <span
                            className={cn(
                                'py-0.2 shrink-0 rounded px-1.5 text-[10px] font-semibold tracking-wide uppercase',
                                isSuperAdmin
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-neutral-800 dark:text-neutral-300',
                            )}
                        >
                            {isSuperAdmin ? 'Super' : 'Admin'}
                        </span>
                    )}
                </div>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
