import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, Award } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { settings } = usePage().props as any;
    const appName = settings?.app_name || 'LPDSA';
    const appDesc = settings?.app_description || 'Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab';

    return (
        <div className="relative min-h-screen grid lg:grid-cols-12 bg-white dark:bg-neutral-950 selection:bg-brand-700 selection:text-white">
            {/* Left Decorative Brand Panel (Visible on lg+) */}
            <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between p-12 bg-linear-to-br from-brand-900 via-brand-800 to-plum-950 text-white overflow-hidden">
                {/* Dot pattern */}
                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

                {/* Top: Brand Logo + Back link */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link href={home()} className="flex items-center gap-3 group">
                        <AppLogo className="h-11 w-11 rounded-xl bg-white/10 p-1 border border-white/20 group-hover:scale-105 transition-transform" />
                        <div>
                            <span className="block text-xl font-black tracking-tight text-white">
                                {appName}
                            </span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-gold-400">
                                Universitas Abdurrab
                            </span>
                        </div>
                    </Link>

                    <Link
                        href={home()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Ke Beranda</span>
                    </Link>
                </div>

                {/* Center / Middle Statement */}
                <div className="relative z-10 max-w-md my-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-bold uppercase tracking-wider text-gold-300">
                        <ShieldCheck className="h-4 w-4 text-gold-400" />
                        <span>Portal Administrasi Terpadu</span>
                    </div>

                    <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight text-balance">
                        Penjaminan Mutu & Pengelolaan Data Pendidikan Tinggi
                    </h2>

                    <p className="text-sm text-slate-200 leading-relaxed">
                        {appDesc}
                    </p>

                    <div className="pt-2 flex items-center gap-4 text-xs text-gold-300">
                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span>Terakreditasi BAN-PT</span>
                        </div>
                        <span>•</span>
                        <span>Berbasis Nilai Rabbani</span>
                    </div>
                </div>

                {/* Bottom Notice */}
                <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-slate-300 flex justify-between items-center">
                    <span>&copy; {new Date().getFullYear()} LPDSA Universitas Abdurrab</span>
                    <a
                        href="https://univrab.ac.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:underline"
                    >
                        univrab.ac.id
                    </a>
                </div>
            </div>

            {/* Right Form Container (Col 7 / 6) */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-md space-y-8">
                    {/* Mobile Brand Header */}
                    <div className="lg:hidden flex items-center justify-between pb-6 border-b border-slate-100 dark:border-neutral-800">
                        <Link href={home()} className="flex items-center gap-2.5">
                            <AppLogo className="h-9 w-9 rounded-lg" />
                            <div>
                                <span className="font-extrabold text-base text-brand-700 dark:text-gold-400 block leading-tight">
                                    {appName}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase block">
                                    Universitas Abdurrab
                                </span>
                            </div>
                        </Link>
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:text-brand-700"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Beranda</span>
                        </Link>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {title || 'Masuk ke Akun Anda'}
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                            {description || 'Masukkan kredensial akun Anda untuk mengakses sistem.'}
                        </p>
                    </div>

                    {/* Form Children */}
                    <div className="pt-2">{children}</div>
                </div>
            </div>
        </div>
    );
}
