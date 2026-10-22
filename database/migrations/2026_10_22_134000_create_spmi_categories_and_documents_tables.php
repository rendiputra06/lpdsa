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
        Schema::create('spmi_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('cycle_stage')->default('penetapan'); // penetapan, pelaksanaan, evaluasi, pengendalian, peningkatan
            $table->string('sub_stage')->default('kebijakan'); // kebijakan, perangkat-spmi, standar, dll.
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['cycle_stage', 'sub_stage', 'is_active']);
            $table->index('order');
        });

        Schema::create('spmi_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spmi_category_id')->constrained('spmi_categories')->cascadeOnDelete();
            $table->string('document_number')->nullable();
            $table->string('title', 500);
            $table->integer('year');
            $table->string('file_path')->nullable();
            $table->text('external_url')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(true);
            $table->integer('download_count')->default(0);
            $table->timestamps();

            $table->index(['spmi_category_id', 'is_public']);
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spmi_documents');
        Schema::dropIfExists('spmi_categories');
    }
};
