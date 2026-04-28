<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Banner::updateOrCreate(
            ['title' => 'Selamat Datang di Portal Pengumuman LPDSA'],
            [
                'text' => 'Informasi Terkini Seputar Pangkalan Data, SPMI, dan Akreditasi Universitas Abdurrab.',
                'image_path' => 'banners/default-hero.jpg',
                'link' => '/announcements',
                'is_active' => true,
                'order' => 1,
            ]
        );
    }
}
