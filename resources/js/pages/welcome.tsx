import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';

export default function Welcome({ banners, latestAnnouncements }: any) {
    return (
        <PublicLayout>
            <Head title="Pusat Pengumuman LPDSA" />

            {/* Hero Section / Banner */}
            <section className="relative bg-univrab-blue py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://univrab.ac.id/wp-content/uploads/2021/08/Gedung-Univrab.jpg')] bg-cover bg-center" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white text-center">
                    {banners.length > 0 ? (
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                {banners[0].title}
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                {banners[0].text}
                            </p>
                            <div className="mt-10 flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                                <Button size="lg" className="bg-univrab-gold text-slate-900 hover:bg-yellow-500" asChild>
                                    <Link href="/announcements">Lihat Pengumuman</Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                                    <Link href="/about">Tentang LPDSA</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                                Lembaga Pangkalan Data, SPMI, dan Akreditasi
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100 text-balance">
                                Universitas Abdurrab - Menjamin Mutu, Mengelola Data, Memfasilitasi Akreditasi.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Latest Announcements Section */}
            <section className="py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengumuman Terbaru</h2>
                            <p className="mt-2 text-slate-500 dark:text-neutral-400">Informasi terkini dari LPDSA Universitas Abdurrab.</p>
                        </div>
                        <Link href="/announcements" className="hidden sm:flex items-center gap-1 text-univrab-blue font-semibold hover:underline dark:text-univrab-gold">
                            Semua Pengumuman <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {latestAnnouncements.map((announcement: any) => (
                            <Card key={announcement.id} className="group overflow-hidden border-slate-200 bg-white hover:shadow-xl transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/50">
                                <CardHeader className="p-0">
                                    <div className="aspect-video w-full bg-slate-100 dark:bg-neutral-800 overflow-hidden relative">
                                        {announcement.thumbnail ? (
                                            <img src={announcement.thumbnail} alt={announcement.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300 dark:text-neutral-700">
                                                <Calendar className="h-12 w-12" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-univrab-blue/90 hover:bg-univrab-blue">
                                                {announcement.category.name}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(announcement.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <CardTitle className="line-clamp-2 text-xl leading-tight text-slate-900 group-hover:text-univrab-blue dark:text-white dark:group-hover:text-univrab-gold transition-colors">
                                        {announcement.title}
                                    </CardTitle>
                                    <p className="mt-3 line-clamp-3 text-sm text-slate-500 dark:text-neutral-400">
                                        {announcement.excerpt || announcement.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...'}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-6 pt-0">
                                    <Button variant="link" className="px-0 text-univrab-blue dark:text-univrab-gold group/btn" asChild>
                                        <Link href={`/announcements/${announcement.slug}`}>
                                            Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 text-center sm:hidden">
                         <Link href="/announcements" className="inline-flex items-center gap-1 text-univrab-blue font-semibold hover:underline">
                            Semua Pengumuman <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Call to Action */}
            <section className="bg-slate-100 dark:bg-neutral-900 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Butuh Bantuan atau Informasi Lebih Lanjut?</h2>
                    <p className="mt-4 text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto text-balance">
                        Jangan ragu untuk menghubungi tim LPDSA Universitas Abdurrab jika Anda memiliki pertanyaan seputar pangkalan data, SPMI, atau akreditasi.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" className="bg-univrab-blue hover:bg-blue-800" asChild>
                            <Link href="/contact">Hubungi Kami</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
