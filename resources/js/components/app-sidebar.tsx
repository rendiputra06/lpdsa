import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Megaphone,
    Tags,
    Menu as MenuIcon,
    Users,
    FileText,
    Image as ImageIcon,
    History,
    Globe
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Pengumuman',
        href: '/admin/announcements',
        icon: Megaphone,
    },
    {
        title: 'Kategori',
        href: '/admin/categories',
        icon: Tags,
    },
    {
        title: 'Menu Navigasi',
        href: '/admin/menus',
        icon: MenuIcon,
    },
    {
        title: 'Halaman Statis',
        href: '/admin/static-pages',
        icon: FileText,
    },
    {
        title: 'Banner Hero',
        href: '/admin/banners',
        icon: ImageIcon,
    },
    {
        title: 'Pengguna',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Log Aktivitas',
        href: '/admin/activity-logs',
        icon: History,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Lihat Website',
        href: '/',
        icon: Globe,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
