import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

type NavMainProps = {
    groups?: NavGroup[];
    items?: NavItem[];
};

export function NavMain({ groups, items }: NavMainProps) {
    const { isCurrentModuleUrl } = useCurrentUrl();
    const page = usePage();
    const auth = (page.props as { auth?: { user?: { role?: string } } }).auth;
    const userRole = auth?.user?.role;

    // Support both grouped and flat items
    const navGroups: NavGroup[] = groups ?? (items ? [{ items }] : []);

    return (
        <div className="flex flex-col gap-1 py-1">
            {navGroups.map((group, groupIdx) => {
                // Check if group is restricted by role
                if (
                    group.role === 'super_admin' &&
                    userRole !== 'super_admin'
                ) {
                    return null;
                }

                // Filter items inside the group
                const visibleItems = group.items.filter((item) => {
                    if (
                        item.role === 'super_admin' &&
                        userRole !== 'super_admin'
                    ) {
                        return false;
                    }

                    return true;
                });

                if (visibleItems.length === 0) {
                    return null;
                }

                return (
                    <SidebarGroup
                        key={group.title ?? groupIdx}
                        className="px-2 py-1"
                    >
                        {group.title && (
                            <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
                                {group.title}
                            </SidebarGroupLabel>
                        )}
                        <SidebarMenu>
                            {visibleItems.map((item) => {
                                const isActive =
                                    item.isActive ??
                                    isCurrentModuleUrl(item.href);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={{ children: item.title }}
                                            className={cn(
                                                'transition-colors duration-150',
                                                isActive &&
                                                    'bg-brand-50/90 font-semibold text-brand-700 shadow-xs dark:bg-brand-950/60 dark:text-brand-300',
                                            )}
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.icon && (
                                                    <item.icon
                                                        className={cn(
                                                            'h-4 w-4 shrink-0 transition-colors',
                                                            isActive
                                                                ? 'text-brand-700 dark:text-brand-300'
                                                                : 'text-muted-foreground group-hover/menu-item:text-foreground',
                                                        )}
                                                    />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>

                                        {item.badge !== undefined && (
                                            <SidebarMenuBadge className="bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}

                                        {item.action && (
                                            <SidebarMenuAction
                                                asChild
                                                showOnHover
                                                className="text-muted-foreground hover:bg-brand-100/60 hover:text-brand-700 dark:hover:bg-brand-900/40 dark:hover:text-brand-300"
                                            >
                                                <Link
                                                    href={item.action.href}
                                                    title={item.action.title}
                                                >
                                                    <item.action.icon className="h-3.5 w-3.5" />
                                                    <span className="sr-only">
                                                        {item.action.title}
                                                    </span>
                                                </Link>
                                            </SidebarMenuAction>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </div>
    );
}
