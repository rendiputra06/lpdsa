<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcement_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->boolean('is_cover')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Migrate existing announcement thumbnails to announcement_images
        $announcements = \Illuminate\Support\Facades\DB::table('announcements')
            ->whereNotNull('thumbnail')
            ->where('thumbnail', '!=', '')
            ->get();

        foreach ($announcements as $announcement) {
            \Illuminate\Support\Facades\DB::table('announcement_images')->insert([
                'announcement_id' => $announcement->id,
                'image_path' => $announcement->thumbnail,
                'caption' => null,
                'is_cover' => true,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_images');
    }
};
