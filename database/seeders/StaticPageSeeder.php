<?php

namespace Database\Seeders;

use App\Models\StaticPage;
use Illuminate\Database\Seeder;

class StaticPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Tentang LPDSA',
                'slug' => 'about',
                'type' => 'default',
                'content' => '<p>Lembaga Pusat Data dan Sistem Informasi (LPDSA) adalah unit kerja di Universitas Abdurrab yang bertanggung jawab dalam pengelolaan infrastruktur IT, pengembangan sistem informasi, dan layanan data terpadu.</p>',
                'meta_description' => 'Mengenal LPDSA Universitas Abdurrab.',
                'data' => null,
            ],
            [
                'title' => 'Struktur Organisasi',
                'slug' => 'struktur-organisasi',
                'type' => 'org_structure',
                'content' => null,
                'meta_description' => 'Struktur Organisasi LPDSA.',
                'data' => [
                    [
                        'name' => 'Dr. H. Nama Lengkap, M.Kom',
                        'position' => 'Ketua LPDSA',
                        'level' => '1',
                        'photo' => null,
                    ],
                    [
                        'name' => 'Nama Sekretaris, S.Kom., M.T',
                        'position' => 'Sekretaris',
                        'level' => '2',
                        'photo' => null,
                    ]
                ],
            ],
            [
                'title' => 'Pusat Dokumen',
                'slug' => 'dokumen',
                'type' => 'documents',
                'content' => null,
                'meta_description' => 'Pusat unduhan dokumen publik LPDSA.',
                'data' => [
                    [
                        'title' => 'Pedoman Akademik 2026',
                        'description' => 'Buku panduan akademik untuk mahasiswa.',
                        'file' => null,
                        'is_external_link' => false,
                        'url' => '',
                    ],
                    [
                        'title' => 'Portal Sistem Informasi Terpadu',
                        'description' => 'Link menuju portal utama.',
                        'file' => null,
                        'is_external_link' => true,
                        'url' => 'https://sit.univrab.ac.id',
                    ]
                ],
            ],
            [
                'title' => 'Visi & Misi',
                'slug' => 'visi-misi',
                'type' => 'default',
                'content' => '<p><strong>Visi:</strong> Menjadi pusat data dan sistem informasi yang unggul, inovatif, dan terintegrasi berlandaskan nilai-nilai Rabbani, Amanah, dan Beradab.</p><h3>Misi LPDSA:</h3><ul><li>Mengembangkan dan mengelola infrastruktur teknologi informasi yang handal, mutakhir, dan aman.</li><li>Menyelenggarakan sistem informasi terpadu guna mendukung efektivitas tridharma perguruan tinggi.</li><li>Menyediakan layanan pengelolaan data yang akurat, cepat, dan transparan bagi seluruh civitas akademika.</li></ul>',
                'meta_description' => 'Visi dan Misi Lembaga Pusat Data dan Sistem Informasi (LPDSA).',
                'data' => null,
            ],
            [
                'title' => 'Hubungi Kami',
                'slug' => 'contact',
                'type' => 'default',
                'content' => '<p>Untuk informasi, konsultasi, dan pengaduan layanan sistem informasi atau data, silakan hubungi kami:</p><p><strong>Alamat:</strong> Gedung Rektorat Universitas Abdurrab, Jl. Riau Ujung No. 73, Tampan, Pekanbaru, Riau<br><strong>Email Layanan:</strong> lpdsa@univrab.ac.id<br><strong>Jam Operasional:</strong> Senin – Jumat (08.00 – 16.00 WIB)</p>',
                'meta_description' => 'Kontak dan Alamat Layanan LPDSA Universitas Abdurrab.',
                'data' => null,
            ],
            [
                'title' => 'Layanan Infrastruktur & Jaringan',
                'slug' => 'infrastruktur-jaringan',
                'type' => 'default',
                'content' => '<p>Divisi Infrastruktur & Jaringan bertanggung jawab penuh atas ketersediaan konektivitas internet kampus, pengelolaan server datacenter, keamanan siber, dan pemeliharaan perangkat jaringan di seluruh lingkungan Universitas Abdurrab.</p><h3>Cakupan Layanan:</h3><ul><li>Akses internet nirkabel (Univrab Wi-Fi) di seluruh gedung kampus.</li><li>Pemeliharaan server, datacenter lokal, dan cloud hosting universitas.</li><li>Proteksi firewall, VPN institusi, dan mitigasi ancaman siber.</li><li>Instalasi dan dukungan teknis perangkat keras jaringan.</li></ul>',
                'meta_description' => 'Layanan Infrastruktur & Jaringan LPDSA Universitas Abdurrab.',
                'data' => null,
            ],
            [
                'title' => 'Pengembangan Sistem & Aplikasi',
                'slug' => 'pengembangan-aplikasi',
                'type' => 'default',
                'content' => '<p>Divisi Pengembangan Sistem bertugas merancang, membangun, dan mengintegrasikan seluruh perangkat lunak serta aplikasi berbasis web dan mobile untuk mendukung tata kelola universitas.</p><h3>Portofolio Sistem Utama:</h3><ul><li>SIAKAD (Sistem Informasi Akademik Terpadu).</li><li>Portal Penerimaan Mahasiswa Baru (PMB Online).</li><li>Sister & Feeder PDDIKTI Terintegrasi.</li><li>Aplikasi Penjaminan Mutu & Audit Internal.</li></ul>',
                'meta_description' => 'Pengembangan Sistem dan Perangkat Lunak LPDSA Universitas Abdurrab.',
                'data' => null,
            ],
        ];

        foreach ($pages as $page) {
            StaticPage::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
