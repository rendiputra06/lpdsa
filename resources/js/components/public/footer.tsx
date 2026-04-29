import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { contactPage } = usePage().props as any;

    // Extract contact info from content or use fallback
    const getContactInfo = () => {
        if (!contactPage || !contactPage.content) {
            return {
                address: 'Jl. Riau Ujung No. 73, Pekanbaru',
                email: 'lpdsa@univrab.ac.id',
                phone: '(0761) 123456'
            };
        }

        // Try to extract from HTML content
        const content = contactPage.content;
        const addressMatch = content.match(/Alamat:\s*([^<]+)/);
        const emailMatch = content.match(/Email:\s*([^<]+)/);
        const phoneMatch = content.match(/Telp:\s*([^<]+)/);

        return {
            address: addressMatch ? addressMatch[1].trim() : 'Jl. Riau Ujung No. 73, Pekanbaru',
            email: emailMatch ? emailMatch[1].trim() : 'lpdsa@univrab.ac.id',
            phone: phoneMatch ? phoneMatch[1].trim() : '(0761) 123456'
        };
    };

    const contactInfo = getContactInfo();

    return (
        <footer className="bg-slate-900 text-slate-300 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">LPDSA Universitas Abdurrab</h3>
                        <p className="text-sm leading-relaxed">
                            Lembaga Pangkalan Data, SPMI, dan Akreditasi.
                            Menjamin mutu akademik dan akurasi data universitas.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Tautan Cepat</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/announcements" className="hover:text-univrab-gold transition-colors">Pengumuman</Link></li>
                            <li><Link href="/about" className="hover:text-univrab-gold transition-colors">Tentang LPDSA</Link></li>
                            <li><Link href="/contact" className="hover:text-univrab-gold transition-colors">Kontak</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Hubungi Kami</h3>
                        <p className="text-sm">
                            {contactInfo.address}<br />
                            Email: {contactInfo.email}<br />
                            Telp: {contactInfo.phone}
                        </p>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {new Date().getFullYear()} LPDSA Universitas Abdurrab. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="https://univrab.ac.id" className="hover:text-white transition-colors">Official Website</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
