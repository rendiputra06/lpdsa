<?php

namespace Database\Seeders;

use App\Models\SpmiCategory;
use App\Models\SpmiDocument;
use Illuminate\Database\Seeder;

class SpmiCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Visi, Misi, Tujuan dan Strategi',
                'slug' => 'visi-misi-tujuan-dan-strategi',
                'description' => 'Kebijakan mengenai arah pengembangan, visi, misi, tujuan, dan sasaran strategis Universitas Abdurrab.',
                'order' => 1,
                'documents' => [
                    [
                        'document_number' => '015/KEP/REK-UNIVRAB/I/2026',
                        'title' => 'Keputusan Rektor tentang Perubahan Visi, Misi, dan Rencana Strategis Universitas Abdurrab 2026-2030',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                        'description' => 'Dokumen penetapan arah strategis universitas periode 2026-2030.',
                    ],
                ],
            ],
            [
                'name' => 'Tata Pamong dan Tata Kelola',
                'slug' => 'tata-pamong-dan-tata-kelola',
                'description' => 'Kebijakan sistem tata pamong, kepemimpinan, sistem pengelolaan, dan penjaminan mutu.',
                'order' => 2,
                'documents' => [
                    [
                        'document_number' => '082/KEP/REK-UNIVRAB/II/2026',
                        'title' => 'Keputusan Rektor tentang Kebijakan Sistem Penjaminan Mutu Internal (SPMI) Universitas Abdurrab',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                        'description' => 'Pedoman umum pelaksanaan penjaminan mutu di lingkungan universitas.',
                    ],
                    [
                        'document_number' => '044/KEP/REK-UNIVRAB/III/2025',
                        'title' => 'Keputusan Rektor tentang Pedoman Struktur Tata Kelola dan Akuntabilitas Lembaga',
                        'year' => 2025,
                        'external_url' => 'https://drive.google.com',
                        'description' => 'Struktur organisasi dan pembagian wewenang universitas.',
                    ],
                ],
            ],
            [
                'name' => 'Mahasiswa',
                'slug' => 'mahasiswa',
                'description' => 'Kebijakan terkait layanan, hak, kewajiban, dan pembinaan mahasiswa.',
                'order' => 3,
                'documents' => [
                    [
                        'document_number' => '112/KEP/REK-UNIVRAB/IV/2026',
                        'title' => 'Keputusan Rektor tentang Kode Etik dan Tata Tertib Mahasiswa Universitas Abdurrab',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Penerimaan Mahasiswa Baru',
                'slug' => 'penerimaan-mahasiswa-baru',
                'description' => 'Kebijakan dan sistem seleksi penerimaan mahasiswa baru.',
                'order' => 4,
                'documents' => [
                    [
                        'document_number' => '029/KEP/REK-UNIVRAB/I/2026',
                        'title' => 'Keputusan Rektor tentang Pedoman Sistem Seleksi dan Penerimaan Mahasiswa Baru',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Sumber Daya Manusia',
                'slug' => 'sumber-daya-manusia',
                'description' => 'Kebijakan pembinaan dosen, tenaga kependidikan, beban kerja, dan pengembangan karir.',
                'order' => 5,
                'documents' => [
                    [
                        'document_number' => '198/KEP/REK-UNIVRAB/V/2026',
                        'title' => 'Keputusan Rektor tentang Pedoman Beban Kerja Dosen (BKD) dan Evaluasi Kinerja Dosen',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                    [
                        'document_number' => '142/KEP/REK-UNIVRAB/VI/2025',
                        'title' => 'Keputusan Rektor tentang Mekanisme Pemberian Beasiswa Studi Lanjut bagi Dosen',
                        'year' => 2025,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Keuangan',
                'slug' => 'keuangan',
                'description' => 'Kebijakan pengelolaan keuangan, alokasi anggaran, dan transparansi pembiayaan.',
                'order' => 6,
                'documents' => [
                    [
                        'document_number' => '071/KEP/REK-UNIVRAB/III/2026',
                        'title' => 'Keputusan Rektor tentang Standar Operasional Prosedur Pengelolaan dan Audit Keuangan',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Sarana Prasarana',
                'slug' => 'sarana-prasarana',
                'description' => 'Kebijakan pengelolaan aset, laboratorium, sarana perkuliahan, dan K3L.',
                'order' => 7,
                'documents' => [
                    [
                        'document_number' => '189/KEP/REK-UNIVRAB/VI/2026',
                        'title' => 'Keputusan Rektor tentang Pedoman Keselamatan, Kesehatan Kerja, dan Lingkungan (K3L)',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Kebijakan tata kelola teknologi informasi, keamanan siber, dan pangkalan data.',
                'order' => 8,
                'documents' => [
                    [
                        'document_number' => '210/KEP/REK-UNIVRAB/VII/2026',
                        'title' => 'Keputusan Rektor tentang Tata Kelola Sistem Informasi dan Keamanan Data Universitas',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Pendidikan',
                'slug' => 'pendidikan',
                'description' => 'Kebijakan kurikulum, proses pembelajaran, penilaian hasil belajar, dan suasana akademik.',
                'order' => 9,
                'documents' => [
                    [
                        'document_number' => '301/KEP/REK-UNIVRAB/VIII/2026',
                        'title' => 'Keputusan Rektor tentang Standar Kurikulum OBE dan Pedoman Penilaian Pembelajaran',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Penelitian',
                'slug' => 'penelitian',
                'description' => 'Kebijakan riset, peta jalan penelitian, pendanaan hibah internal, dan publikasi ilmiah.',
                'order' => 10,
                'documents' => [
                    [
                        'document_number' => '325/KEP/REK-UNIVRAB/VIII/2026',
                        'title' => 'Keputusan Rektor tentang Rencana Induk Riset (RIP) dan Kode Etik Publikasi Ilmiah',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Pengabdian kepada Masyarakat',
                'slug' => 'pengabdian-kepada-masyarakat',
                'description' => 'Kebijakan pengabdian masyarakat berbasis keilmuan dan pemberdayaan komunitas.',
                'order' => 11,
                'documents' => [
                    [
                        'document_number' => '340/KEP/REK-UNIVRAB/IX/2026',
                        'title' => 'Keputusan Rektor tentang Panduan Pengelolaan Pengabdian kepada Masyarakat',
                        'year' => 2026,
                        'external_url' => 'https://drive.google.com',
                    ],
                ],
            ],
            [
                'name' => 'Kerjasama',
                'slug' => 'kerjasama',
                'description' => 'Kebijakan kemitraan nasional, internasional, dan dunia usaha/industri.',
                'order' => 12,
                'documents' => [],
            ],
            [
                'name' => 'Kemahasiswaan',
                'slug' => 'kemahasiswaan',
                'description' => 'Kebijakan kegiatan penalaran, minat-bakat, organisasi, dan prestasi mahasiswa.',
                'order' => 13,
                'documents' => [],
            ],
            [
                'name' => 'Lulusan',
                'slug' => 'lulusan',
                'description' => 'Kebijakan pelacakan alumni (tracer study) dan pengguna lulusan.',
                'order' => 14,
                'documents' => [],
            ],
            [
                'name' => 'Kewirausahaan',
                'slug' => 'kewirausahaan',
                'description' => 'Kebijakan pembinaan inkubator bisnis dan kewirausahaan mahasiswa.',
                'order' => 15,
                'documents' => [],
            ],
        ];

        foreach ($categories as $catData) {
            $docs = $catData['documents'] ?? [];
            unset($catData['documents']);

            $catData['cycle_stage'] = 'penetapan';
            $catData['sub_stage'] = 'kebijakan';
            $catData['is_active'] = true;

            $category = SpmiCategory::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($docs as $doc) {
                SpmiDocument::updateOrCreate(
                    [
                        'spmi_category_id' => $category->id,
                        'title' => $doc['title'],
                    ],
                    [
                        'document_number' => $doc['document_number'] ?? null,
                        'year' => $doc['year'],
                        'external_url' => $doc['external_url'] ?? null,
                        'description' => $doc['description'] ?? null,
                        'is_public' => true,
                    ]
                );
            }
        }
    }
}
