import { Link, usePage, router } from '@inertiajs/react';
import { Menu as MenuIcon, X, ChevronDown, ChevronRight, ExternalLink, Moon, Sun, Search, User, LogIn } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/app-logo';
import { useAppearance } from '@/hooks/use-appearance';

export default function Navbar() {
    const { url } = usePage();
    const { menus, auth, settings } = usePage().props as any;
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<Record<number, boolean>>({});
    const [scrolled, setScrolled] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        const unregister = router.on('navigate', () => {
            setIsOpen(false);
            setActiveDropdown(null);
        });

        return () => {
            unregister();
        };
    }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const toggleMobileSection = (id: number) => {
        setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const isLinkActive = (menuUrl: string) => {
        if (!menuUrl || menuUrl === '#' || typeof url !== 'string') {
return false;
}

        if (menuUrl === '/' && url === '/') {
return true;
}

        if (menuUrl !== '/' && url.startsWith(menuUrl)) {
return true;
}

        return false;
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-neutral-800'
                    : 'bg-white dark:bg-neutral-950 border-b border-slate-200/60 dark:border-neutral-800/80'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    {/* Brand Logo */}
                    <div className="flex items-center shrink-0">
                        <Link href="/" className="flex items-center gap-3 group">
                            <AppLogo className="h-11 w-11 rounded-xl shadow-xs group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tight text-brand-700 dark:text-gold-400 group-hover:text-brand-800 transition-colors">
                                    {settings?.app_name || 'LPDSA'}
                                </span>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-neutral-400 line-clamp-1">
                                    Universitas Abdurrab
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Menu */}
                    <nav aria-label="Menu navigasi utama" className="hidden lg:flex items-center space-x-1">
                        {menus?.map((menu: any) => {
                            const hasChildren = menu.children && menu.children.length > 0;
                            const active = isLinkActive(menu.url);

                            if (hasChildren) {
                                return (
                                    <div
                                        key={menu.id}
                                        className="relative"
                                        onMouseEnter={() => setActiveDropdown(menu.id)}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === menu.id ? null : menu.id)}
                                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                                                active || activeDropdown === menu.id
                                                    ? 'text-brand-700 dark:text-gold-400 bg-brand-50/70 dark:bg-neutral-900'
                                                    : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900'
                                            }`}
                                            aria-expanded={activeDropdown === menu.id}
                                        >
                                            <span>{menu.label}</span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 ${
                                                    activeDropdown === menu.id ? 'rotate-180 text-brand-700 dark:text-gold-400' : 'text-slate-400'
                                                }`}
                                            />
                                        </button>

                                        {/* Clean Vertical Dropdown Panel */}
                                        <div
                                            className={`absolute top-full left-0 pt-2 transition-all duration-200 z-50 ${
                                                activeDropdown === menu.id
                                                    ? 'opacity-100 visible translate-y-0'
                                                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                                            } min-w-[250px]`}
                                        >
                                            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-neutral-800 p-2 overflow-hidden">
                                                <div className="space-y-1">
                                                    {menu.children.map((child: any) => {
                                                        const childUrl = child.url || '#';
                                                        const isChildActive = isLinkActive(childUrl);

                                                        if (child.type === 'external') {
                                                            return (
                                                                <a
                                                                    key={child.id}
                                                                    href={childUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 dark:text-neutral-200 dark:hover:text-gold-400 dark:hover:bg-brand-950/50 transition-colors"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-neutral-600 group-hover:bg-brand-700 dark:group-hover:bg-gold-400 transition-colors" />
                                                                        <span>{child.label}</span>
                                                                    </span>
                                                                    <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 text-slate-400 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-opacity" />
                                                                </a>
                                                            );
                                                        }

                                                        if (child.type === 'label' || !child.url) {
                                                            return (
                                                                <span
                                                                    key={child.id}
                                                                    className="block px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400"
                                                                >
                                                                    {child.label}
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <Link
                                                                key={child.id}
                                                                href={childUrl}
                                                                className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                                                    isChildActive
                                                                        ? 'text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-neutral-800'
                                                                        : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 dark:text-neutral-200 dark:hover:text-gold-400 dark:hover:bg-brand-950/50'
                                                                }`}
                                                            >
                                                                <span className="flex items-center gap-2">
                                                                    <span
                                                                        className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                                                            isChildActive
                                                                                ? 'bg-brand-700 dark:bg-gold-400'
                                                                                : 'bg-slate-300 dark:bg-neutral-600 group-hover:bg-brand-700 dark:group-hover:bg-gold-400'
                                                                        }`}
                                                                    />
                                                                    <span>{child.label}</span>
                                                                </span>
                                                                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-700 dark:text-gold-400" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            const menuUrl = menu.url || '#';
                            if (menu.type === 'external') {
                                return (
                                    <a
                                        key={menu.id}
                                        href={menuUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3.5 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900 transition-colors"
                                    >
                                        {menu.label}
                                    </a>
                                );
                            }
                            if (menu.type === 'label' || !menu.url) {
                                return (
                                    <span
                                        key={menu.id}
                                        className="px-3.5 py-2 text-sm font-semibold text-slate-500 dark:text-neutral-400"
                                    >
                                        {menu.label}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={menu.id}
                                    href={menuUrl}
                                    className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                        active
                                            ? 'text-brand-700 dark:text-gold-400 bg-brand-50/70 dark:bg-neutral-900'
                                            : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900'
                                    }`}
                                >
                                    {menu.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side: Search, Theme Toggle, CTA */}
                    <div className="flex items-center gap-3">
                        {/* Quick Search to announcements */}
                        <Link
                            href="/announcements"
                            aria-label="Cari pengumuman"
                            className="p-2.5 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-brand-700 transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Ubah ke mode ${resolvedAppearance === 'dark' ? 'terang' : 'gelap'}`}
                            className="p-2.5 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-brand-700 dark:hover:text-gold-400 transition-colors cursor-pointer"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-gold-400" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        {/* Portal / Login CTA button matching Univrab style */}
                        <div className="hidden sm:block">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:shadow-md"
                                >
                                    <User className="h-3.5 w-3.5" />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                                >
                                    <LogIn className="h-3.5 w-3.5" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
                            className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 focus:outline-hidden"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isOpen && (
                <div className="lg:hidden bg-white/98 dark:bg-neutral-950/98 border-b border-slate-200 dark:border-neutral-800 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="px-4 py-4 space-y-2">
                        {menus?.map((menu: any) => {
                            const hasChildren = menu.children && menu.children.length > 0;
                            const isExpanded = mobileExpanded[menu.id];

                            if (hasChildren) {
                                return (
                                    <div key={menu.id} className="border-b border-slate-100 dark:border-neutral-800/80 pb-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleMobileSection(menu.id)}
                                            className="w-full flex items-center justify-between py-2 text-base font-bold text-slate-900 dark:text-white"
                                        >
                                            <span>{menu.label}</span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-slate-400 transition-transform ${
                                                    isExpanded ? 'rotate-180 text-brand-700' : ''
                                                }`}
                                            />
                                        </button>

                                        {isExpanded && (
                                            <div className="pl-3 py-1 space-y-1 border-l-2 border-brand-100 dark:border-neutral-800 ml-2 mt-1">
                                                {menu.children.map((child: any) => {
                                                    const childUrl = child.url || '#';
                                                    if (child.type === 'external') {
                                                        return (
                                                            <a
                                                                key={child.id}
                                                                href={childUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-between py-2 text-sm text-slate-700 dark:text-neutral-300 font-medium hover:text-brand-700 dark:hover:text-gold-400"
                                                            >
                                                                <span>{child.label}</span>
                                                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                                            </a>
                                                        );
                                                    }
                                                    if (child.type === 'label' || !child.url) {
                                                        return (
                                                            <span
                                                                key={child.id}
                                                                className="block py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400"
                                                            >
                                                                {child.label}
                                                            </span>
                                                        );
                                                    }
                                                    return (
                                                        <Link
                                                            key={child.id}
                                                            href={childUrl}
                                                            className="block py-2 text-sm text-slate-700 dark:text-neutral-300 font-medium hover:text-brand-700 dark:hover:text-gold-400"
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const menuUrl = menu.url || '#';
                            if (menu.type === 'external') {
                                return (
                                    <a
                                        key={menu.id}
                                        href={menuUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block py-2 text-base font-semibold text-slate-800 dark:text-neutral-200"
                                    >
                                        {menu.label}
                                    </a>
                                );
                            }
                            if (menu.type === 'label' || !menu.url) {
                                return (
                                    <span
                                        key={menu.id}
                                        className="block py-2 text-base font-semibold text-slate-500 dark:text-neutral-400"
                                    >
                                        {menu.label}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={menu.id}
                                    href={menuUrl}
                                    className="block py-2 text-base font-semibold text-slate-800 dark:text-neutral-200"
                                >
                                    {menu.label}
                                </Link>
                            );
                        })}

                        {/* Mobile Auth button */}
                        <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="w-full text-center py-2.5 rounded-xl bg-brand-700 text-white font-bold text-sm shadow-xs"
                                >
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full text-center py-2.5 rounded-xl border border-brand-700 text-brand-700 dark:text-gold-400 dark:border-gold-400 font-bold text-sm"
                                >
                                    Masuk Akun (Login)
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
