import { Link, usePage } from '@inertiajs/react';
import { Phone, Mail, MapPin, Globe, ExternalLink } from 'lucide-react';
import AppLogo from '@/components/app-logo';

export default function Footer() {
    const { settings } = usePage().props as any;

    const appName = settings?.app_name || 'LPDSA';
    const appDesc = settings?.app_description || 'Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab';
    const phone = settings?.contact_phone || '(+62) 761 387 62';
    const email = settings?.contact_email || 'lpdsa@univrab.ac.id';
    const address = settings?.contact_address || 'Jl. Riau Ujung No. 73, Tampan, Pekanbaru, Riau 28291';
    const facebook = settings?.social_facebook || 'https://facebook.com/univrab.official';
    const instagram = settings?.social_instagram || 'https://instagram.com/univrab.official';
    const youtube = settings?.social_youtube || 'https://youtube.com/@UniversitasAbdurrabOfficial';

    return (
        <footer className="relative bg-linear-to-br from-brand-900 via-brand-950 to-plum-950 text-white overflow-hidden">
            {/* Background dot pattern */}
            <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Col 1: Identity & Socials */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <AppLogo className="h-10 w-10 rounded-xl bg-white/10 p-1 border border-white/20" />
                            <div>
                                <span className="block text-xl font-black tracking-tight text-white">
                                    {appName}
                                </span>
                                <span className="block text-[10px] font-bold tracking-wider uppercase text-gold-400">
                                    Universitas Abdurrab
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            {appDesc}
                        </p>

                        <div className="pt-2">
                            <span className="block text-xs font-bold uppercase tracking-wider text-gold-400 mb-2.5">
                                Media Sosial
                            </span>
                            <div className="flex items-center gap-3">
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook Universitas Abdurrab"
                                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-gold-500 hover:text-neutral-950 flex items-center justify-center transition-all"
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
                                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-gold-500 hover:text-neutral-950 flex items-center justify-center transition-all"
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
                                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-gold-500 hover:text-neutral-950 flex items-center justify-center transition-all"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Hubungi Kami */}
                    <div className="space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-white/10 pb-2">
                            Hubungi Kami
                        </span>
                        <div className="space-y-3 text-xs text-slate-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 shrink-0 text-gold-400 mt-0.5" />
                                <span>{address}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 shrink-0 text-gold-400" />
                                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-gold-300 transition-colors">
                                    {phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 shrink-0 text-gold-400" />
                                <a href={`mailto:${email}`} className="hover:text-gold-300 transition-colors">
                                    {email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Lokasi Kampus Abdurrab (Matching Univrab Footer) */}
                    <div className="space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-white/10 pb-2">
                            Lokasi Kampus
                        </span>
                        <div className="space-y-3 text-xs text-slate-300">
                            <div>
                                <span className="font-bold text-white block mb-0.5">Kampus 1 (Utama):</span>
                                <span className="text-slate-300 text-[11px] leading-tight block">
                                    Jl. Riau Ujung No. 73, Tampan, Kota Pekanbaru, Riau 28291
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-white block mb-0.5">Kampus 2:</span>
                                <span className="text-slate-300 text-[11px] leading-tight block">
                                    Jl. Bakti No. 32 (Jl. Bhakti), Tangkerang Barat, Pekanbaru
                                </span>
                            </div>
                            <div>
                                <span className="font-bold text-white block mb-0.5">Kampus 3:</span>
                                <span className="text-slate-300 text-[11px] leading-tight block">
                                    Jl. Pattimura, Cinta Raja, Sail, Kota Pekanbaru 28127
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Col 4: Tautan Cepat */}
                    <div className="space-y-4">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-white/10 pb-2">
                            Tautan Penting
                        </span>
                        <ul className="space-y-2 text-xs text-slate-300">
                            <li>
                                <Link href="/announcements" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                                    <span>Arsip Pengumuman</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/dokumen" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                                    <span>Pusat Dokumen & SOP</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/struktur-organisasi" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                                    <span>Struktur Organisasi LPDSA</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                                    <span>Tentang LPDSA</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5">
                                    <span>Kontak Lembaga</span>
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://univrab.ac.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gold-300 transition-colors inline-flex items-center gap-1.5 text-gold-400"
                                >
                                    <span>Website Utama Univrab</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>
                        &copy; {new Date().getFullYear()} {appName} Universitas Abdurrab. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hover:text-white transition-colors">
                            Portal Staf / Admin
                        </Link>
                        <span>•</span>
                        <a
                            href="https://univrab.ac.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-1"
                        >
                            <Globe className="h-3.5 w-3.5 text-gold-400" />
                            <span>univrab.ac.id</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
