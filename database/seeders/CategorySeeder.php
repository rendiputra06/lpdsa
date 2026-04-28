<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Akademik', 'description' => 'Informasi terkait kegiatan akademik universitas.'],
            ['name' => 'Akreditasi', 'description' => 'Update status dan proses akreditasi program studi.'],
            ['name' => 'SPMI', 'description' => 'Sistem Penjaminan Mutu Internal.'],
            ['name' => 'Umum', 'description' => 'Pengumuman umum untuk seluruh civitas akademika.'],
            ['name' => 'Event', 'description' => 'Informasi seminar, workshop, dan kegiatan lainnya.'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
