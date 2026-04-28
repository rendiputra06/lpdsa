<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            AnnouncementSeeder::class,
            MenuSeeder::class,
            StaticPageSeeder::class,
            BannerSeeder::class,
        ]);
    }
}
