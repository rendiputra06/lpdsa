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
        Schema::create('academic_units', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'university', 'faculty', 'study_program'
            $table->string('code')->nullable(); // e.g., '55201', 'FT'
            $table->string('name'); // e.g. 'Teknik Informatika'
            $table->string('level')->nullable(); // 'D3', 'D4', 'S1', 'S2', 'S3', 'Profesi', 'Spesialis' (khusus prodi)
            $table->string('faculty_name')->nullable(); // Nama fakultas naungan (untuk prodi)
            $table->foreignId('parent_id')->nullable()->constrained('academic_units')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('code');
            $table->index('level');
        });

        Schema::create('accreditations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_unit_id')->nullable()->constrained('academic_units')->nullOnDelete();
            $table->string('unit_type'); // 'university', 'faculty', 'study_program'
            $table->string('unit_name'); // Denormalized name for persistence
            $table->string('level')->nullable(); // 'D3', 'D4', 'S1', 'S2', 'Profesi' (for prodi)
            $table->string('faculty_name')->nullable();
            $table->string('accreditation_body'); // 'BAN-PT', 'LAM-PTKes', 'LAM-INFOKOM', 'LAMDIK', 'LAMEMBA', etc.
            $table->string('grade'); // 'Unggul', 'Baik Sekali', 'Baik', 'A', 'B', 'C', dll.
            $table->string('sk_number');
            $table->date('sk_date')->nullable();
            $table->date('valid_until')->nullable();
            $table->string('certificate_file')->nullable();
            $table->string('status')->default('active'); // 'active', 'expired', 'in_process'
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['unit_type', 'status']);
            $table->index('level');
            $table->index('valid_until');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accreditations');
        Schema::dropIfExists('academic_units');
    }
};
