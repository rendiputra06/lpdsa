<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return;
        }

        for ($i = 1; $i <= 10; $i++) {
            $type = ($i <= 3) ? 'event' : 'regular';
            $category = $categories->random();
            
            if ($type === 'event') {
                $category = $categories->where('name', 'Event')->first() ?? $category;
            }

            $announcement = Announcement::create([
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'title' => "Pengumuman Dummy Ke-$i: " . ($type === 'event' ? 'Event Penting' : 'Informasi Akademik'),
                'content' => "Ini adalah konten untuk pengumuman dummy ke-$i. LPDSA Universitas Abdurrab berkomitmen untuk memberikan informasi yang transparan dan akurat kepada seluruh civitas akademika.",
                'excerpt' => "Ringkasan pengumuman dummy ke-$i...",
                'status' => 'published',
                'type' => $type,
                'published_at' => now()->subDays(10 - $i),
            ]);

            if ($type === 'event') {
                $announcement->eventDetail()->create([
                    'start_at' => now()->addDays($i + 5),
                    'end_at' => now()->addDays($i + 5)->addHours(4),
                    'location' => 'Aula Gedung Tariq Bin Ziyad',
                    'speaker' => 'Dr. Abdurrab, M.Si',
                    'quota' => 100,
                    'registration_link' => 'https://forms.gle/dummy',
                ]);
            }

            // Add attachments
            $announcement->attachments()->create([
                'title' => 'Dokumen Panduan PDF',
                'type' => 'file',
                'path' => 'attachments/sample.pdf',
            ]);

            $announcement->attachments()->create([
                'title' => 'Link Pendaftaran Eksternal',
                'type' => 'link',
                'path' => 'https://univrab.ac.id',
            ]);
        }
    }
}
