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
        StaticPage::updateOrCreate(
            ['slug' => 'about'],
            [
                'title' => 'Tentang LPDSA',
                'content' => '<h1>Profil LPDSA</h1><p>Lembaga Pangkalan Data, SPMI, dan Akreditasi (LPDSA) Universitas Abdurrab bertugas mengelola data, menjamin mutu internal, dan memfasilitasi akreditasi.</p>',
                'meta_description' => 'Informasi tentang LPDSA Universitas Abdurrab.',
            ]
        );

        StaticPage::updateOrCreate(
            ['slug' => 'contact'],
            [
                'title' => 'Kontak Kami',
                'content' => '<h1>Kontak</h1><p>Alamat: Jl. Riau Ujung No. 73, Pekanbaru</p><p>Email: lpdsa@univrab.ac.id</p>',
                'meta_description' => 'Hubungi LPDSA Universitas Abdurrab.',
            ]
        );
    }
}
