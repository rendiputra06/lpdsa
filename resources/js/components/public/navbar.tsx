import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function Navbar() {
    const { menus, auth, settings } = usePage().props as any;
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center relative">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-8 fill-univrab-blue dark:fill-univrab-gold" />
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold tracking-tight text-univrab-blue dark:text-univrab-gold">
                                    {settings?.app_name || 'LPDSA'}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase">
                                    {settings?.app_description || 'Universitas Abdurrab'}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-1">
                        {menus?.map((menu: any) => (
                            <div key={menu.id} className="relative group">
                                {menu.children && menu.children.length > 0 ? (
                                    <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold transition-colors">
                                        {menu.label}
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                ) : (
                                    menu.type === 'label' ? (
                                        <span className="cursor-default rounded-md px-3 py-2 text-sm font-medium text-slate-600">{menu.label}</span>
                                    ) : menu.type === 'external' ? (
                                        <a
                                            href={menu.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold transition-colors"
                                        >
                                            {menu.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={menu.url}
                                            className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold transition-colors"
                                        >
                                            {menu.label}
                                        </Link>
                                    )
                                )}
                                {menu.children && menu.children.length > 0 && (
                                    <div className={`absolute top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 ${menu.children.some((c: any) => c.children?.length > 0) ? 'left-1/2 -translate-x-1/2 w-max max-w-5xl' : 'left-0 w-48'}`}>
                                        <div className={`bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-slate-200 dark:border-neutral-800 overflow-hidden ${menu.children.some((c: any) => c.children?.length > 0) ? 'p-6 flex gap-8' : 'py-1'}`}>
                                            {menu.children.map((child: any) => {
                                                const hasSubChildren = child.children && child.children.length > 0;
                                                const isMegaMenu = menu.children.some((c: any) => c.children?.length > 0);

                                                if (isMegaMenu) {
                                                    return (
                                                        <div key={child.id} className="flex flex-col min-w-[200px]">
                                                            {child.type === 'label' ? (
                                                                <div className="font-bold text-sm text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2 uppercase tracking-wider">
                                                                    {child.label}
                                                                </div>
                                                            ) : child.type === 'external' ? (
                                                                <a href={child.url} target="_blank" rel="noopener noreferrer" className="font-bold text-sm text-univrab-blue dark:text-univrab-gold hover:underline mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2 uppercase tracking-wider block">
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link href={child.url} className="font-bold text-sm text-univrab-blue dark:text-univrab-gold hover:underline mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2 uppercase tracking-wider block">
                                                                    {child.label}
                                                                </Link>
                                                            )}

                                                            {hasSubChildren && (
                                                                <div className="flex flex-col gap-1.5 mt-1">
                                                                    {child.children.map((sub: any) => (
                                                                        sub.type === 'external' ? (
                                                                            <a key={sub.id} href={sub.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold py-1 transition-colors">
                                                                                {sub.label}
                                                                            </a>
                                                                        ) : (
                                                                            <Link key={sub.id} href={sub.url} className="text-sm text-slate-600 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold py-1 transition-colors">
                                                                                {sub.label}
                                                                            </Link>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }

                                                // Regular Dropdown Item
                                                return child.type === 'label' ? (
                                                    <div key={child.id} className="block px-4 py-2 text-sm text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950/50 cursor-default">
                                                        {child.label}
                                                    </div>
                                                ) : child.type === 'external' ? (
                                                    <a
                                                        key={child.id}
                                                        href={child.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-univrab-blue dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-univrab-gold transition-colors"
                                                    >
                                                        {child.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={child.id}
                                                        href={child.url}
                                                        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-univrab-blue dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-univrab-gold transition-colors"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-md bg-univrab-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-md border border-univrab-blue px-4 py-2 text-sm font-medium text-univrab-blue hover:bg-univrab-blue hover:text-white transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b dark:bg-neutral-950 dark:border-neutral-800">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        {menus?.map((menu: any) => (
                            <div key={menu.id}>
                                {menu.children && menu.children.length > 0 ? (
                                    <>
                                        <div className="px-3 py-2 text-base font-semibold text-slate-900 border-b border-slate-100 dark:text-white dark:border-neutral-800">
                                            {menu.label}
                                        </div>
                                        <div className="pl-4">
                                            {menu.children.map((child: any) => (
                                                <div key={child.id}>
                                                    {child.type === 'label' ? (
                                                        <div className="block rounded-md px-3 py-2 mt-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider cursor-default">
                                                            {child.label}
                                                        </div>
                                                    ) : child.type === 'external' ? (
                                                        <a
                                                            href={child.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-univrab-blue dark:hover:bg-neutral-900 dark:hover:text-univrab-gold ${child.children && child.children.length > 0 ? 'text-slate-900 dark:text-white font-bold uppercase tracking-wider mt-2' : 'text-slate-600 dark:text-neutral-400'}`}
                                                        >
                                                            {child.label}
                                                        </a>
                                                    ) : (
                                                        <Link
                                                            href={child.url}
                                                            className={`block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-univrab-blue dark:hover:bg-neutral-900 dark:hover:text-univrab-gold ${child.children && child.children.length > 0 ? 'text-slate-900 dark:text-white font-bold uppercase tracking-wider mt-2' : 'text-slate-600 dark:text-neutral-400'}`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    )}

                                                    {child.children && child.children.length > 0 && (
                                                        <div className="pl-4 pb-2 border-l-2 border-slate-100 dark:border-neutral-800 ml-3">
                                                            {child.children.map((sub: any) => (
                                                                sub.type === 'external' ? (
                                                                    <a
                                                                        key={sub.id}
                                                                        href={sub.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold"
                                                                    >
                                                                        {sub.label}
                                                                    </a>
                                                                ) : (
                                                                    <Link
                                                                        key={sub.id}
                                                                        href={sub.url}
                                                                        className="block rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold"
                                                                    >
                                                                        {sub.label}
                                                                    </Link>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    menu.type === 'label' ? (
                                        <div className="block rounded-md px-3 py-2 text-base font-medium text-slate-500 cursor-default">
                                            {menu.label}
                                        </div>
                                    ) : menu.type === 'external' ? (
                                        <a
                                            href={menu.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold"
                                        >
                                            {menu.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={menu.url}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold"
                                        >
                                            {menu.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        ))}
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="block rounded-md px-3 py-2 text-base font-medium bg-univrab-blue text-white hover:bg-blue-800"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block rounded-md px-3 py-2 text-base font-medium text-univrab-blue hover:bg-slate-100"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
