<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Safely clear existing menus with foreign key checks disabled
        Schema::disableForeignKeyConstraints();
        Menu::truncate();
        Schema::enableForeignKeyConstraints();

        // 1. Home
        Menu::create([
            'label' => 'Home',
            'url' => '/',
            'type' => 'internal',
            'order' => 1,
        ]);

        // 2. Profil
        $profil = Menu::create([
            'label' => 'Profil',
            'url' => null,
            'type' => 'internal',
            'order' => 2,
        ]);

        Menu::create([
            'label' => 'Tentang LPDSA',
            'url' => '/about',
            'type' => 'internal',
            'parent_id' => $profil->id,
            'order' => 1,
        ]);

        Menu::create([
            'label' => 'Visi & Misi',
            'url' => '/visi-misi',
            'type' => 'internal',
            'parent_id' => $profil->id,
            'order' => 2,
        ]);

        Menu::create([
            'label' => 'Struktur Organisasi',
            'url' => '/struktur-organisasi',
            'type' => 'internal',
            'parent_id' => $profil->id,
            'order' => 3,
        ]);

        // Group Unit & Divisi Kerja di bawah Profil
        $unitHeader = Menu::create([
            'label' => 'Unit & Divisi Kerja',
            'url' => null,
            'type' => 'label',
            'parent_id' => $profil->id,
            'order' => 4,
        ]);

        Menu::create([
            'label' => 'Infrastruktur & Jaringan',
            'url' => '/infrastruktur-jaringan',
            'type' => 'internal',
            'parent_id' => $unitHeader->id,
            'order' => 1,
        ]);

        Menu::create([
            'label' => 'Pengembangan Aplikasi',
            'url' => '/pengembangan-aplikasi',
            'type' => 'internal',
            'parent_id' => $unitHeader->id,
            'order' => 2,
        ]);

        // 3. Layanan
        $layanan = Menu::create([
            'label' => 'Layanan',
            'url' => null,
            'type' => 'internal',
            'order' => 3,
        ]);

        Menu::create([
            'label' => 'Data Akreditasi',
            'url' => '/akreditasi',
            'type' => 'internal',
            'parent_id' => $layanan->id,
            'order' => 1,
        ]);

        Menu::create([
            'label' => 'Akreditasi Universitas',
            'url' => '/akreditasi/universitas',
            'type' => 'internal',
            'parent_id' => $layanan->id,
            'order' => 2,
        ]);

        Menu::create([
            'label' => 'Pusat Dokumen & SOP',
            'url' => '/dokumen',
            'type' => 'internal',
            'parent_id' => $layanan->id,
            'order' => 3,
        ]);

        Menu::create([
            'label' => 'Portal SPMI Univrab',
            'url' => 'https://spmi.univrab.ac.id',
            'type' => 'external',
            'parent_id' => $layanan->id,
            'order' => 4,
        ]);

        // 4. Pengumuman
        Menu::create([
            'label' => 'Pengumuman',
            'url' => '/announcements',
            'type' => 'internal',
            'order' => 4,
        ]);

        // 5. Kontak
        Menu::create([
            'label' => 'Kontak',
            'url' => '/contact',
            'type' => 'internal',
            'order' => 5,
        ]);
    }
}
