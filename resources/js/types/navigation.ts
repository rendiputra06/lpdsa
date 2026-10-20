import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: string | number;
    action?: {
        icon: LucideIcon;
        href: NonNullable<InertiaLinkProps['href']>;
        title: string;
    };
    role?: 'super_admin' | 'admin';
};

export type NavGroup = {
    title?: string;
    items: NavItem[];
    role?: 'super_admin' | 'admin';
};
