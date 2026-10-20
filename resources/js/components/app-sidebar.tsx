import { Link } from '@inertiajs/react';
import {
    Award,
    FileText,
    Globe,
    GraduationCap,
    History,
    Image as ImageIcon,
    LayoutGrid,
    Megaphone,
    Menu as MenuIcon,
    Plus,
    Settings,
    Tags,
    Users,
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
import admin from '@/routes/admin';
import type { NavGroup, NavItem } from '@/types';

const navGroups: NavGroup[] = [
    {
        title: 'Utama',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Pangkalan Data & Mutu',
        items: [
            {
                title: 'Data Akreditasi',
                href: admin.accreditations.index(),
                icon: Award,
            },
            {
                title: 'Unit Akademik',
                href: admin.academicUnits.index(),
                icon: GraduationCap,
            },
        ],
    },
    {
        title: 'Publikasi & CMS',
        items: [
            {
                title: 'Pengumuman',
                href: admin.announcements.index(),
                icon: Megaphone,
                action: {
                    icon: Plus,
                    href: admin.announcements.create(),
                    title: 'Tambah Pengumuman',
                },
            },
            {
                title: 'Kategori',
                href: admin.categories.index(),
                icon: Tags,
            },
            {
                title: 'Banner Hero',
                href: admin.banners.index(),
                icon: ImageIcon,
            },
            {
                title: 'Halaman Statis',
                href: admin.staticPages.index(),
                icon: FileText,
            },
            {
                title: 'Menu Navigasi',
                href: admin.menus.index(),
                icon: MenuIcon,
            },
        ],
    },
    {
        title: 'Sistem & Konfigurasi',
        items: [
            {
                title: 'Pengguna',
                href: admin.users.index(),
                icon: Users,
                role: 'super_admin',
            },
            {
                title: 'Log Aktivitas',
                href: admin.activityLogs.index(),
                icon: History,
            },
            {
                title: 'Pengaturan',
                href: admin.settings.index(),
                icon: Settings,
                role: 'super_admin',
            },
        ],
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
                                <AppLogo showText />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
