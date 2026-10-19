import { Link, usePage, router } from '@inertiajs/react';
import {
    Menu as MenuIcon,
    X,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Moon,
    Sun,
    Search,
    User,
    LogIn,
    Phone,
    Mail,
    Globe,
} from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppLogo from '@/components/app-logo';
import { useAppearance } from '@/hooks/use-appearance';

interface MenuItemProps {
    id: number;
    label: string;
    type: 'internal' | 'external' | 'label';
    url: string | null;
    order: number;
    parent_id: number | null;
    children?: MenuItemProps[];
    children_recursive?: MenuItemProps[];
}

const getChildren = (item: any): any[] => item?.children || item?.children_recursive || [];

const isItemActive = (menuUrl: string | null, currentUrl: string): boolean => {
    if (!menuUrl || menuUrl === '#' || typeof currentUrl !== 'string') {
        return false;
    }

    const cleanCurrent = currentUrl.split('?')[0].split('#')[0];
    const cleanMenu = menuUrl.split('?')[0].split('#')[0];

    if (cleanMenu === '/') {
        return cleanCurrent === '/';
    }

    return cleanCurrent === cleanMenu || cleanCurrent.startsWith(cleanMenu + '/');
};

const isMenuBranchActive = (item: any, currentUrl: string): boolean => {
    if (item?.url && isItemActive(item.url, currentUrl)) {
        return true;
    }

    const children = getChildren(item);

    return children.some((child: any) => isMenuBranchActive(child, currentUrl));
};

function DesktopMenuItem({
    item,
    depth = 2,
    currentUrl,
    onCloseAll,
}: {
    item: MenuItemProps;
    depth?: number;
    currentUrl: string;
    onCloseAll?: () => void;
}) {
    const children = getChildren(item);
    const hasChildren = children.length > 0;
    const itemUrl = item.url || '#';
    const isActive = isItemActive(item.url, currentUrl);
    const isBranchActive = isMenuBranchActive(item, currentUrl);
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);
    const flyoutTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleFlyoutOpen = useCallback(() => {
        if (flyoutTimerRef.current) {
            clearTimeout(flyoutTimerRef.current);
            flyoutTimerRef.current = null;
        }

        setIsFlyoutOpen(true);
    }, []);

    const handleFlyoutClose = useCallback(() => {
        if (flyoutTimerRef.current) {
            clearTimeout(flyoutTimerRef.current);
        }

        flyoutTimerRef.current = setTimeout(() => {
            setIsFlyoutOpen(false);
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (flyoutTimerRef.current) {
                clearTimeout(flyoutTimerRef.current);
            }
        };
    }, []);

    if (item.type === 'label' && !hasChildren) {
        return (
            <span className="block px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400">
                {item.label}
            </span>
        );
    }

    if (item.type === 'label' && hasChildren) {
        return (
            <div className="pt-2 pb-1 first:pt-0">
                <span className="block px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gold-400/80">
                    {item.label}
                </span>
                <div className="space-y-0.5 mt-0.5 pl-1">
                    {children.map((child: any) => (
                        <DesktopMenuItem
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            currentUrl={currentUrl}
                            onCloseAll={onCloseAll}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (hasChildren) {
        return (
            <div
                className="relative group/sub"
                onMouseEnter={handleFlyoutOpen}
                onMouseLeave={handleFlyoutClose}
            >
                <button
                    type="button"
                    onClick={() => {
                        if (isFlyoutOpen) {
                            handleFlyoutClose();
                        } else {
                            handleFlyoutOpen();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleFlyoutOpen();
                        } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
                            e.preventDefault();
                            setIsFlyoutOpen(false);
                        }
                    }}
                    aria-haspopup="true"
                    aria-expanded={isFlyoutOpen}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-colors cursor-pointer text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400 ${
                        isActive || isBranchActive || isFlyoutOpen
                            ? 'text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-neutral-800'
                            : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 dark:text-neutral-200 dark:hover:text-gold-400 dark:hover:bg-brand-950/50'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <span
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                isActive || isBranchActive || isFlyoutOpen
                                    ? 'bg-brand-700 dark:bg-gold-400'
                                    : 'bg-slate-300 dark:bg-neutral-600'
                            }`}
                        />
                        <span>{item.label}</span>
                    </span>
                    <ChevronRight
                        className={`h-3.5 w-3.5 text-slate-400 group-hover/sub:text-brand-700 dark:group-hover/sub:text-gold-400 transition-transform ${
                            isFlyoutOpen ? 'translate-x-0.5 text-brand-700 dark:text-gold-400' : ''
                        }`}
                    />
                </button>

                <div
                    onMouseEnter={handleFlyoutOpen}
                    onMouseLeave={handleFlyoutClose}
                    className={`absolute left-full top-0 -ml-2 pl-3 min-w-[240px] z-50 transition-all duration-150 ${
                        isFlyoutOpen
                            ? 'opacity-100 visible translate-x-0'
                            : 'opacity-0 invisible -translate-x-1 pointer-events-none'
                    }`}
                >
                    {/* Invisible diagonal hover-bridge (Safe corridor covering mouse path) */}
                    <div
                        className="absolute -left-6 -top-4 -bottom-4 w-10 pointer-events-auto"
                        aria-hidden="true"
                    />

                    <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-neutral-800 p-2 space-y-1">
                        {children.map((child: any) => (
                            <DesktopMenuItem
                                key={child.id}
                                item={child}
                                depth={depth + 1}
                                currentUrl={currentUrl}
                                onCloseAll={onCloseAll}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (item.type === 'external') {
        return (
            <a
                href={itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onCloseAll}
                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 dark:text-neutral-200 dark:hover:text-gold-400 dark:hover:bg-brand-950/50 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
            >
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-neutral-600 group-hover:bg-brand-700 dark:group-hover:bg-gold-400 transition-colors" />
                    <span>{item.label}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 text-slate-400 group-hover:text-brand-700 dark:group-hover:text-gold-400 transition-opacity" />
            </a>
        );
    }

    return (
        <Link
            href={itemUrl}
            onClick={onCloseAll}
            className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400 ${
                isActive
                    ? 'text-brand-700 dark:text-gold-400 bg-brand-50 dark:bg-neutral-800 font-semibold'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50/70 dark:text-neutral-200 dark:hover:text-gold-400 dark:hover:bg-brand-950/50'
            }`}
        >
            <span className="flex items-center gap-2">
                <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        isActive
                            ? 'bg-brand-700 dark:bg-gold-400'
                            : 'bg-slate-300 dark:bg-neutral-600 group-hover:bg-brand-700 dark:group-hover:bg-gold-400'
                    }`}
                />
                <span>{item.label}</span>
            </span>
            <ChevronRight
                className={`h-3.5 w-3.5 transition-opacity ${
                    isActive
                        ? 'opacity-100 text-brand-700 dark:text-gold-400'
                        : 'opacity-0 group-hover:opacity-100 text-brand-700 dark:text-gold-400'
                }`}
            />
        </Link>
    );
}

function MobileMenuItem({
    item,
    depth = 2,
    currentUrl,
    mobileExpanded,
    toggleMobileSection,
    onCloseDrawer,
}: {
    item: MenuItemProps;
    depth?: number;
    currentUrl: string;
    mobileExpanded: Record<number, boolean>;
    toggleMobileSection: (id: number) => void;
    onCloseDrawer: () => void;
}) {
    const children = getChildren(item);
    const hasChildren = children.length > 0;
    const isExpanded = Boolean(mobileExpanded[item.id]);
    const itemUrl = item.url || '#';
    const isActive = isItemActive(item.url, currentUrl);
    const isBranchActive = isMenuBranchActive(item, currentUrl);

    if (item.type === 'label') {
        return (
            <div className="py-1">
                <span className="block py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-gold-400">
                    {item.label}
                </span>
                {hasChildren && (
                    <div className="pl-3 py-1 space-y-1 border-l-2 border-slate-200 dark:border-neutral-800 ml-1">
                        {children.map((child: any) => (
                            <MobileMenuItem
                                key={child.id}
                                item={child}
                                depth={depth + 1}
                                currentUrl={currentUrl}
                                mobileExpanded={mobileExpanded}
                                toggleMobileSection={toggleMobileSection}
                                onCloseDrawer={onCloseDrawer}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (hasChildren) {
        return (
            <div className="py-1">
                <button
                    type="button"
                    onClick={() => toggleMobileSection(item.id)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-sm font-semibold transition-colors ${
                        isBranchActive || isExpanded
                            ? 'text-brand-700 dark:text-gold-400 bg-brand-50/60 dark:bg-neutral-900/60'
                            : 'text-slate-800 dark:text-neutral-200 hover:text-brand-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        {isBranchActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-gold-400" />
                        )}
                        <span>{item.label}</span>
                    </span>
                    <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-180 text-brand-700 dark:text-gold-400' : ''
                        }`}
                    />
                </button>
                {isExpanded && (
                    <div className="pl-3 py-1 space-y-1 border-l-2 border-brand-100 dark:border-neutral-800 ml-1 mt-0.5">
                        {children.map((child: any) => (
                            <MobileMenuItem
                                key={child.id}
                                item={child}
                                depth={depth + 1}
                                currentUrl={currentUrl}
                                mobileExpanded={mobileExpanded}
                                toggleMobileSection={toggleMobileSection}
                                onCloseDrawer={onCloseDrawer}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (item.type === 'external') {
        return (
            <a
                href={itemUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onCloseDrawer}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg text-sm text-slate-700 dark:text-neutral-300 font-medium hover:text-brand-700 dark:hover:text-gold-400 transition-colors"
            >
                <span>{item.label}</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            </a>
        );
    }

    return (
        <Link
            href={itemUrl}
            onClick={onCloseDrawer}
            className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                    ? 'text-brand-700 dark:text-gold-400 bg-brand-50/80 dark:bg-neutral-900 font-semibold'
                    : 'text-slate-700 dark:text-neutral-300 hover:text-brand-700 dark:hover:text-gold-400 hover:bg-slate-50 dark:hover:bg-neutral-900/50'
            }`}
        >
            <span>{item.label}</span>
            {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-700 dark:bg-gold-400" />}
        </Link>
    );
}

export default function Navbar() {
    const { url } = usePage();
    const { menus, auth, settings } = usePage().props as any;
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<Record<number, boolean>>({});
    const [scrolled, setScrolled] = useState(false);
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const headerRef = useRef<HTMLElement | null>(null);
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    const phone = settings?.contact_phone || '(+62) 761 387 62';
    const email = settings?.contact_email || 'lpdsa@univrab.ac.id';
    const facebook = settings?.social_facebook || 'https://facebook.com/univrab.official';
    const instagram = settings?.social_instagram || 'https://instagram.com/univrab.official';
    const youtube = settings?.social_youtube || 'https://youtube.com/@UniversitasAbdurrabOfficial';

    const handleRootMouseEnter = useCallback((id: number) => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }

        setActiveDropdown(id);
    }, []);

    const handleRootMouseLeave = useCallback(() => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
        }

        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 300);
    }, []);

    useEffect(() => {
        return () => {
            if (dropdownTimerRef.current) {
                clearTimeout(dropdownTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close mobile menu & dropdown on route change
    useEffect(() => {
        const unregister = router.on('navigate', () => {
            setIsOpen(false);
            setActiveDropdown(null);
        });

        return () => {
            unregister();
        };
    }, []);

    // Click outside and Escape key handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveDropdown(null);
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const toggleTheme = () => {
        updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark');
    };

    const toggleMobileSection = (id: number) => {
        setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <header
            ref={headerRef}
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-neutral-800'
                    : 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xs border-b border-slate-200/60 dark:border-neutral-800/80'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-15' : 'h-16'}`}>
                    {/* Mobile Brand Logo (Visible only on mobile since desktop brand is in TopBar) */}
                    <div className="flex items-center shrink-0 lg:hidden">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <AppLogo className="h-9 w-9 rounded-xl shadow-xs group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                                <span className="text-base font-black tracking-tight text-brand-700 dark:text-gold-400 group-hover:text-brand-800 transition-colors leading-tight">
                                    {settings?.app_name || 'LPDSA'}
                                </span>
                                <span className="text-[9px] font-bold tracking-wider uppercase text-slate-500 dark:text-neutral-400 leading-none">
                                    Universitas Abdurrab
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Left: Scrolled Compact Brand + Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2 min-w-0">
                        {/* Compact Brand shown ONLY when scrolled down past TopBar */}
                        {scrolled && (
                            <Link
                                href="/"
                                className="flex items-center gap-2.5 mr-3 pr-3.5 border-r border-slate-200 dark:border-neutral-800 shrink-0 group transition-all duration-300"
                            >
                                <AppLogo className="h-8 w-8 rounded-lg shadow-xs group-hover:scale-105 transition-transform" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-black tracking-tight text-brand-700 dark:text-gold-400 group-hover:text-brand-800 transition-colors leading-none">
                                        {settings?.app_name || 'LPDSA'}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 leading-none mt-0.5">
                                        Univrab
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Desktop Navigation Menu */}
                        <nav aria-label="Menu navigasi utama" className="flex items-center space-x-1">
                        {menus?.map((menu: any) => {
                            const children = getChildren(menu);
                            const hasChildren = children.length > 0;
                            const isBranchActive = isMenuBranchActive(menu, url);
                            const active = isItemActive(menu.url, url);

                            if (hasChildren) {
                                return (
                                    <div
                                        key={menu.id}
                                        className="relative"
                                        onMouseEnter={() => handleRootMouseEnter(menu.id)}
                                        onMouseLeave={handleRootMouseLeave}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (activeDropdown === menu.id) {
                                                    setActiveDropdown(null);
                                                } else {
                                                    handleRootMouseEnter(menu.id);
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleRootMouseEnter(menu.id);
                                                } else if (e.key === 'Escape' || e.key === 'ArrowUp') {
                                                    e.preventDefault();
                                                    setActiveDropdown(null);
                                                }
                                            }}
                                            aria-haspopup="true"
                                            aria-expanded={activeDropdown === menu.id}
                                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400 ${
                                                isBranchActive || activeDropdown === menu.id
                                                    ? 'text-brand-700 dark:text-gold-400 bg-brand-50/70 dark:bg-neutral-900 font-bold'
                                                    : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900'
                                            }`}
                                        >
                                            <span>{menu.label}</span>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 ${
                                                    activeDropdown === menu.id ? 'rotate-180 text-brand-700 dark:text-gold-400' : 'text-slate-400'
                                                }`}
                                            />
                                        </button>

                                        {/* Dropdown Panel with Hover Bridge */}
                                        <div
                                            onMouseEnter={() => handleRootMouseEnter(menu.id)}
                                            onMouseLeave={handleRootMouseLeave}
                                            className={`absolute top-full left-0 pt-1.5 transition-all duration-200 z-50 ${
                                                activeDropdown === menu.id
                                                    ? 'opacity-100 visible translate-y-0'
                                                    : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                                            } min-w-[250px]`}
                                        >
                                            {/* Invisible bridge between button and dropdown */}
                                            <div
                                                className="absolute inset-x-0 -top-3 h-4 pointer-events-auto"
                                                aria-hidden="true"
                                            />

                                            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-neutral-800 p-2">
                                                <div className="space-y-1">
                                                    {children.map((child: any) => (
                                                        <DesktopMenuItem
                                                            key={child.id}
                                                            item={child}
                                                            depth={2}
                                                            currentUrl={url}
                                                            onCloseAll={() => setActiveDropdown(null)}
                                                        />
                                                    ))}
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
                                        className="px-3.5 py-2 text-sm font-semibold rounded-lg text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400"
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
                                    className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700 dark:focus-visible:ring-gold-400 ${
                                        active
                                            ? 'text-brand-700 dark:text-gold-400 bg-brand-50/70 dark:bg-neutral-900 font-bold'
                                            : 'text-slate-700 hover:text-brand-700 hover:bg-slate-50 dark:text-neutral-300 dark:hover:text-gold-400 dark:hover:bg-neutral-900'
                                    }`}
                                >
                                    {menu.label}
                                </Link>
                            );
                        })}
                        </nav>
                    </div>

                    {/* Right side: Search, Theme Toggle, CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Quick Search to announcements */}
                        <Link
                            href="/announcements"
                            aria-label="Cari pengumuman"
                            className="p-2.5 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-brand-700 dark:hover:text-gold-400 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                            <Search className="h-4 w-4" />
                        </Link>

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Ubah ke mode ${resolvedAppearance === 'dark' ? 'terang' : 'gelap'}`}
                            className="p-2.5 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 hover:text-brand-700 dark:hover:text-gold-400 transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="h-4 w-4 text-gold-400" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </button>

                        {/* Portal / Login CTA button */}
                        <div className="hidden sm:block">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:shadow-md focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
                                >
                                    <User className="h-3.5 w-3.5" />
                                    <span>Dashboard</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:shadow-md hover:scale-[1.02] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
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
                            className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-700"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer with Backdrop */}
            {isOpen && (
                <>
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
                        aria-hidden="true"
                    />
                    <div className="relative z-50 lg:hidden bg-white/98 dark:bg-neutral-950/98 border-b border-slate-200 dark:border-neutral-800 shadow-xl max-h-[calc(100vh-4.5rem)] overflow-y-auto">
                        <div className="px-4 py-4 space-y-2">
                        {menus?.map((menu: any) => {
                            const children = getChildren(menu);
                            const hasChildren = children.length > 0;
                            const isExpanded = mobileExpanded[menu.id];
                            const isBranchActive = isMenuBranchActive(menu, url);
                            const active = isItemActive(menu.url, url);

                            if (hasChildren) {
                                return (
                                    <div key={menu.id} className="border-b border-slate-100 dark:border-neutral-800/80 pb-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleMobileSection(menu.id)}
                                            aria-expanded={Boolean(isExpanded)}
                                            className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-base font-bold transition-colors ${
                                                isBranchActive
                                                    ? 'text-brand-700 dark:text-gold-400 bg-brand-50/70 dark:bg-neutral-900/70'
                                                    : 'text-slate-900 dark:text-white'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isBranchActive && (
                                                    <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-gold-400" />
                                                )}
                                                <span>{menu.label}</span>
                                            </span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-slate-400 transition-transform ${
                                                    isExpanded ? 'rotate-180 text-brand-700 dark:text-gold-400' : ''
                                                }`}
                                            />
                                        </button>

                                        {isExpanded && (
                                            <div className="pl-3 py-1 space-y-1 border-l-2 border-brand-100 dark:border-neutral-800 ml-2 mt-1">
                                                {children.map((child: any) => (
                                                    <MobileMenuItem
                                                        key={child.id}
                                                        item={child}
                                                        depth={2}
                                                        currentUrl={url}
                                                        mobileExpanded={mobileExpanded}
                                                        toggleMobileSection={toggleMobileSection}
                                                        onCloseDrawer={() => setIsOpen(false)}
                                                    />
                                                ))}
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
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between py-2 px-2.5 text-base font-semibold text-slate-800 dark:text-neutral-200 hover:text-brand-700 dark:hover:text-gold-400"
                                    >
                                        <span>{menu.label}</span>
                                        <ExternalLink className="h-4 w-4 text-slate-400" />
                                    </a>
                                );
                            }

                            if (menu.type === 'label' || !menu.url) {
                                return (
                                    <span
                                        key={menu.id}
                                        className="block py-2 px-2.5 text-base font-semibold text-slate-500 dark:text-neutral-400"
                                    >
                                        {menu.label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={menu.id}
                                    href={menuUrl}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-base font-semibold transition-colors ${
                                        active
                                            ? 'text-brand-700 dark:text-gold-400 bg-brand-50/80 dark:bg-neutral-900 font-bold'
                                            : 'text-slate-800 dark:text-neutral-200 hover:text-brand-700 dark:hover:text-gold-400'
                                    }`}
                                >
                                    <span>{menu.label}</span>
                                    {active && <span className="h-2 w-2 rounded-full bg-brand-700 dark:bg-gold-400" />}
                                </Link>
                            );
                        })}

                        {/* Mobile Auth button */}
                        <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-xs"
                                >
                                    Dashboard Admin
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center py-2.5 rounded-xl border border-brand-700 text-brand-700 dark:text-gold-400 dark:border-gold-400 font-bold text-sm hover:bg-brand-50 dark:hover:bg-neutral-900"
                                >
                                    Masuk Akun (Login)
                                </Link>
                            )}
                        </div>

                        {/* Mobile Quick Contact & Links Section */}
                        <div className="pt-4 mt-2 border-t border-slate-200/80 dark:border-neutral-800 space-y-3 text-xs text-slate-600 dark:text-neutral-400">
                            <span className="block font-bold uppercase tracking-wider text-[11px] text-brand-700 dark:text-gold-400">
                                Kontak & Layanan Cepat
                            </span>
                            <div className="space-y-2">
                                <a
                                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                    className="flex items-center gap-2 hover:text-brand-700 dark:hover:text-gold-400"
                                >
                                    <Phone className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400 shrink-0" />
                                    <span>{phone}</span>
                                </a>
                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-2 hover:text-brand-700 dark:hover:text-gold-400"
                                >
                                    <Mail className="h-3.5 w-3.5 text-brand-700 dark:text-gold-400 shrink-0" />
                                    <span>{email}</span>
                                </a>
                                <a
                                    href="https://univrab.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-brand-700 dark:text-gold-400 font-medium"
                                >
                                    <Globe className="h-3.5 w-3.5 shrink-0" />
                                    <span>Portal Utama univrab.ac.id</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <span className="text-[11px] text-slate-400">Ikuti:</span>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook Universitas Abdurrab"
                                    className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram Universitas Abdurrab"
                                    className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href={youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube Universitas Abdurrab"
                                    className="hover:text-brand-700 dark:hover:text-gold-400 transition-colors"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            )}
        </header>
    );
}
