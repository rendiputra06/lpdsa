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
        $menus = [
            ['label' => 'Home', 'url' => '/', 'order' => 1],
            ['label' => 'Pengumuman', 'url' => '/announcements', 'order' => 2],
            ['label' => 'Tentang Kami', 'url' => '/about', 'order' => 3],
            ['label' => 'Kontak', 'url' => '/contact', 'order' => 4],
        ];

        foreach ($menus as $menu) {
            Menu::updateOrCreate(['label' => $menu['label']], $menu);
        }
    }
}
