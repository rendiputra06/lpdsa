import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function Navbar() {
    const { menus, auth } = usePage().props as any;
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo className="h-8 w-auto fill-univrab-blue dark:fill-univrab-gold" />
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-bold tracking-tight text-univrab-blue dark:text-univrab-gold">LPDSA</span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase">Universitas Abdurrab</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {menus?.map((menu: any) => (
                                <Link
                                    key={menu.id}
                                    href={menu.url}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold transition-colors"
                                >
                                    {menu.label}
                                </Link>
                            ))}
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
                            <Link
                                key={menu.id}
                                href={menu.url}
                                className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-100 hover:text-univrab-blue dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-univrab-gold"
                            >
                                {menu.label}
                            </Link>
                        ))}
                        {!auth.user && (
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
