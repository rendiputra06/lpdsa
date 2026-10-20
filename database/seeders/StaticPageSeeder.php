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
                'meta_description' => 'Bagan Struktur Organisasi, Tupoksi, dan Wewenang Lembaga Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab.',
                'data' => [
                    [
                        'id' => 'mem_1',
                        'name' => 'Dr. H. Nama Lengkap, M.Kom',
                        'position' => 'Ketua LPDSA',
                        'level' => '1',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'ketua.lpdsa@univrab.ac.id',
                        'responsibilities' => "- Memimpin dan mengendalikan seluruh penyelenggaraan penjaminan mutu dan pangkalan data institusi\n- Bertanggung jawab langsung kepada Rektor atas pencapaian sasaran mutu Universitas Abdurrab\n- Mengkoordinasikan perumusan kebijakan mutu, SPMI, dan strategi fasilitasi akreditasi prodi\n- Menyampaikan laporan berkala dan rekomendasi Rapat Tinjauan Manajemen (RTM) kepada pimpinan universitas",
                        'authorities' => "- Menetapkan kebijakan operasional penjaminan mutu dan pengelolaan pangkalan data\n- Mengesahkan instrumen evaluasi, instrumen Audit Mutu Internal (AMI), dan verifikasi borang akreditasi\n- Merekomendasikan tindak lanjut temuan audit dan pengendalian mutu kepada pimpinan unit/prodi\n- Mengkoordinasikan integrasi data universitas dengan PDDIKTI dan LLDIKTI",
                    ],
                    [
                        'id' => 'mem_2',
                        'name' => 'Nama Sekretaris, S.Kom., M.T',
                        'position' => 'Sekretaris Lembaga',
                        'level' => '2',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'sekretaris.lpdsa@univrab.ac.id',
                        'responsibilities' => "- Membantu Ketua dalam koordinasi operasional harian dan ketatausahaan lembaga\n- Mengelola dokumentasi, kearsipan persuratan resmi, dan repositori dokumen regulasi mutu\n- Mengoordinasikan penyusunan agenda kegiatan, rapat evaluasi berkala, dan workshop SPMI\n- Menyusun draf laporan kinerja tahunan dan pertanggungjawaban program kerja LPDSA",
                        'authorities' => "- Memverifikasi kelengkapan administrasi dan berkas instrumen sebelum diajukan ke Ketua\n- Mengatur jadwal kerja, rapat koordinasi, dan sinkronisasi lintas bidang di LPDSA\n- Mewakili Ketua LPDSA dalam rapat koordinasi teknis apabila Ketua berhalangan hadir",
                    ],
                    [
                        'id' => 'mem_3',
                        'name' => 'Koordinator SPMI, M.Pd',
                        'position' => 'Kepala Bidang SPMI & Audit Mutu',
                        'level' => '3',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'spmi@univrab.ac.id',
                        'responsibilities' => "- Melaksanakan siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan) standar mutu\n- Merancang dan memperbarui instrumen serta standar SPMI sesuai regulasi Kemendikbudristek\n- Mengkoordinasikan pelaksanaan Audit Mutu Internal (AMI) berkala di tingkat fakultas dan program studi\n- Memantau pelaksanaan Rencana Tindak Lanjut (RTL) hasil audit mutu institusi",
                        'authorities' => "- Menugaskan tim auditor mutu internal yang tersertifikasi pada siklus AMI\n- Mengesahkan laporan hasil audit kepatuhan standar mutu akademik dan non-akademik\n- Memberikan rekomendasi perbaikan sistem tata kelola mutu kepada Ketua LPDSA",
                    ],
                    [
                        'id' => 'mem_4',
                        'name' => 'Koordinator Pangkalan Data, S.T., M.Kom',
                        'position' => 'Kepala Bidang Pangkalan Data & Sistem',
                        'level' => '3',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'pddikti@univrab.ac.id',
                        'responsibilities' => "- Mengelola sinkronisasi berkala data akademik universitas ke sistem PDDIKTI Feeder nasional\n- Menjamin validitas, kelengkapan, dan integritas data mahasiswa, dosen, dan kurikulum kampus\n- Mengembangkan dan memelihara dashboard analitik data mutu dan statistik capaian universitas\n- Melayani kebutuhan data terverifikasi untuk evaluasi program studi dan pemeringkatan institusi",
                        'authorities' => "- Mengelola akun administrator dan hak akses integrasi feeder pangkalan data universitas\n- Melakukan validasi final sebelum proses checkpoint pelaporan semesteran PDDIKTI\n- Menetapkan standar format data teknis integrasi SIAKAD dengan repositori data pusat",
                    ],
                    [
                        'id' => 'mem_5',
                        'name' => 'Koordinator Fasilitasi Akreditasi, S.Si., M.Sc',
                        'position' => 'Kepala Bidang Fasilitasi Akreditasi',
                        'level' => '3',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'akreditasi@univrab.ac.id',
                        'responsibilities' => "- Memetakan jadwal dan masa berlaku akreditasi seluruh program studi di lingkungan universitas\n- Menyelenggarakan bimbingan teknis dan pendampingan penyusunan dokumen LED dan LKPS\n- Mengkoordinasikan simulasi asesmen lapangan bersama asesor internal sebelum evaluasi eksternal\n- Memfasilitasi seluruh proses visitasi Asesmen Lapangan (AL) daring maupun luring bersama LAM/BAN-PT",
                        'authorities' => "- Mereview kelayakan dokumen borang usulan akreditasi dan reakreditasi program studi\n- Memberikan catatan rekomendasi perbaikan dokumen evaluasi diri sebelum submit ke pangkalan LAM/BAN-PT\n- Berkoordinasi langsung dengan dekanat dan taskforce akreditasi program studi terkait",
                    ],
                    [
                        'id' => 'mem_6',
                        'name' => 'Nama Staf SPMI, S.Pd',
                        'position' => 'Staf Pelaksana Audit Mutu Internal',
                        'level' => '4',
                        'parentId' => 'mem_3',
                        'photo' => null,
                        'email' => 'staf.spmi@univrab.ac.id',
                        'responsibilities' => "- Membantu penyiapan administrasi dan formulir instrumen Audit Mutu Internal (AMI)\n- Mengarsipkan berkas audit kepatuhan standar dan dokumen bukti tindak lanjut (RTL)\n- Mengelola dokumentasi berita acara pelaksanaan audit mutu di tingkat program studi",
                        'authorities' => "- Menghimpun dan memeriksa kelengkapan berkas audit sebelum diserahkan ke auditor\n- Mengelola jadwal temu audit antara auditor internal dan pimpinan auditi",
                    ],
                    [
                        'id' => 'mem_7',
                        'name' => 'Nama Staf Pangkalan Data, S.Kom',
                        'position' => 'Staf Pengelola PDDIKTI & Feeder',
                        'level' => '4',
                        'parentId' => 'mem_4',
                        'photo' => null,
                        'email' => 'staf.pddikti@univrab.ac.id',
                        'responsibilities' => "- Mengunggah dan memverifikasi data pelaporan semesteran ke PDDIKTI Feeder\n- Melakukan rekonsiliasi data mahasiswa, dosen, dan kurikulum kampus dengan SIAKAD\n- Menangani permohonan pembaharuan dan perbaikan data civitas akademika",
                        'authorities' => "- Mengakses modul sinkronisasi aplikasi PDDIKTI Feeder universitas\n- Menyiapkan draft berita acara validasi data pelaporan semester",
                    ],
                    [
                        'id' => 'mem_8',
                        'name' => 'Nama Staf Administrasi, A.Md',
                        'position' => 'Staf Administrasi & Helpdesk Umum',
                        'level' => '4',
                        'parentId' => null,
                        'photo' => null,
                        'email' => 'layanan.lpdsa@univrab.ac.id',
                        'responsibilities' => "- Mengelola registrasi persuratan masuk dan keluar serta pengarsipan regulasi mutu\n- Memberikan pelayanan meja bantuan (helpdesk) permohonan data dan informasi LPDSA",
                        'authorities' => "- Mengeluarkan lembar tanda terima permohonan layanan data dan informasi",
                    ],
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
