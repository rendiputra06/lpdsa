<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing menus to avoid duplication issues with nested structures
        Menu::truncate();

        // 1. Home
        Menu::create(['label' => 'Home', 'url' => '/', 'type' => 'internal', 'order' => 1]);

        // 2. Profil (Mega Menu)
        $profil = Menu::create(['label' => 'Profil', 'url' => '#', 'type' => 'internal', 'order' => 2]);

        // Column 1 Header
        $aboutHeader = Menu::create([
            'label' => 'Lembaga',
            'type' => 'label',
            'parent_id' => $profil->id,
            'order' => 1
        ]);

        Menu::create(['label' => 'Visi & Misi', 'url' => '/visi-misi', 'type' => 'internal', 'parent_id' => $aboutHeader->id, 'order' => 1]);
        Menu::create(['label' => 'Struktur Organisasi', 'url' => '/struktur-organisasi', 'type' => 'internal', 'parent_id' => $aboutHeader->id, 'order' => 2]);
        Menu::create(['label' => 'Tugas & Fungsi', 'url' => '/tugas-fungsi', 'type' => 'internal', 'parent_id' => $aboutHeader->id, 'order' => 3]);

        // Column 2 Header
        $docHeader = Menu::create([
            'label' => 'Dokumen & Regulasi',
            'type' => 'label',
            'parent_id' => $profil->id,
            'order' => 2
        ]);

        Menu::create(['label' => 'Pedoman SPMI', 'url' => '/pedoman-spmi', 'type' => 'internal', 'parent_id' => $docHeader->id, 'order' => 1]);
        Menu::create(['label' => 'Regulasi Akreditasi', 'url' => '/regulasi-akreditasi', 'type' => 'internal', 'parent_id' => $docHeader->id, 'order' => 2]);
        Menu::create(['label' => 'SOP Layanan', 'url' => '/sop', 'type' => 'internal', 'parent_id' => $docHeader->id, 'order' => 3]);

        // 3. Layanan
        $layanan = Menu::create(['label' => 'Layanan', 'url' => '#', 'type' => 'internal', 'order' => 3]);
        Menu::create(['label' => 'Pangkalan Data', 'url' => '/data', 'type' => 'internal', 'parent_id' => $layanan->id, 'order' => 1]);
        Menu::create(['label' => 'Penjaminan Mutu', 'url' => 'https://spmi.univrab.ac.id', 'type' => 'external', 'parent_id' => $layanan->id, 'order' => 2]);

        // 4. Pengumuman
        Menu::create(['label' => 'Pengumuman', 'url' => '/announcements', 'type' => 'internal', 'order' => 4]);

        // 5. Kontak
        Menu::create(['label' => 'Kontak', 'url' => '/contact', 'type' => 'internal', 'order' => 5]);
    }
}
