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
        ];

        foreach ($pages as $page) {
            StaticPage::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
